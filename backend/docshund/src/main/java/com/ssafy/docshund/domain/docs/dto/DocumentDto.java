package com.ssafy.docshund.domain.docs.dto;

import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.global.validation.ValidEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record DocumentDto(
	Integer docsId,
	@NotBlank(message = "Document category cannot be blank.") @Size(max = 30, message = "Document category must be within 30 characters.")
	String documentCategory,
	@NotBlank(message = "Document name cannot be blank.") @Size(max = 30, message = "Document name must be within 30 characters.")
	String documentName,
	String documentLogo,
	@NotNull @Size(max = 20, message = "Document version must be within 20 characters.")
	String documentVersion,
	@Min(0)
	Integer viewCount,
	Integer likeCount,  // Join을 통해 받아올 예정
	@NotNull(message = "Position cannot be null.") @ValidEnum(enumClass = Position.class, message = "Position must be one of 'FRONTEND', 'BACKEND', 'DBSQL'.")
	Position position,
	@NotBlank(message = "License cannot be blank.") @Size(max = 20, message = "License must be within 20 characters.")
	String license,
	@NotNull
	String documentLink,
	LocalDateTime createdAt,
	List<Long> likeUserIds) {

	// 문서 조회용
	public static DocumentDto fromEntity(Document document, int likeCount, List<Long> likeUserIds) {
		return new DocumentDto(
			document.getDocsId(),
			document.getDocumentCategory(),
			document.getDocumentName(),
			document.getDocumentLogo(),
			document.getDocumentVersion(),
			document.getViewCount(),
			likeCount, // likeCount 기본값 0
			document.getPosition(),
			document.getLicense(),
			document.getDocumentLink(),
			document.getCreatedAt(),
			likeUserIds
		);
	}
}
