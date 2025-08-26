package com.ssafy.docshund.domain.alerts.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.stream.Collectors;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ssafy.docshund.domain.alerts.dto.AlertOutputDto;
import com.ssafy.docshund.domain.alerts.dto.Category;
import com.ssafy.docshund.domain.alerts.entity.Alert;
import com.ssafy.docshund.domain.alerts.exception.AlertsException;
import com.ssafy.docshund.domain.alerts.exception.AlertsExceptionCode;
import com.ssafy.docshund.domain.alerts.repository.AlertRepository;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Comment;
import com.ssafy.docshund.domain.supports.entity.Inquiry;
import com.ssafy.docshund.domain.users.dto.auth.CustomOAuth2User;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertsServiceImpl implements AlertsService {

	private final AlertRepository alertRepository;

	private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
	private final UserUtil userUtil;
	private final MessageSource messageSource;

	// 알림 단일 조회 시 사용하는 메소드
	@Transactional(readOnly = true)
	public Alert getAlert1(Long alertId) {
		return alertRepository.findById(alertId)
			.orElseThrow(() -> new AlertsException(AlertsExceptionCode.ALERT_NOT_FOUND));
	}

	// 알림 전체 조회
	@SuppressWarnings("checkstyle:WhitespaceAround")
	@Override
	@Transactional(readOnly = true)
	public List<AlertOutputDto> getAllAlerts() {
		User currentUser = userUtil.getUser();
		if (currentUser == null) {
			throw new AlertsException(AlertsExceptionCode.USER_NOT_AUTHORIZED);
		}
		Long userId = currentUser.getUserId();

		List<Alert> alerts = alertRepository.findByUserUserId(userId);
		return alerts.stream().map(this::convertToOutputDto).collect(Collectors.toList());
	}

	// 알림 단일 조회
	@Override
	@Transactional(readOnly = true)
	public AlertOutputDto getAlert(Long alertId) {
		Alert alert = getAlert1(alertId);
		User currentUser = userUtil.getUser();
		if (!currentUser.equals(alert.getUser()) && !userUtil.isAdmin(currentUser)) {
			throw new AlertsException(AlertsExceptionCode.NOT_YOUR_ALERT);
		}
		return convertToOutputDto(alert);
	}

	/*
	 ☆ SSE 연결 관련 로직 ☆
	 */
	public SseEmitter subscribe() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Object principal = authentication.getPrincipal();
		CustomOAuth2User customUser = (CustomOAuth2User)principal;
		Long userId = customUser.getUserId();

		if (userId == null) {
			throw new AlertsException(AlertsExceptionCode.USER_NOT_AUTHORIZED);
		}

		SseEmitter emitter = new SseEmitter(10 * 60 * 1000L); // 10분
		SseEmitter oldEmitter = emitters.put(userId, emitter);
		if (oldEmitter != null) {
			oldEmitter.complete(); // 기존 연결 종료 후 새로운 연결 생성
		}
		emitter.onCompletion(() -> emitters.remove(userId));
		emitter.onTimeout(() -> emitters.remove(userId));
		return emitter;
	}

	@Transactional
	public void sendAlert(Alert alert) {
		alertRepository.save(alert);
		sendToClient(alert.getUser().getUserId(), convertToOutputDto(alert));
	}

	private void sendToClient(Long userId, Object data) {
		SseEmitter emitter = emitters.get(userId);
		if (emitter != null) {
			try {
				emitter.send(SseEmitter.event().name("alert").data(data));
			} catch (IOException e) {
				emitter.completeWithError(e); // 에러 처리 후 제거
				log.info("emitter Error userId : {}", userId);
				emitters.remove(userId);
				emitters.put(userId, emitter);
			}
		}
	}

	// Alert -> AlertOutputDto 변환
	private AlertOutputDto convertToOutputDto(Alert alert) {
		Category category;
		Integer categoryId;
		String title;
		String content;
		Integer originArticleId;

		if (alert.getTranslatedDocument() != null) {
			category = Category.TRANS;
			categoryId = alert.getTranslatedDocument().getTransId().intValue();
			String docTitle = alert.getTranslatedDocument()
				.getOriginDocument()
				.getDocument()
				.getDocumentName(); // 번역 문서 제목 추가
			String sentence = getShortContent(alert.getTranslatedDocument().getContent()); // 번역 문장 추가
			title = messageSource.getMessage("alert.title.translation.liked", null, LocaleContextHolder.getLocale());
			content = messageSource.getMessage("alert.content.translation.liked", new Object[] {docTitle, sentence},
				LocaleContextHolder.getLocale());
			originArticleId = null;
		} else if (alert.getArticle() != null) {
			category = Category.ARTICLE;
			categoryId = alert.getArticle().getArticleId();
			String articleTitle = getShortContent(alert.getArticle().getTitle()); // 게시글 제목 추가
			title = messageSource.getMessage("alert.title.article.commented", null, LocaleContextHolder.getLocale());
			content = messageSource.getMessage("alert.content.article.commented", new Object[] {articleTitle},
				LocaleContextHolder.getLocale());
			originArticleId = null;
		} else if (alert.getComment() != null) {
			category = Category.COMMENT;
			categoryId = alert.getComment().getCommentId();
			String commentContent = getShortContent(alert.getComment().getContent()); // 댓글 내용 일부 가져오기
			title = messageSource.getMessage("alert.title.comment.replied", null, LocaleContextHolder.getLocale());
			content = messageSource.getMessage("alert.content.comment.replied", new Object[] {commentContent},
				LocaleContextHolder.getLocale());
			originArticleId = alert.getComment().getArticle().getArticleId();
		} else if (alert.getInquiry() != null) {
			category = Category.INQUIRY;
			categoryId = alert.getInquiry().getInquiryId();
			String inquiryTitle = getShortContent(alert.getInquiry().getTitle());    // 문의 제목 추가
			title = messageSource.getMessage("alert.title.inquiry.answered", null, LocaleContextHolder.getLocale());
			content = messageSource.getMessage("alert.content.inquiry.answered", new Object[] {inquiryTitle},
				LocaleContextHolder.getLocale());
			originArticleId = null;
		} else {
			throw new AlertsException(AlertsExceptionCode.UNKNOWN_CATEGORY);
		}

		return new AlertOutputDto(
			alert.getAlertId(),
			alert.getUser().getUserId(),
			category,
			categoryId,
			title,
			content,
			originArticleId,
			alert.getCreatedAt(),
			alert.getCheckedAt()
		);
	}

	// 내용이 너무 길면 일부만 가져오기 (20자까지만 표시)
	private String getShortContent(String content) {
		return (content.length() > 20) ? content.substring(0, 20) + "..." : content;
	}

	/*
	 ☆ SSE 연결 관련 로직 끝 ☆
	 */

	// 알림 삭제
	@Override
	@Transactional
	public void deleteAlert(Long alertId) {
		User user = userUtil.getUser();
		if (user == null) {
			throw new AlertsException(AlertsExceptionCode.USER_NOT_AUTHORIZED);
		}
		Alert alert = getAlert1(alertId);
		if (!alert.getUser().getUserId().equals(user.getUserId())) {
			throw new AlertsException(AlertsExceptionCode.NOT_YOUR_ALERT);
		}
		alertRepository.delete(alert);
	}

	// 알림 일괄 삭제
	@Override
	@Transactional
	public void deleteAlerts() {
		User user = userUtil.getUser();
		if (user == null) {
			throw new AlertsException(AlertsExceptionCode.USER_NOT_AUTHORIZED);
		}
		alertRepository.deleteAllByUser(user);
	}

	// 알림 읽음 처리
	@Override
	@Transactional
	public void readAlert(Long alertId) {
		User user = userUtil.getUser();
		if (user == null) {
			throw new AlertsException(AlertsExceptionCode.USER_NOT_AUTHORIZED);
		}
		Alert alert = getAlert1(alertId);
		if (alert.getCheckedAt() != null) {
			throw new AlertsException(AlertsExceptionCode.ALREADY_REQUESTED);
		}
		if (!alert.getUser().getUserId().equals(user.getUserId())) {
			throw new AlertsException(AlertsExceptionCode.NOT_YOUR_ALERT);
		}
		alert.setCheckedAt(LocalDateTime.now()); // 읽은 시간을 현재로 지정 후 저장
		alertRepository.save(alert);
	}

	// 알림 일괄 읽음 처리
	@Override
	@Transactional
	public void readAlerts() {
		User user = userUtil.getUser();
		if (user == null) {
			throw new AlertsException(AlertsExceptionCode.USER_NOT_AUTHORIZED);
		}

		List<Alert> alerts = alertRepository.findByUserUserId(user.getUserId());

		// 체크되지 않은 알림 업데이트
		List<Alert> updatedAlerts = new ArrayList<>();
		for (Alert alert : alerts) {
			if (alert.getCheckedAt() == null) {
				alert.setCheckedAt(LocalDateTime.now());
				updatedAlerts.add(alert);
			}
		}

		alertRepository.saveAll(updatedAlerts);
	}

	// 번역 좋아요 알림 전송
	@Override
	@Transactional
	public void sendTranslationVoteAlert(TranslatedDocument translatedDocument, User voter) {
		User author = translatedDocument.getUser(); // 번역을 작성한 유저

		// 본인이 자신의 번역에 좋아요하면 알림을 보내지 않음
		if (author.equals(voter)) {
			return;
		}

		// 새로운 알림 생성
		String title = messageSource.getMessage("alert.title.translation.liked", null, LocaleContextHolder.getLocale());
		Alert alert = new Alert(
			title,
			author,
			translatedDocument, null, null, null,
			null
		);

		alertRepository.save(alert);

		// SSE 실시간 알림 전송
		sendToClient(author.getUserId(), convertToOutputDto(alert));
	}

	// 게시글 좋아요 알림 (고도화시 고려)
	//	@Override
	//	@Transactional
	//	public void sendArticleLikeAlert(Article article, User liker) {
	//		// 게시글 작성자
	//		User author = article.getUser();
	//
	//		// 본인이 자신의 게시글에 좋아요하면 알림을 보내지 않음
	//		if (author.equals(liker)) {
	//			return;
	//		}
	//	}

	// 게시글 댓글 알림 전송
	@Override
	@Transactional
	public void sendCommentAlert(Article article, User user) {
		// 게시글 작성자
		User author = article.getUser();

		// 본인이 자신의 게시글에 댓글을 달면 알림을 보내지 않음
		if (author.equals(user)) {
			return;
		}

		// 새로운 알림 생성
		String title = messageSource.getMessage("alert.title.article.commented", null, LocaleContextHolder.getLocale());
		Alert alert = new Alert(
			title,
			author,
			null, article, null, null,
			null
		);

		alertRepository.save(alert);

		// SSE 실시간 알림 전송
		sendToClient(author.getUserId(), convertToOutputDto(alert));

	}

	// 게시글 대댓글 알림 전송
	@Override
	@Transactional
	public void sendCommentReplyAlert(Comment parentComment, User user) {
		// 댓글 작성자
		User author = parentComment.getUser();

		// 자신의 대댓글인 경우 알림을 보내지 않음
		if (author.equals(user)) {
			return;
		}

		// 새로운 알림 생성
		String title = messageSource.getMessage("alert.title.comment.replied", null, LocaleContextHolder.getLocale());
		Alert alert = new Alert(
			title,
			author,
			null, null, parentComment, null,
			null
		);

		alertRepository.save(alert);

		sendToClient(author.getUserId(), convertToOutputDto(alert));
	}

	// 문의에 답변이 달렸을 시 알림 전송
	@Override
	@Transactional
	public void sendInquiryAnswerAlert(Inquiry inquiry) {
		// 문의 작성자
		User author = inquiry.getUser();

		// 새로운 알림 생성
		String title = messageSource.getMessage("alert.title.inquiry.answered", null, LocaleContextHolder.getLocale());
		Alert alert = new Alert(
			title,
			author,
			null, null, null, inquiry,
			null
		);

		alertRepository.save(alert);

		// SSE 실시간 알림 전송
		sendToClient(author.getUserId(), convertToOutputDto(alert));
	}

}
