package com.ssafy.docshund.global.mail.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MailExceptionCode implements ExceptionCode {

	MAIL_NOT_SEND(BAD_REQUEST, "M-S-001", "mail.error.sendFail"),
	IMAGE_NOT_DOWNLOAD(BAD_REQUEST, "M-S-002", "mail.error.imageDownloadFail"),
	MAIL_NOT_FOUND(BAD_REQUEST, "M-S-003", "mail.error.invalidMail");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
