package com.ssafy.docshund.domain.supports.dto.inquiry;

import com.ssafy.docshund.domain.supports.entity.InquiryCategory;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InquiryRequestDto {

	@Email(message = "Invalid email format.")
	@NotBlank(message = "Email is required.")
	@Size(max = 80, message = "Email cannot exceed 80 characters.")
	@Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email cannot contain Korean characters.")
	private String email;

	@NotNull(message = "Title is required.")
	@Size(max = 50, message = "Title cannot exceed 50 characters.")
	private String title;

	@NotBlank
	private String category;

	@NotNull(message = "Content is required.")
	@Size(max = 2000, message = "Content cannot exceed 2000 characters.")
	private String content;

}
