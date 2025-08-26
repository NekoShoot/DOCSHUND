package com.ssafy.docshund.domain.supports.exception.inquiry;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum InquiryExceptionCode implements ExceptionCode {

	INQUIRY_NOT_FOUND(NOT_FOUND, "S-C-002", "supports.inquiry.error.notFound");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
    
