package com.ssafy.docshund.domain.supports.dto.report;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReportRequestDto {

	private Integer commentId;
	private Integer articleId;
	private Long transId;
	private Long chatId;
	private String category;

	@NotNull(message = "Content is required.")
	@Size(max = 500, message = "Content cannot exceed 500 characters.")
	private String content;

	private String originContent;

	private Long reportedUser;
}
