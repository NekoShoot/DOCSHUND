package com.ssafy.docshund.domain.chats.controller;

import static com.ssafy.docshund.domain.chats.exception.WebSocketExceptionCode.INVALID_PRINCIPAL;

import java.security.Principal;
import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.ssafy.docshund.domain.chats.dto.ChatDto;
import com.ssafy.docshund.domain.chats.dto.ChatInfoDto;
import com.ssafy.docshund.domain.chats.entity.Chat;
import com.ssafy.docshund.domain.chats.entity.Status;
import com.ssafy.docshund.domain.chats.exception.WebSocketException;
import com.ssafy.docshund.domain.chats.service.ChatService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

	private final ChatService chatService;
	private final MessageSource messageSource;

	@MessageMapping("/chats/{docsId}")
	@SendTo("/sub/chats/{docsId}")
	public ChatInfoDto sendChat(
		@DestinationVariable Integer docsId,
		@Payload @Valid ChatDto chatDto,
		Principal principal
	) {

		if (principal == null) {
			throw new WebSocketException(INVALID_PRINCIPAL);
		}

		log.info("Principal received in ChatController -> {}", principal.getName());

		long userId;
		try {
			userId = Long.parseLong(principal.getName());
		} catch (Exception e) {
			throw new WebSocketException(INVALID_PRINCIPAL);
		}

		Chat savedChat = chatService.createChat(docsId, userId, chatDto);
		return ChatInfoDto.from(savedChat);
	}

	@GetMapping("/api/v1/docshund/chats/{docsId}")
	public ResponseEntity<Page<ChatInfoDto>> getChats(
		@PathVariable @Positive Integer docsId,
		@PageableDefault(page = 0, size = 50) Pageable pageable
	) {
		Page<ChatInfoDto> result = chatService.getChatsByDocsId(docsId, pageable);
		return ResponseEntity.ok(result);
	}

	@PatchMapping("/api/v1/docshund/chats/status/{chatId}")
	public ResponseEntity<?> modifyChatStatus(@PathVariable Long chatId, @RequestBody Status status) {
		chatService.modifyChatStatus(chatId, status);
		String message = messageSource.getMessage("chat.status.update.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(Map.of("message", message));
	}
}
