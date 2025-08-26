package com.ssafy.docshund.domain.supports.entity;

import java.util.Locale;

import org.springframework.context.MessageSource;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum InquiryCategory {
	DOCUMENT_REQUEST("inquiry.category.DOCUMENT_REQUEST"),
	MEMBER("inquiry.category.MEMBER"),
	REPORT("inquiry.category.REPORT");

	private final String descriptionKey;

	public String getLocalizedDescription(MessageSource messageSource, Locale locale) {
		return messageSource.getMessage(this.descriptionKey, null, locale);
	}
}
