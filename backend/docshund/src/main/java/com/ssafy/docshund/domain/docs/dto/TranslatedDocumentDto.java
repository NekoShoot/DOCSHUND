package com.ssafy.docshund.domain.docs.dto;

import com.ssafy.docshund.domain.docs.entity.Status;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record TranslatedDocumentDto(
	Long transId,
	Integer originId,
	Long userId,
	@NotBlank(message = "Translated content is required and cannot be blank.") @Size(max = 50000, message = "Translated content must be within 50000 characters.")
	String content,
	Integer reportCount,
	Status status,
	LocalDateTime createdAt,
	LocalDateTime updatedAt,
	Integer likeCount,
	List<Long> likeUserIds
) {
	public static TranslatedDocumentDto fromEntity(TranslatedDocument translatedDocument,
		Integer likeCount, List<Long> likeUserIds) {
		return new TranslatedDocumentDto(
			translatedDocument.getTransId(),
			translatedDocument.getOriginDocument().getOriginId(),
			translatedDocument.getUser().getUserId(),
			translatedDocument.getContent(),
			translatedDocument.getReportCount(),
			translatedDocument.getStatus(),
			translatedDocument.getCreatedAt(),
			translatedDocument.getUpdatedAt(),
			likeCount,
			likeUserIds
		);
	}

	// 좋아요한 사용자 ID 추가
	public TranslatedDocumentDto withLikeUserIds(List<Long> likeUserIds) {
		return new TranslatedDocumentDto(
			this.transId, this.originId, this.userId, this.content,
			this.reportCount, this.status, this.createdAt, this.updatedAt, likeUserIds.size(), likeUserIds
		);
	}
}
