package com.ssafy.docshund.domain.supports.exception.notice;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NoticeExceptionCode implements ExceptionCode {

	NOTICE_NOT_FOUND(NOT_FOUND, "N-S-001", "supports.notice.error.notFound");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
