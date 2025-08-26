package com.ssafy.docshund.domain.users.exception.user;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserExceptionCode implements ExceptionCode {

	USER_NOT_FOUND(NOT_FOUND, "M-C-001", "user.error.notFound"),
	MEMBER_DUPLICATE_ERROR(BAD_REQUEST, "M-C-002", "user.error.duplicateNickname"),
	NICKNAME_DUPLICATE_ERROR(BAD_REQUEST, "M-C-003", "user.error.duplicateEmail"),
	USER_INFO_NOT_FOUND(BAD_REQUEST, "M-C-004", "user.error.infoNotFound"),
	USER_BANNED(BAD_REQUEST, "M-C-005", "user.error.banned"),
	USER_WITHDRAW(BAD_GATEWAY, "M-C-006", "user.error.withdrawn");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
