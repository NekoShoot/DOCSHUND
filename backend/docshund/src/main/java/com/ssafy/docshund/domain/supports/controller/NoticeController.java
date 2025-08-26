package com.ssafy.docshund.domain.supports.controller;

import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.docshund.domain.supports.dto.notice.NoticeRequestDto;
import com.ssafy.docshund.domain.supports.dto.notice.NoticeResponseDto;
import com.ssafy.docshund.domain.supports.service.NoticeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/docshund/supports/notice")
public class NoticeController {

	private final NoticeService noticeService;
	private final MessageSource messageSource;

	@GetMapping
	public ResponseEntity<Page<NoticeResponseDto>> searchNotice(Pageable pageable) {
		return ResponseEntity.ok(noticeService.searchNotice(pageable));
	}

	@PostMapping
	public ResponseEntity<?> createNotice(@Valid @RequestBody NoticeRequestDto noticeRequestDto) {
		noticeService.createNotice(noticeRequestDto);
		String message = messageSource.getMessage("supports.notice.create.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(message);
	}

	@GetMapping("/{noticeId}")
	public ResponseEntity<NoticeResponseDto> getNoticeDetail(@PathVariable Integer noticeId) {
		return ResponseEntity.ok(noticeService.getNoticeDetail(noticeId));
	}

	@PatchMapping("/{noticeId}")
	public ResponseEntity<?> modifyNotice(@Valid @RequestBody NoticeRequestDto noticeRequestDto,
		@PathVariable Integer noticeId) {
		noticeService.modifyNotice(noticeRequestDto, noticeId);
		String message = messageSource.getMessage("supports.notice.update.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(message);
	}

	@DeleteMapping("/{noticeId}")
	public ResponseEntity<?> deleteNotice(@PathVariable Integer noticeId) {
		noticeService.deleteNotice(noticeId);
		String message = messageSource.getMessage("supports.notice.delete.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(message);
	}

}

