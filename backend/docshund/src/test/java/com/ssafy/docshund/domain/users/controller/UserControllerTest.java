package com.ssafy.docshund.domain.users.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.docshund.domain.users.dto.page.UserProfileDto;
import com.ssafy.docshund.domain.users.dto.page.UserSearchCondition;
import com.ssafy.docshund.domain.users.dto.profile.ProfileRequestDto;
import com.ssafy.docshund.domain.users.entity.Hobby;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.service.UserService;
import com.ssafy.docshund.global.util.user.UserUtil;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserControllerTest {

	@MockitoBean
	private UserUtil userUtil;

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private UserService userService;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	@DisplayName("어드민이 아닐 경우 사용자 검색 테스트 실패")
	void searchUsers() throws Exception {
		// given
		UserSearchCondition condition = new UserSearchCondition();
		condition.setEmail("test");
		condition.setCategory(Hobby.BACKEND);

		// when & then
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/docshund/users")
				.param("email", "test")
				.param("category", "Backend")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(MockMvcResultMatchers.status().is4xxClientError());
	}

	@Test
	@DisplayName("프로필 조회 테스트")
	void getProfileUser() throws Exception {
		// given
		Long userId = 1L;
		UserProfileDto dto = new UserProfileDto();  // 적절한 데이터 셋팅
		dto.setEmail("test@example.com");
		when(userService.getUserProfile(userId)).thenReturn(dto);

		// when & then
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/docshund/users/profile/{userId}", userId)
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(MockMvcResultMatchers.status().isOk())
			.andExpect(MockMvcResultMatchers.jsonPath("$.email").value("test@example.com")); // 예시 응답 검증
	}

	@Test
	@DisplayName("자신의 프로필이 아닐 경우 수정 실패 테스트")
	void modifyProfileFailure() throws Exception {
		// given
		Long userId = 1L;
		ProfileRequestDto requestDto = new ProfileRequestDto();
		requestDto.setIntroduce("새로운 자기소개");

		// mocking
		User mockUser = new User();
		when(userUtil.getUser()).thenReturn(mockUser);
		when(userUtil.isMine(eq(userId), eq(mockUser))).thenReturn(false);

		// ProfileRequestDto를 JSON으로 변환한 MultipartFile 생성
		MockMultipartFile profilePart = new MockMultipartFile(
			"profile",
			"",
			MediaType.APPLICATION_JSON_VALUE,
			new ObjectMapper().writeValueAsBytes(requestDto) // DTO를 JSON으로 변환
		);

		// when & then
		mockMvc.perform(
				MockMvcRequestBuilders.multipart(HttpMethod.PATCH, "/api/v1/docshund/users/profile/{userId}", userId)
					.file(profilePart) // DTO JSON 전달
					.contentType(MediaType.MULTIPART_FORM_DATA)
					.characterEncoding("UTF-8")
			)
			.andExpect(MockMvcResultMatchers.status().is5xxServerError());
	}

}
