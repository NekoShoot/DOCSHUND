package com.ssafy.docshund.domain.docs.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum DocsExceptionCode implements ExceptionCode {
	
	USER_NOT_FOUND(NOT_FOUND, "D-C-001", "docs.error.userNotFound"),
	USER_NOT_AUTHORIZED(UNAUTHORIZED, "D-C-002", "docs.error.userNotAuthorized"),
	NO_PERMISSION(FORBIDDEN, "D-C-003", "docs.error.noPermission"),
	NOT_YOUR_CONTENT(FORBIDDEN, "D-C-004", "docs.error.notYourContent"),
	DOCS_NOT_FOUND(NOT_FOUND, "D-C-005", "docs.error.docsNotFound"),
	ORIGIN_NOT_FOUND(NOT_FOUND, "D-C-006", "docs.error.originNotFound"),
	TRANSLATION_NOT_FOUND(NOT_FOUND, "D-C-007", "docs.error.translationNotFound"),
	REQUIRED_IS_EMPTY(BAD_REQUEST, "D-C-008", "docs.error.requiredIsEmpty"),
	TOO_MANY_REQUEST(TOO_MANY_REQUESTS, "D-C-009", "docs.error.tooManyRequest"),
	ILLEGAL_ARGUMENT(BAD_REQUEST, "D-C-010", "docs.error.illegalArgument"),
	PYTHON_ERROR(INTERNAL_SERVER_ERROR, "D-C-011", "docs.error.pythonError"),
	ALREADY_EXIST_ORIGIN(BAD_REQUEST, "D-C-012", "docs.error.alreadyExistOrigin"),
	INVALID_FILE_TYPE(BAD_REQUEST, "D-C-013", "docs.error.invalidFileType"),
	MISMATCH_TRANSLATION_AND_DOCS(BAD_REQUEST, "D-C-014", "docs.error.mismatchTranslationAndDocs");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
