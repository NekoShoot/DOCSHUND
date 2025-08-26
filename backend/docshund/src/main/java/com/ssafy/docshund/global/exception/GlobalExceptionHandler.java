package com.ssafy.docshund.global.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;

import com.ssafy.docshund.global.mail.exception.MailException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

	private final MessageSource messageSource;

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ExceptionResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
		List<String> errors = exception.getBindingResult()
			.getFieldErrors()
			.stream()
			.map(error -> error.getField() + " " + error.getDefaultMessage())
			.collect(Collectors.toList());

		ExceptionResponse response = new ExceptionResponse(
			BAD_REQUEST.value(),
			"G-M-001",
			errors.get(0),
			LocalDateTime.now());
		return ResponseEntity.badRequest().body(response);
	}

	@ExceptionHandler(BindException.class)
	public ResponseEntity<ExceptionResponse> handleBindException(BindException exception) {
		List<String> errors = exception.getBindingResult()
			.getFieldErrors()
			.stream()
			.map(error -> error.getField() + " " + error.getDefaultMessage())
			.collect(Collectors.toList());

		ExceptionResponse response = new ExceptionResponse(
			BAD_REQUEST.value(),
			"G-M-001",
			errors.get(0),
			LocalDateTime.now());

		return ResponseEntity.badRequest().body(response);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ExceptionResponse> alreadyExistsValueInDataBase(
		DataIntegrityViolationException exception
	) {
		log.error("DataIntegrityViolationException: {}", exception.getMessage());
		String message = messageSource.getMessage("global.error.dataIntegrity", null, LocaleContextHolder.getLocale());
		ExceptionResponse response = new ExceptionResponse(BAD_REQUEST.value(), "G-DB-001", message, LocalDateTime.now());
		return ResponseEntity.badRequest().body(response);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ExceptionResponse> resourceNotFoundException(
		ResourceNotFoundException exception
	) {
		ExceptionCode exceptionCode = exception.getExceptionCode();
		String message = messageSource.getMessage(exceptionCode.getMessage(), null, LocaleContextHolder.getLocale());
		log.error("ResourceNotFoundException: {}", message);

		ExceptionResponse response = new ExceptionResponse(
			exceptionCode.getHttpStatus().value(),
			exceptionCode.getCode(),
			message,
			LocalDateTime.now());

		return new ResponseEntity<>(response, exceptionCode.getHttpStatus());
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ExceptionResponse> accessDeniedException(
		AccessDeniedException exception
	) {
		log.error("AccessDeniedException: {}", exception.getMessage());
		String message = messageSource.getMessage("global.error.accessDenied", null, LocaleContextHolder.getLocale());
		ExceptionResponse response = new ExceptionResponse(
			HttpStatus.FORBIDDEN.value(),
			"G-AC-001",
			message,
			LocalDateTime.now());

		return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ExceptionResponse> globalException(Exception e) {
		log.error("Unhandled Exception: ", e);
		String message = messageSource.getMessage("global.error.internalServerError", null, LocaleContextHolder.getLocale());
		ExceptionResponse response = new ExceptionResponse(
			INTERNAL_SERVER_ERROR.value(),
			"G-S-001",
			message,
			LocalDateTime.now());

		return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(response);
	}
}
