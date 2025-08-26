package com.ssafy.docshund.domain.supports.exception.report;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportExceptionCode implements ExceptionCode {

	REPORT_NOT_FOUND(NOT_FOUND, "R-C-001", "supports.report.error.notFound"),
	ALREADY_REPORTED_REPORT(BAD_REQUEST, "R-C-002", "supports.report.error.alreadyReported"),
	REPORT_IS_MINE(BAD_REQUEST, "R-C-003", "supports.report.error.selfReport");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
