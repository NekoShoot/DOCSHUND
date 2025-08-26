package com.ssafy.docshund.domain.supports.controller;

import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.INVALID_MEMBER_ROLE;

import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.docshund.domain.supports.dto.inquiry.AnswerRequestDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.InquiryRequestDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.page.InquiryAndAnswerDto;
import com.ssafy.docshund.domain.supports.service.InquiryService;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.exception.auth.AuthException;
import com.ssafy.docshund.global.util.user.UserUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/docshund/supports/inquiry")
public class InquiryController {

	private final InquiryService inquiryServiceImpl;
	private final UserUtil userUtil;
	private final MessageSource messageSource;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> createInquiry(
		@Valid @RequestPart("inquiry") InquiryRequestDto inquiryRequestDto,
		@RequestPart(value = "file", required = false) MultipartFile file) {

		inquiryServiceImpl.createInquiry(inquiryRequestDto, file);
		String message = messageSource.getMessage("supports.inquiry.create.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(message);
	}

	@PostMapping("/{inquiryId}/answer")
	public ResponseEntity<?> respondToInquiry(@PathVariable Long inquiryId,
		@Valid @RequestBody AnswerRequestDto answerRequestDto) {

		User user = userUtil.getUser();
		if (user == null || !userUtil.isAdmin(user)) {
			throw new AuthException(INVALID_MEMBER_ROLE);
		}

		inquiryServiceImpl.respondToInquiry(inquiryId, answerRequestDto);
		String message = messageSource.getMessage("supports.inquiry.answer.create.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(message);
	}

	@GetMapping
	public ResponseEntity<Page<InquiryAndAnswerDto>> getInquiries(@RequestParam(required = false) Long userId,
		Pageable pageable) {
		return ResponseEntity.ok(inquiryServiceImpl.getInquiries(userId, pageable));
	}
}

