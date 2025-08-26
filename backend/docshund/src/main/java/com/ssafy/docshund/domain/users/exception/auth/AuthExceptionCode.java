package com.ssafy.docshund.domain.users.exception.auth;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuthExceptionCode implements ExceptionCode {

	/**
	 * JWT
	 * 001 ~ 099
	 */
	INVALID_TOKEN(UNAUTHORIZED, "AT-C-001", "auth.error.jwt.invalid"),
	EXPIRED_TOKEN(UNAUTHORIZED, "AT-C-002", "auth.error.jwt.expired"),
	REQUEST_TOKEN_NOT_FOUND(BAD_REQUEST, "AT-C-003", "auth.error.jwt.notFound"),
	INVALID_ACCESS_TOKEN(BAD_REQUEST, "AT-C-004", "auth.error.jwt.invalidAccess"),
	UNTRUSTED_CREDENTIAL(UNAUTHORIZED, "AT-C-005", "auth.error.jwt.untrusted"),

	/**
	 * MEMBER
	 * 100 ~ 199
	 */
	LOGIN_PROVIDER_MISMATCH(BAD_REQUEST, "AT-C-100", "auth.error.member.providerMismatch"),
	INVALID_LOGIN_PROVIDER(BAD_REQUEST, "AT-C-101", "auth.error.member.invalidProvider"),
	INVALID_MEMBER_ROLE(FORBIDDEN, "AT-C-102", "auth.error.member.invalidRole"),
	NOT_AUTHORIZATION_USER(UNAUTHORIZED, "AT-C-103", "auth.error.member.notAuthorized"),
	INVALID_REDIRECT_URI(UNAUTHORIZED, "AT-C-104", "auth.error.member.invalidRedirectUri"),
	AUTH_MEMBER_NOT_FOUND(NOT_FOUND, "AT-C-105", "auth.error.member.notFound"),

	/**
	 * Common Exception
	 * 200 ~
	 */
	AUTHENTICATION_ERROR(UNAUTHORIZED, "AT-C-200", "auth.error.common.authenticationError"),

	/**
	 * Exception
	 * 400 ~
	 */
	BAD_REQUEST_EXCEPTION(BAD_REQUEST, "AT-S-400", "auth.error.common.badRequest"),

	INVALID_AUTHORIZATION_CODE(BAD_REQUEST, "KA-C-001", "auth.error.common.invalidAuthCode");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
