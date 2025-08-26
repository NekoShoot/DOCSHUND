package com.ssafy.docshund.domain.chats.exception;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum WebSocketExceptionCode implements ExceptionCode {

    INVALID_PRINCIPAL(FORBIDDEN, "C-C-001", "chat.error.invalidPrincipal"),
    CHAT_NOT_FOUND(NOT_FOUND, "C-S-001", "chat.error.notFound");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
