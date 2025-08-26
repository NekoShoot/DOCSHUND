package com.ssafy.docshund.domain.forums.service;

import static com.ssafy.docshund.domain.forums.exception.ForumExceptionCode.MISMATCH_ARTICLE;
import static com.ssafy.docshund.domain.forums.exception.ForumExceptionCode.NOT_FOUND_ARTICLE;
import static com.ssafy.docshund.domain.forums.exception.ForumExceptionCode.NOT_FOUND_COMMENT;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.INVALID_MEMBER_ROLE;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.NOT_AUTHORIZATION_USER;
import static com.ssafy.docshund.global.exception.GlobalErrorCode.INVALID_RESOURCE_OWNER;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.docshund.domain.alerts.service.AlertsService;
import com.ssafy.docshund.domain.forums.dto.CommentDto;
import com.ssafy.docshund.domain.forums.dto.CommentInfoDto;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Comment;
import com.ssafy.docshund.domain.forums.entity.Status;
import com.ssafy.docshund.domain.forums.exception.ForumException;
import com.ssafy.docshund.domain.forums.repository.ArticleRepository;
import com.ssafy.docshund.domain.forums.repository.CommentRepository;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.exception.auth.AuthException;
import com.ssafy.docshund.domain.users.exception.user.UserException;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

	private final ArticleRepository articleRepository;
	private final CommentRepository commentRepository;
	private final UserUtil userUtil;
	private final MessageSource messageSource;
	private final AlertsService alertsService;

	@Override
	@Transactional(readOnly = true)
	public List<CommentInfoDto> getCommentsByArticleId(Integer articleId) {

		List<Comment> comments = commentRepository.findAllByArticleId(articleId);

		return comments.stream()
			.map(comment -> CommentInfoDto.from(comment, messageSource))
			.filter(Optional::isPresent)
			.map(Optional::get)
			.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<CommentInfoDto> getCommentsByUserId(Long userId) {

		List<Comment> comments = commentRepository.findAllByUserId(userId);

		return comments.stream()
			.map(comment -> CommentInfoDto.from(comment, messageSource))
			.filter(Optional::isPresent)
			.map(Optional::get)
			.toList();
	}

	@Override
	@Transactional
	public CommentInfoDto createComment(Integer articleId, CommentDto commentDto) {

		Article article = articleRepository.findById(articleId)
			.orElseThrow(() -> new ForumException(NOT_FOUND_ARTICLE));

		User user = userUtil.getUser();
		if (user == null) {
			throw new AuthException(NOT_AUTHORIZATION_USER);
		}

		Comment savedComment = commentRepository.save(new Comment(null, user, article, commentDto.getContent()));

		// 실시간 알림 보내기
		alertsService.sendCommentAlert(article, user);

		return new CommentInfoDto(savedComment.getArticle().getArticleId(), savedComment.getCommentId(),
			savedComment.getContent(),
			savedComment.getCreatedAt(), savedComment.getUpdatedAt(),
			savedComment.getUser().getUserId(), savedComment.getUser().getNickname(),
			savedComment.getUser().getProfileImage(), new ArrayList<>()
		);
	}

	@Override
	@Transactional
	public CommentInfoDto createReply(Integer articleId, Integer commentId, CommentDto commentDto) {

		User user = userUtil.getUser();
		if (user == null) {
			throw new AuthException(NOT_AUTHORIZATION_USER);
		}

		Article article = articleRepository.findById(articleId)
			.orElseThrow(() -> new ForumException(NOT_FOUND_ARTICLE));

		Comment parentComment = commentRepository.findById(commentId)
			.orElseThrow(() -> new ForumException(NOT_FOUND_COMMENT));

		Comment savedComment = commentRepository.save(
			new Comment(parentComment, user, article, commentDto.getContent()));

		// 실시간 알림 보내기
		alertsService.sendCommentAlert(article, user);    // 게시글 작성자에게도 알림
		alertsService.sendCommentReplyAlert(parentComment, user);    // 댓글 작성자에게도 알림

		return new CommentInfoDto(savedComment.getArticle().getArticleId(), savedComment.getCommentId(),
			savedComment.getContent(),
			savedComment.getCreatedAt(), savedComment.getUpdatedAt(),
			savedComment.getUser().getUserId(), savedComment.getUser().getNickname(),
			savedComment.getUser().getProfileImage(), new ArrayList<>()
		);
	}

	@Override
	@Transactional
	public void updateComment(Integer articleId, Integer commentId, CommentDto commentDto) {

		Comment comment = commentRepository.findById(commentId)
			.orElseThrow(() -> new ForumException(NOT_FOUND_COMMENT));

		if (!comment.getArticle().getArticleId().equals(articleId)) {
			throw new ForumException(MISMATCH_ARTICLE);
		}

		User user = userUtil.getUser();
		if (user == null || !comment.getUser().getUserId().equals(user.getUserId())) {
			throw new UserException(INVALID_RESOURCE_OWNER);
		}

		comment.modifyContent(commentDto.getContent());
	}

	@Override
	@Transactional
	public void deleteComment(Integer articleId, Integer commentId) {

		Comment comment = commentRepository.findById(commentId)
			.orElseThrow(() -> new ForumException(NOT_FOUND_COMMENT));

		if (!comment.getArticle().getArticleId().equals(articleId)) {
			throw new ForumException(MISMATCH_ARTICLE);
		}

		User user = userUtil.getUser();
		if (user == null || !comment.getUser().getUserId().equals(user.getUserId())) {
			throw new UserException(INVALID_RESOURCE_OWNER);
		}

		comment.modifyToDelete();
	}

	@Override
	@Transactional
	public void modifyCommentStatus(Integer articleId, Status status) {
		User user = userUtil.getUser();
		if (!userUtil.isAdmin(user)) {
			throw new AuthException(INVALID_MEMBER_ROLE);
		}

		Comment comment = commentRepository.findById(articleId)
			.orElseThrow(() -> new ForumException(NOT_FOUND_COMMENT));

		comment.modifyStatus(status);
	}
}
