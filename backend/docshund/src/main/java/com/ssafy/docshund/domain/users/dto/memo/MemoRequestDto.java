package com.ssafy.docshund.domain.users.dto.memo;

import com.querydsl.core.annotations.QueryProjection;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MemoRequestDto {
	private Integer memoId;
	private Long userId;
	@NotNull(message = "Title cannot be empty.") @Size(max = 50, message = "Title must be within 50 characters.")
	private String title;
	@NotNull(message = "Content cannot be empty.") @Size(max = 15000, message = "Content must be within 15000 characters.")
	private String content;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@QueryProjection
	public MemoRequestDto(Integer memoId, Long userId, String title, String content, LocalDateTime createdAt,
		LocalDateTime updatedAt) {
		this.memoId = memoId;
		this.userId = userId;
		this.title = title;
		this.content = content;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}
