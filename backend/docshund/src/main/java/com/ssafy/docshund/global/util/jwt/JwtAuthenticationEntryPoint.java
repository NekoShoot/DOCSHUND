package com.ssafy.docshund.global.util.jwt;

import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private final MessageSource messageSource;
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException authException) throws IOException, ServletException {
		String exception = (String)request.getAttribute("exception");

		if (exception == null) {
			log.info("잘못된 요청");
			setResponse(request, response, UNTRUSTED_CREDENTIAL);
			return;
		}

		if (exception.equals(REQUEST_TOKEN_NOT_FOUND.getCode())) {
			log.info("AccessToken이 없음");
			setResponse(request, response, INVALID_TOKEN);
			return;
		}

		if (exception.equals(EXPIRED_TOKEN.getCode())) {
			log.info("토큰 만료됨, 401 Unauthorized 반환");
			setResponse(request, response, EXPIRED_TOKEN);  //
			return;
		}

		if (exception.equals(INVALID_TOKEN.getCode())) {
			setResponse(request, response, INVALID_TOKEN);
		}
	}

	private void setResponse(HttpServletRequest request, HttpServletResponse response, AuthExceptionCode errorCode)
		throws IOException {
		String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
		// 보안 필터 단계는 MVC LocaleResolver 이전이므로, 서블릿 요청의 Accept-Language 를 직접 사용한다.
		Locale locale = request.getLocale();
		String message = messageSource.getMessage(errorCode.getMessage(), null, locale);

		response.setContentType("application/json;charset=UTF-8");
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // ✅ 401 Unauthorized 강제 반환
		response.getWriter().println(
			"{ " +
				"\"statusCode\" : \"" + HttpServletResponse.SC_UNAUTHORIZED + "\", " + // ✅ 401 상태 코드 고정
				"\"code\" : \"" + errorCode.getCode() + "\", " +
				"\"message\" : \"" + message + "\", " +
				"\"timestamp\" : \"" + timestamp + "\"" +
				"}"
		);
	}
}
