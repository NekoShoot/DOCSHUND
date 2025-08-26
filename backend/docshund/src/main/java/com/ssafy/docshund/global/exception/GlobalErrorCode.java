package com.ssafy.docshund.global.exception;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GlobalErrorCode implements ExceptionCode {

	SERVER_ERROR(INTERNAL_SERVER_ERROR, "G-S-001", "global.error.server"),
	INVALID_REQUEST_METHOD(METHOD_NOT_ALLOWED, "G-C-001", "global.error.invalidMethod"),
	INVALID_REQUEST_DATA(BAD_REQUEST, "G-C-002", "global.error.invalidData"),
	INVALID_RESOURCE_OWNER(FORBIDDEN, "G-C-003", "global.error.noPermission"),
	RESOURCE_NOT_FOUND(NOT_FOUND, "G-C-004", "global.error.resourceNotFound");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
