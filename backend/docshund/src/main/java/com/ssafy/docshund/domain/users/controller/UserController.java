package com.ssafy.docshund.domain.users.controller;

import com.ssafy.docshund.domain.users.dto.memo.MemoRequestDto;
import com.ssafy.docshund.domain.users.dto.memo.MemoResponseDto;
import com.ssafy.docshund.domain.users.dto.page.UserAndInfoDto;
import com.ssafy.docshund.domain.users.dto.page.UserProfileDto;
import com.ssafy.docshund.domain.users.dto.page.UserSearchCondition;
import com.ssafy.docshund.domain.users.dto.profile.ProfileRequestDto;
import com.ssafy.docshund.domain.users.dto.profile.UserStatusRequestDto;
import com.ssafy.docshund.domain.users.entity.Hobby;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.exception.auth.AuthException;
import com.ssafy.docshund.domain.users.service.UserService;
import com.ssafy.docshund.global.util.user.UserUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.AUTH_MEMBER_NOT_FOUND;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.INVALID_MEMBER_ROLE;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/docshund/users")
public class UserController {

	private final UserService userService;
	private final UserUtil userUtil;
	private final MessageSource messageSource;

	@GetMapping
	public ResponseEntity<Page<UserAndInfoDto>> searchUsers(@RequestParam(required = false) String nickname,
		@RequestParam(required = false) String email, @RequestParam(required = false) Hobby category,
		Pageable pageable) {
		User user = userUtil.getUser();

		if (user == null || !userUtil.isAdmin(user)) {
			throw new AuthException(INVALID_MEMBER_ROLE);
		}

		UserSearchCondition condition = new UserSearchCondition(nickname, email, category);
		Page<UserAndInfoDto> users = userService.searchUsers(condition, pageable);

		return ResponseEntity.ok(users);
	}

	@GetMapping("/profile")
	public ResponseEntity<String> duplicatedUserNickname(
		@RequestParam @Size(max = 20, message = "닉네임은 10자 이하입니다") String nickname) {
		String message = userService.duplicateNickname(nickname);
		return ResponseEntity.ok(message);
	}

	@GetMapping("/profile/{userId}")
	public ResponseEntity<UserProfileDto> getProfileUser(@PathVariable Long userId) {
		UserProfileDto userProfile = userService.getUserProfile(userId);

		if (userProfile == null) {
			throw new AuthException(AUTH_MEMBER_NOT_FOUND);
		}

		return ResponseEntity.ok(userProfile);
	}

	@PatchMapping(value = "/profile/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> modifyProfile(@PathVariable Long userId,
		@Valid @RequestPart("profile") ProfileRequestDto request,
		@RequestPart(value = "file", required = false) MultipartFile file) {
		User user = userUtil.getUser();
		if (user == null || !userUtil.isMine(userId, user)) {
			throw new AuthException(INVALID_MEMBER_ROLE);
		}

		userService.modifyUserProfile(user, request, file);

		String message = messageSource.getMessage("user.profile.update.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(message);
	}

	@PatchMapping("/{userId}/status")
	public ResponseEntity<String> modifyUserStatus(@PathVariable Long userId,
		@Valid @RequestBody UserStatusRequestDto userStatusRequestDto) {

		userService.modifyUserStatus(userId, userStatusRequestDto);

		String message = messageSource.getMessage("user.status.update.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(message);
	}

	// 메모 생성
	@PostMapping("/{userId}/memo")
	public ResponseEntity<Map<String, String>> createMemo(
		@PathVariable Long userId,
		@RequestBody MemoRequestDto memoRequestDto) {

		userService.createMemo(userId, memoRequestDto);

		String message = messageSource.getMessage("user.memo.create.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(Map.of("message", message));
	}

	// 메모 조회 (단일)
	@GetMapping("/{userId}/memo/{memoId}")
	public ResponseEntity<MemoResponseDto> getMemo(
		@PathVariable Long userId,
		@PathVariable Integer memoId) {

		// 메모 조회
		MemoResponseDto memo = userService.getMemo(userId, memoId);

		return ResponseEntity.ok(memo);
	}

	// 메모 조회 (일괄, 프론트에서 페이지네이션 처리)
	@GetMapping("/{userId}/memo")
	public ResponseEntity<List<MemoResponseDto>> getMemos(
		@PathVariable Long userId) {

		// 메모 조회
		List<MemoResponseDto> memos = userService.getMemos(userId);

		return ResponseEntity.ok(memos);
	}

	// 메모 수정
	@PatchMapping("/{userId}/memo/{memoId}")
	public ResponseEntity<Map<String, String>> modifyMemo(
		@PathVariable Long userId,
		@PathVariable Integer memoId,
		@RequestBody MemoRequestDto memoRequestDto) {

		// 메모 수정
		userService.modifyMemo(userId, memoId, memoRequestDto);

		String message = messageSource.getMessage("user.memo.update.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(Map.of("message", message));
	}

	// 메모 삭제
	@DeleteMapping("/{userId}/memo/{memoId}")
	public ResponseEntity<Map<String, String>> deleteMemo(
		@PathVariable Long userId,
		@PathVariable Integer memoId) {

		// 메모 삭제
		userService.deleteMemo(userId, memoId);

		String message = messageSource.getMessage("user.memo.delete.success", null, LocaleContextHolder.getLocale());
		return ResponseEntity.ok(Map.of("message", message));
	}

}

