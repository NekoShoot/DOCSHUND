package com.ssafy.docshund.domain.supports.service;

import static com.ssafy.docshund.domain.docs.exception.DocsExceptionCode.TRANSLATION_NOT_FOUND;
import static com.ssafy.docshund.domain.forums.exception.ForumExceptionCode.NOT_FOUND_ARTICLE;
import static com.ssafy.docshund.domain.forums.exception.ForumExceptionCode.NOT_FOUND_COMMENT;
import static com.ssafy.docshund.domain.supports.exception.report.ReportExceptionCode.*;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.INVALID_MEMBER_ROLE;
import static com.ssafy.docshund.domain.users.exception.user.UserExceptionCode.USER_NOT_FOUND;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.docshund.domain.chats.entity.Chat;
import com.ssafy.docshund.domain.chats.repository.ChatRepository;
import com.ssafy.docshund.domain.docs.entity.Status;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import com.ssafy.docshund.domain.docs.exception.DocsException;
import com.ssafy.docshund.domain.docs.repository.TranslatedDocumentRepository;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Comment;
import com.ssafy.docshund.domain.forums.exception.ForumException;
import com.ssafy.docshund.domain.forums.repository.ArticleRepository;
import com.ssafy.docshund.domain.forums.repository.CommentRepository;
import com.ssafy.docshund.domain.supports.dto.report.ReportRequestDto;
import com.ssafy.docshund.domain.supports.dto.report.ReportResponseDto;
import com.ssafy.docshund.domain.supports.entity.Report;
import com.ssafy.docshund.domain.supports.exception.report.ReportException;
import com.ssafy.docshund.domain.supports.repository.ReportRepository;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.entity.UserInfo;
import com.ssafy.docshund.domain.users.exception.auth.AuthException;
import com.ssafy.docshund.domain.users.exception.user.UserException;
import com.ssafy.docshund.domain.users.repository.UserInfoRepository;
import com.ssafy.docshund.global.aws.s3.S3FileUploadService;
import com.ssafy.docshund.global.exception.GlobalErrorCode;
import com.ssafy.docshund.global.exception.ResourceNotFoundException;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

	private final int INVISIBLE_REPORT_COUNT = 5;

	private final UserUtil userUtil;
	private final S3FileUploadService fileUploadService;
	private final ReportRepository reportRepositroy;
	private final UserInfoRepository userInfoRepository;
	private final CommentRepository commentRepository;
	private final ChatRepository chatRepository;
	private final TranslatedDocumentRepository translatedDocumentRepository;
	private final ArticleRepository articleRepository;

	@Override
	@Transactional(readOnly = true)
	public Page<ReportResponseDto> searchReportUsers(Long userId, Pageable pageable) {
		isAdminByReport();
		return reportRepositroy.searchReportUsers(userId, pageable);
	}

	@Override
	@Transactional
	//report로 requestPart로 받기
	public void reportUser(ReportRequestDto reportRequestDto, MultipartFile file) {
		User user = userUtil.getUser();
		if (user == null) {
			throw new AuthException(INVALID_MEMBER_ROLE);
		}

		if (userUtil.isMine(reportRequestDto.getReportedUser(), user)) {
			throw new ReportException(REPORT_IS_MINE);
		}

		String imageUrl = null;
		if (file != null) {
			imageUrl = fileUploadService.uploadFile(file, "inquiry");
		}

		Report report = Report.createReport(reportRequestDto, user, imageUrl);

		handleCommentReport(reportRequestDto, user, report);
		handleArticleReport(reportRequestDto, user, report);
		handleTranslatedDocumentReport(reportRequestDto, user, report);
		handleChatReport(reportRequestDto, user, report);

		UserInfo reportedUserInfo = userInfoRepository.findByUserAndUserInfo(reportRequestDto.getReportedUser())
			.orElseThrow(() -> new UserException(USER_NOT_FOUND));

		reportedUserInfo.increaseReportCount();

		reportRepositroy.save(report);
	}

	@Override
	@Transactional
	public void withdrawReport(Integer reportId) {
		isAdminByReport();

		Report report = reportRepositroy.findById(reportId)
			.orElseThrow(() -> new ReportException(REPORT_NOT_FOUND));
		UserInfo reportedUserInfo = userInfoRepository.findByUserAndUserInfo(report.getReportedUser())
			.orElseThrow(() -> new UserException(USER_NOT_FOUND));

		handleWithdrawTranslatedDocumentReport(report, reportedUserInfo);
		handleWithdrawArticleReport(report, reportedUserInfo);
		handleWithdrawCommentReport(report, reportedUserInfo);
		handleWithdrawChatReport(report, reportedUserInfo);
	}

	private void handleCommentReport(ReportRequestDto reportRequestDto, User user, Report report) {
		if (reportRequestDto.getCommentId() != null) {
			if (reportRepositroy.existsByUserAndCommentId(user, reportRequestDto.getCommentId())) {
				throw new ReportException(ALREADY_REPORTED_REPORT);
			}
			Comment comment = commentRepository.findById(reportRequestDto.getCommentId())
				.orElseThrow(() -> new ForumException(NOT_FOUND_COMMENT));
			comment.increaseReportCount();
			report.addCommentId(reportRequestDto.getCommentId());

			if (comment.getReportCount() >= INVISIBLE_REPORT_COUNT) {
				comment.modifyToInvisible();
			}
		}
	}

	private void handleArticleReport(ReportRequestDto reportRequestDto, User user, Report report) {
		if (reportRequestDto.getArticleId() != null) {
			if (reportRepositroy.existsByUserAndArticleId(user, reportRequestDto.getArticleId())) {
				throw new ReportException(ALREADY_REPORTED_REPORT);
			}
			Article article = articleRepository.findById(reportRequestDto.getArticleId())
				.orElseThrow(() -> new ForumException(NOT_FOUND_ARTICLE));
			article.increaseReportCount();
			report.addArticleId(reportRequestDto.getArticleId());

			if (article.getReportCount() >= INVISIBLE_REPORT_COUNT) {
				article.modifyToInvisible();
			}
		}
	}

	private void handleTranslatedDocumentReport(ReportRequestDto reportRequestDto, User user, Report report) {
		if (reportRequestDto.getTransId() != null) {
			if (reportRepositroy.existsByUserAndTransId(user, reportRequestDto.getTransId())) {
				throw new ReportException(ALREADY_REPORTED_REPORT);
			}
			TranslatedDocument translatedDocument = translatedDocumentRepository.findById(reportRequestDto.getTransId())
				.orElseThrow(() -> new DocsException(TRANSLATION_NOT_FOUND));
			translatedDocument.increaseReportCount();
			report.addTrnasId(reportRequestDto.getTransId());

			if (translatedDocument.getReportCount() >= INVISIBLE_REPORT_COUNT) {
				translatedDocument.modifyStatus(Status.INVISIBLE);
			}
		}
	}

	private void handleChatReport(ReportRequestDto reportRequestDto, User user, Report report) {
		if (reportRequestDto.getChatId() != null) {
			if (reportRepositroy.existsByUserAndChatId(user, reportRequestDto.getChatId())) {
				throw new ReportException(ALREADY_REPORTED_REPORT);
			}
			Chat chat = chatRepository.findById(reportRequestDto.getChatId())
				.orElseThrow(() -> new ResourceNotFoundException(GlobalErrorCode.RESOURCE_NOT_FOUND));
			chat.increaseReportCount();
			report.addChatId(reportRequestDto.getChatId());

			if (chat.getReportCount() >= INVISIBLE_REPORT_COUNT) {
				chat.modifyToInvisible();
			}
		}
	}

	private void handleWithdrawTranslatedDocumentReport(Report report, UserInfo reportedUserInfo) {
		if (report.getTransId() != null) {
			int reportCount = reportRepositroy.deleteAllByTransId((report.getTransId()));
			TranslatedDocument translatedDocument = translatedDocumentRepository.findById(report.getTransId())
				.orElseThrow(() -> new DocsException(TRANSLATION_NOT_FOUND));
			translatedDocument.resetReportCount();
			reportedUserInfo.decreaseReportCount(reportCount);
		}
	}

	private void handleWithdrawArticleReport(Report report, UserInfo reportedUserInfo) {
		if (report.getArticleId() != null) {
			int reportCount = reportRepositroy.deleteAllByArticleId((report.getArticleId()));
			Article article = articleRepository.findById(report.getArticleId())
				.orElseThrow(() -> new ForumException(NOT_FOUND_ARTICLE));
			article.resetReportCount();
			reportedUserInfo.decreaseReportCount(reportCount);
		}
	}

	private void handleWithdrawCommentReport(Report report, UserInfo reportedUserInfo) {
		if (report.getCommentId() != null) {
			int reportCount = reportRepositroy.deleteAllByCommentId((report.getCommentId()));
			Comment comment = commentRepository.findById(report.getCommentId())
				.orElseThrow(() -> new ForumException(NOT_FOUND_COMMENT));
			comment.resetReportCount();
			reportedUserInfo.decreaseReportCount(reportCount);
		}
	}

	private void handleWithdrawChatReport(Report report, UserInfo reportedUserInfo) {
		if (report.getChatId() != null) {
			int reportCount = reportRepositroy.deleteAllByChatId((report.getChatId()));
			Chat chat = chatRepository.findById(report.getChatId())
				.orElseThrow(() -> new ResourceNotFoundException(GlobalErrorCode.RESOURCE_NOT_FOUND));
			chat.resetReportCount();
			reportedUserInfo.decreaseReportCount(reportCount);
		}
	}

	private void isAdminByReport() {
		if (!userUtil.isAdmin(userUtil.getUser())) {
			throw new AuthException(INVALID_MEMBER_ROLE);
		}
	}
}
