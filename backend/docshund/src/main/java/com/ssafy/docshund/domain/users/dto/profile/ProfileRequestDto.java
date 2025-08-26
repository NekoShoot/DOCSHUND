package com.ssafy.docshund.domain.users.dto.profile;

import com.ssafy.docshund.domain.users.entity.Hobby;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileRequestDto {
	@Size(max = 10, message = "Cannot exceed 10 characters.")
	@Pattern(
		regexp = "^(?!멍멍이$|ワンワン$)(?!.*[\\p{So}\\uFE0F\\u200D]).*$",
		message = "This nickname cannot be used."
	)
	@NotBlank(message = "This nickname cannot be used.")
	private String nickname;

	@Size(max = 200, message = "Introduction cannot exceed 200 characters.")
	@NotNull(message = "Introduction is required.") // null 금지
	private String introduce;

	@NotNull(message = "This field is required.")
	private Boolean isDarkmode;

	private String hobby;

	public Hobby getHobbyEnum() {
		return hobby != null ? Hobby.fromString(hobby) : null;
	}
}
