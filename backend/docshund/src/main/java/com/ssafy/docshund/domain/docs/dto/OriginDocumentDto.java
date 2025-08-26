package com.ssafy.docshund.domain.docs.dto;

import com.ssafy.docshund.domain.docs.entity.OriginDocument;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OriginDocumentDto(
	Integer originId,
	@NotNull(message = "Document is required.")
	Integer docsId,
	@NotNull @Min(1)
	Integer pOrder,
	@NotNull @Size(max = 10, message = "Tag must be within 10 characters.")
	String tag,
	@NotNull @Size(max = 20000, message = "Original document content must be within 20000 characters per paragraph.")
	String content) {

	public static OriginDocumentDto fromEntity(OriginDocument originDocument) {
		return new OriginDocumentDto(
			originDocument.getOriginId(),
			originDocument.getDocument().getDocsId(),
			originDocument.getPOrder(),
			originDocument.getTag(),
			originDocument.getContent()
		);
	}
}
