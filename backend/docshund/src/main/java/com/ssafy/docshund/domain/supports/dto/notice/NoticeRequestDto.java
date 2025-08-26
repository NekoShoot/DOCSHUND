package com.ssafy.docshund.domain.supports.dto.notice;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NoticeRequestDto {

	@NotNull(message = "Title is required.")
	@Size(max = 50, message = "Title cannot exceed 50 characters.")
	private String title;

	@NotNull(message = "Content is required.")
	@Size(max = 15000, message = "Content cannot exceed 15000 characters.")
	private String content;
}
