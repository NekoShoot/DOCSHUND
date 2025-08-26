package com.ssafy.docshund.domain.supports.dto.inquiry;

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
public class AnswerRequestDto {

	@NotNull(message = "Content is required.")
	@Size(max = 2000, message = "Content cannot exceed 2000 characters.")
	String content;
}
