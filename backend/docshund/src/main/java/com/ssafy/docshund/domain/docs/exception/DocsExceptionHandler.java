package com.ssafy.docshund.domain.docs.exception;

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
public class DocsExceptionHandler {

	private final MessageSource messageSource;

	@ExceptionHandler(DocsException.class)
	public ResponseEntity<ExceptionResponse> docsException(
		DocsException exception
	) {
		ExceptionCode exceptionCode = exception.getExceptionCode();
		String messageKey = exceptionCode.getMessage();
		String localizedMessage = messageSource.getMessage(messageKey, null, LocaleContextHolder.getLocale());

		log.error("DocsException: code={}, message={}", exceptionCode.getCode(), localizedMessage);

		ExceptionResponse responseBody = new ExceptionResponse(
			exceptionCode.getHttpStatus().value(),
			exceptionCode.getCode(),
			localizedMessage, // 번역된 메시지를 사용
			LocalDateTime.now()
		);

		return new ResponseEntity<>(
			responseBody,
			exception.getExceptionCode().getHttpStatus()
		);
	}
}
