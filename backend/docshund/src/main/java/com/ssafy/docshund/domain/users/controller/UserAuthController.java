package com.ssafy.docshund.domain.users.controller;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ssafy.docshund.domain.users.service.UserAuthServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/docshund/users")
public class UserAuthController {

	private final UserAuthServiceImpl userAuthServiceImpl;
	private final MessageSource messageSource;

	@GetMapping("/leaving")
	public ResponseEntity<String> logout() {
		userAuthServiceImpl.deleteUser();

		String message = messageSource.getMessage("user.auth.leave.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok().body(message);
	}
}

