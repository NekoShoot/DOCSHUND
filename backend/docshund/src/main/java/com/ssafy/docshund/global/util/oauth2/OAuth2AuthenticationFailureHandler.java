package com.ssafy.docshund.global.util.oauth2;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

	private final MessageSource messageSource;

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException exception) throws IOException, ServletException {

		String errorCode = "UNKNOWN_ERROR";
		if (exception instanceof OAuth2AuthenticationException) {
			errorCode = ((OAuth2AuthenticationException)exception).getError().getErrorCode();
		}

		String redirectUrl;
		log.info("exception {}", exception.toString());
		log.info("errorCode {}", errorCode);

		Locale locale = request.getLocale();

		if ("USER_BANNED".equals(errorCode)) {
			String message = messageSource.getMessage("auth.failure.banned", null, locale);
			redirectUrl = "https://docshund.site/error?status=403&message=" + URLEncoder.encode(message,
				StandardCharsets.UTF_8);
		} else if ("USER_WITHDRAW".equals(errorCode)) {
			String message = messageSource.getMessage("auth.failure.withdrawn", null, locale);
			redirectUrl = "https://docshund.site/error?status=410&message=" + URLEncoder.encode(message,
				StandardCharsets.UTF_8);
		} else {
			redirectUrl = "https://docshund.site/";
		}

		getRedirectStrategy().sendRedirect(request, response, redirectUrl);
	}

}
    
