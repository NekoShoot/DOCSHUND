package com.ssafy.docshund.domain.forums.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ForumExceptionCode implements ExceptionCode {

	INVALID_CATEGORY(BAD_REQUEST, "F-C-001", "forums.error.invalidCategory"),
	MISMATCH_ARTICLE(BAD_REQUEST, "F-C-002", "forums.error.mismatchArticle"),
	NOT_FOUND_COMMENT(NOT_FOUND, "F-C-003", "forums.error.commentNotFound"),
	NOT_FOUND_ARTICLE(NOT_FOUND, "F-C-004", "forums.error.articleNotFound");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
