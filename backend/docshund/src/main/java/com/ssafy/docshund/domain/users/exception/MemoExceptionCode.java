package com.ssafy.docshund.domain.users.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum MemoExceptionCode implements ExceptionCode {

	USER_NOT_FOUND(NOT_FOUND, "MM-C-001", "memo.error.userNotFound"),
	USER_NOT_AUTHORIZED(UNAUTHORIZED, "MM-C-002", "memo.error.userNotAuthorized"),
	NO_PERMISSION(FORBIDDEN, "MM-C-003", "memo.error.noPermission"),
	NOT_YOUR_MEMO(FORBIDDEN, "MM-C-004", "memo.error.notYourMemo"),
	MEMO_NOT_FOUND(NOT_FOUND, "MM-C-005", "memo.error.memoNotFound"),
	REQUIRED_IS_EMPTY(BAD_REQUEST, "MM-C-006", "memo.error.requiredIsEmpty"),
	TOO_MANY_REQUEST(TOO_MANY_REQUESTS, "MM-C-007", "memo.error.tooManyRequest"),
	ILLEGAL_ARGUMENT(BAD_REQUEST, "MM-C-008", "memo.error.illegalArgument");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
