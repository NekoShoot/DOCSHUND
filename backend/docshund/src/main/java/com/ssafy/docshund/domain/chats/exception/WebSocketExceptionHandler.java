package com.ssafy.docshund.domain.chats.exception;

import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class WebSocketExceptionHandler {

	private final MessageSource messageSource;

	@MessageExceptionHandler(WebSocketException.class)
	@SendToUser("/queue/errors")
	public ErrorMessage handleWebSocketException(
		WebSocketException exception
	) {
		String localizedMessage = messageSource.getMessage(exception.getExceptionCode().getMessage(), null,
			LocaleContextHolder.getLocale());
		log.error("WebSocketException: {}", localizedMessage);
		return new ErrorMessage("WEBSOCKET_ERROR", localizedMessage);
	}

	@ExceptionHandler(WebSocketException.class)
	public ResponseEntity<?> handleHttpException(WebSocketException exception) {
		ExceptionCode exceptionCode = exception.getExceptionCode();
		String messageKey = exceptionCode.getMessage();
		String localizedMessage = messageSource.getMessage(messageKey, null, LocaleContextHolder.getLocale());

		log.error("ChatHttpException: code={}, message={}", exceptionCode.getCode(), localizedMessage);

		Map<String, String> responseBody = Map.of("code", exceptionCode.getCode(), "message", localizedMessage);

		return new ResponseEntity<>(responseBody, exceptionCode.getHttpStatus());
	}

	@Getter
	@AllArgsConstructor
	public static class ErrorMessage {
		private String errorType;
		private String message;
	}
}
