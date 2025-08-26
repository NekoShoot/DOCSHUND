package com.ssafy.docshund.domain.alerts.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum AlertsExceptionCode implements ExceptionCode {
	
	USER_NOT_FOUND(NOT_FOUND, "AL-C-001", "alert.error.userNotFound"),
	USER_NOT_AUTHORIZED(UNAUTHORIZED, "AL-C-002", "alert.error.userNotAuthorized"),
	NO_PERMISSION(FORBIDDEN, "AL-C-003", "alert.error.noPermission"),
	NOT_YOUR_ALERT(FORBIDDEN, "AL-C-004", "alert.error.notYourAlert"),
	ALERT_NOT_FOUND(NOT_FOUND, "AL-C-005", "alert.error.alertNotFound"),
	REQUIRED_IS_EMPTY(BAD_REQUEST, "AL-C-006", "alert.error.requiredIsEmpty"),
	TOO_MANY_REQUEST(TOO_MANY_REQUESTS, "AL-C-007", "alert.error.tooManyRequest"),
	ILLEGAL_ARGUMENT(BAD_REQUEST, "AL-C-008", "alert.error.illegalArgument"),
	ALREADY_REQUESTED(CONFLICT, "AL-C-009", "alert.error.alreadyRequested"),
	UNKNOWN_CATEGORY(INTERNAL_SERVER_ERROR, "AL-S-001", "alert.error.unknownCategory");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
