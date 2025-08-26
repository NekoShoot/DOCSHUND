package com.ssafy.docshund.domain.forums.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import com.ssafy.docshund.domain.forums.entity.Comment;
import com.ssafy.docshund.domain.forums.entity.Status;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentInfoDto {
	private Integer articleId;
	private Integer commentId;
	private String content;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Long userId;
	private String nickname;
	private String profileImage;
	private List<CommentInfoDto> replies;

	public static Optional<CommentInfoDto> from(Comment comment, MessageSource messageSource){
		Status status = comment.getStatus();
		boolean isHidden = (status == Status.INVISIBLE || status == Status.DELETED);
		
		List<CommentInfoDto> filteredReplies = comment.getReplies().stream()
			.map(reply -> CommentInfoDto.from(reply, messageSource))
			.filter(Optional::isPresent)
			.map(Optional::get)
			.toList();

		if(isHidden && filteredReplies.isEmpty()){
			return Optional.empty();
		}

		return Optional.of(new CommentInfoDto(
			comment.getArticle().getArticleId(),
			comment.getCommentId(),
			isHidden ? getHiddenContent(status, messageSource) : comment.getContent(),
			comment.getCreatedAt(), // createdAt
			comment.getUpdatedAt(), // updatedAt
			isHidden ? null : comment.getUser().getUserId(),
			isHidden ? messageSource.getMessage("forums.comment.defaultNickname", null, LocaleContextHolder.getLocale()) : comment.getUser().getNickname(),
			isHidden ? "https://docshundbucket.s3.ap-northeast-2.amazonaws.com/small_logo.png" : comment.getUser().getProfileImage(),
			filteredReplies // replies
		));
	}

	private static String getHiddenContent(Status status, MessageSource messageSource) {
		String messageKey = (status == Status.DELETED) ? "forums.comment.deleted" : "forums.comment.hidden";
		return messageSource.getMessage(messageKey, null, LocaleContextHolder.getLocale());
	}
}
