package com.ssafy.docshund.domain.supports.entity;

import java.util.Arrays;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReportCategory {
	ABUSIVE_LANGUAGE_OR_VIOLENCE("report.category.ABUSIVE_LANGUAGE_OR_VIOLENCE"),
	EXPLICIT_OR_ILLEGAL_CONTENT("report.category.EXPLICIT_OR_ILLEGAL_CONTENT"),
	PROMOTING_GAMBLING("report.category.PROMOTING_GAMBLING"),
	SPAM_OR_ADVERTISING("report.category.SPAM_OR_ADVERTISING"),
	FLOODING("report.category.FLOODING"),
	PERSONAL_INFORMATION_EXPOSURE("report.category.PERSONAL_INFORMATION_EXPOSURE"),
	COPYRIGHT_INFRINGEMENT("report.category.COPYRIGHT_INFRINGEMENT"),
	OTHER("report.category.OTHER");

	private final String descriptionKey;

	public static ReportCategory fromDescription(String description) {
		return Arrays.stream(ReportCategory.values())
			.filter(category -> category.name().equalsIgnoreCase(description)) // 클라이언트에서는 영어 Enum 이름을 보내는 것으로 가정
			.findFirst()
			.orElseThrow(() -> new IllegalArgumentException("Invalid report category: " + description));
	}
}
    
