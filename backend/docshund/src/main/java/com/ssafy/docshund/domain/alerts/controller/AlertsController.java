package com.ssafy.docshund.domain.alerts.controller;

import java.util.List;
import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ssafy.docshund.domain.alerts.dto.AlertOutputDto;
import com.ssafy.docshund.domain.alerts.service.AlertsService;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/docshund/alerts")
@RequiredArgsConstructor
public class AlertsController {

	private final AlertsService alertsService;
	private final UserUtil userUtil;
	private final MessageSource messageSource;


	// 알림 목록 조회
	@GetMapping("")
	public ResponseEntity<List<AlertOutputDto>> getAlerts(
	) {
		List<AlertOutputDto> alerts = alertsService.getAllAlerts();
		return ResponseEntity.ok(alerts);
	}

	// 알림 상세 조회
	@GetMapping("/{alertId}")
	public ResponseEntity<AlertOutputDto> getAlert(
		@PathVariable Long alertId
	) {
		AlertOutputDto alert = alertsService.getAlert(alertId);
		return ResponseEntity.ok(alert);
	}

	// 알림 삭제
	@DeleteMapping("/{alertId}")
	public ResponseEntity<?> deleteAlert(
		@PathVariable Long alertId
	) {
		alertsService.deleteAlert(alertId);
		String message = messageSource.getMessage("alert.delete.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok().body(Map.of("message", message));
	}

	// 알림 일괄 삭제
	@DeleteMapping("")
	public ResponseEntity<?> deleteAlerts(
	) {
		alertsService.deleteAlerts();
		String message = messageSource.getMessage("alert.delete.bulk.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok().body(Map.of("message", message));
	}

	// 알림 조회 처리
	@PatchMapping("/{alertId}")
	public ResponseEntity<?> readAlert(
		@PathVariable Long alertId
	) {
		alertsService.readAlert(alertId);
		String message = messageSource.getMessage("alert.read.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok().body(Map.of("message", message));
	}

	// 알림 일괄 조회 처리
	@PatchMapping("")
	public ResponseEntity<?> readAlerts(
	) {
		alertsService.readAlerts();
		String message = messageSource.getMessage("alert.read.bulk.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok().body(Map.of("message", message));
	}

	// 알림 받기 (SSE 연결)
	@GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe() {
		return alertsService.subscribe();
	}
}
