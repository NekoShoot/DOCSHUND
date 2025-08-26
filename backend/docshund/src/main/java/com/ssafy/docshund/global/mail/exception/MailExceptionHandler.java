package com.ssafy.docshund.global.mail.exception;

import java.time.LocalDateTime;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ssafy.docshund.global.exception.ExceptionCode;
import com.ssafy.docshund.global.exception.ExceptionResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class MailExceptionHandler {

	private final MessageSource messageSource;

	@ExceptionHandler(MailException.class)
	public ResponseEntity<ExceptionResponse> mailException(
		MailException exception
	) {
		ExceptionCode exceptionCode = exception.getExceptionCode();
		String messageKey = exceptionCode.getMessage();
		String localizedMessage = messageSource.getMessage(messageKey, null, LocaleContextHolder.getLocale());

		log.error("MailException: code={}, message={}", exceptionCode.getCode(), localizedMessage);

		ExceptionResponse responseBody = new ExceptionResponse(
			exceptionCode.getHttpStatus().value(),
			exceptionCode.getCode(),
			localizedMessage,
			LocalDateTime.now()
		);

		return new ResponseEntity<>(
			responseBody,
			exception.getExceptionCode().getHttpStatus()
		);
	}
}
