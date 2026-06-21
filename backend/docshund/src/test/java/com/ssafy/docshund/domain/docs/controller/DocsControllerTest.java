package com.ssafy.docshund.domain.docs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.docshund.domain.docs.dto.DocumentDto;
import com.ssafy.docshund.domain.docs.dto.OriginDocumentDto;
import com.ssafy.docshund.domain.docs.dto.TranslatedDocumentDto;
import com.ssafy.docshund.domain.docs.dto.UserTransDocumentDto;
import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.docs.entity.Status;
import com.ssafy.docshund.domain.docs.service.DocsService;
import com.ssafy.docshund.fixture.WithMockCustomOAuth2User;
import com.ssafy.docshund.global.util.user.UserUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class DocsControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private DocsService docsService;

	@MockitoBean
	private UserUtil userUtil;

	// 문서 전체 목록 조회 테스트
	@Test
	@DisplayName("문서 목록 조회 API 테스트")
	void getDocsTest() throws Exception {
		// given
		List<DocumentDto> documentList = Arrays.asList(
			new DocumentDto(1, "Spring", "Spring Framework", "logo1.png", "v1.0", 10, 5, Position.BACKEND, "Apache 2.0",
				"http://link1.com",
				LocalDateTime.now(), List.of(1L, 2L)),
			new DocumentDto(2, "React", "React Native", "logo2.png", "v2.0", 20, 8, Position.FRONTEND, "Apache 2.0",
				"http://link2.com", LocalDateTime.now(), List.of(3L))
		);

		when(docsService.getAllDocuments("name", "asc")).thenReturn(documentList);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs")
				.param("sort", "name")
				.param("order", "asc"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(2))
			.andExpect(jsonPath("$[0].docsId").value(1))
			.andExpect(jsonPath("$[0].documentName").value("Spring Framework"))
			.andExpect(jsonPath("$[1].docsId").value(2))
			.andExpect(jsonPath("$[1].documentName").value("React Native"));

		verify(docsService, times(1)).getAllDocuments("name", "asc");
	}

	// 문서 생성 테스트
	@Test
	@DisplayName("문서 등록 API 테스트")
	@WithMockCustomOAuth2User
	void postDocsTest() throws Exception {
		// given
		DocumentDto requestDto = new DocumentDto(null, "Spring", "Spring Framework", "logo1.png", "v1.0", 0, 0,
			Position.BACKEND, "Apache 2.0",
			"http://link.com", LocalDateTime.now(), List.of());
		DocumentDto responseDto = new DocumentDto(1, "Spring", "Spring Framework", "logo1.png", "v1.0", 0, 0,
			Position.BACKEND, "Apache 2.0",
			"http://link.com", LocalDateTime.now(), List.of());

		when(userUtil.getUser()).thenReturn(Mockito.mock(com.ssafy.docshund.domain.users.entity.User.class));
		when(docsService.createDocument(any(DocumentDto.class))).thenReturn(responseDto);

		// when & then
		mockMvc.perform(post("/api/v1/docshund/docs")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(requestDto)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.docsId").value(1))
			.andExpect(jsonPath("$.documentName").value("Spring Framework"));

		verify(docsService, times(1)).createDocument(any(DocumentDto.class));
	}

	// 문서 상세 조회 테스트
	@Test
	@DisplayName("문서 상세 조회 API 테스트")
	void getDocsDetailTest() throws Exception {
		// given
		DocumentDto documentDto = new DocumentDto(1, "Spring", "Spring Framework", "logo1.png", "v1.0",
			10, 5, Position.BACKEND, "Apache 2.0", "http://link1.com", LocalDateTime.now(), List.of(1L, 2L));

		when(docsService.getDocumentDetail(1)).thenReturn(documentDto);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/1"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.docsId").value(1))
			.andExpect(jsonPath("$.documentName").value("Spring Framework"))
			.andExpect(jsonPath("$.documentCategory").value("Spring"));

		verify(docsService, times(1)).getDocumentDetail(1);
	}

	// 관심문서 등록/해제 테스트
	@Test
	@DisplayName("관심 문서 등록 및 해제 API 테스트")
	void toggleLikesTest() throws Exception {
		// given
		DocumentDto document = new DocumentDto(1, "Spring", "Spring Framework", "logo1.png", "v1.0", 10, 5,
			Position.BACKEND, "Apache 2.0", "http://link.com", LocalDateTime.now(), List.of());

		when(userUtil.getUser()).thenReturn(Mockito.mock(com.ssafy.docshund.domain.users.entity.User.class));
		when(docsService.toggleLikes(1)).thenReturn(document);

		// when & then
		mockMvc.perform(post("/api/v1/docshund/docs/1/likes"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.docsId").value(1))
			.andExpect(jsonPath("$.documentName").value("Spring Framework"));

		verify(docsService, times(1)).toggleLikes(1);
	}

	// 특정 유저 관심 문서 조회 테스트
	@Test
	@DisplayName("특정 유저의 관심 문서 조회 API 테스트")
	void getLikesTest() throws Exception {
		// given
		List<DocumentDto> likedDocs = List.of(
			new DocumentDto(1, "Spring", "Spring Framework", "logo1.png", "v1.0", 10, 5, Position.BACKEND, "Apache 2.0",
				"http://link1.com", LocalDateTime.now(), List.of(1L, 2L)),
			new DocumentDto(2, "React", "React Native", "logo2.png", "v2.0", 20, 8, Position.FRONTEND, "Apache 2.0",
				"http://link2.com", LocalDateTime.now(), List.of(3L))
		);

		when(docsService.getLikesDocument(100L)).thenReturn(likedDocs);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/likes")
				.param("userId", "100"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(2))
			.andExpect(jsonPath("$[0].docsId").value(1))
			.andExpect(jsonPath("$[1].docsId").value(2));

		verify(docsService, times(1)).getLikesDocument(100L);
	}

	// 원본 문서 생성 테스트
	@Test
	@DisplayName("원본 문서 생성 API 테스트")
	void postOriginDocsTest() throws Exception {
		// given
		List<OriginDocumentDto> createdOrigins = List.of(
			new OriginDocumentDto(1, 1, 1, "p", "문단 1 내용"),
			new OriginDocumentDto(2, 1, 2, "p", "문단 2 내용")
		);

		MockMultipartFile file = new MockMultipartFile(
			"file", "origin.html", "text/html", "문서 원본 내용입니다.".getBytes());

		when(userUtil.getUser()).thenReturn(Mockito.mock(com.ssafy.docshund.domain.users.entity.User.class));
		when(docsService.createOriginDocuments(eq(1), any(MultipartFile.class))).thenReturn(createdOrigins);

		// when & then
		mockMvc.perform(multipart("/api/v1/docshund/docs/1/origin").file(file))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(2))
			.andExpect(jsonPath("$[0].originId").value(1))
			.andExpect(jsonPath("$[0].content").value("문단 1 내용"))
			.andExpect(jsonPath("$[1].originId").value(2))
			.andExpect(jsonPath("$[1].content").value("문단 2 내용"));

		verify(docsService, times(1)).createOriginDocuments(eq(1), any(MultipartFile.class));
	}

	// 원본 문서 전체 조회 테스트
	@Test
	@DisplayName("원본 문서 전체 조회 API 테스트")
	void getAllOriginDocsTest() throws Exception {
		// given
		List<OriginDocumentDto> originDocs = List.of(
			new OriginDocumentDto(1, 1, 1, "p", "문단 1 내용"),
			new OriginDocumentDto(2, 1, 2, "p", "문단 2 내용")
		);

		when(docsService.getAllOriginDocuments(1)).thenReturn(originDocs);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/1/origin"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(2))
			.andExpect(jsonPath("$[0].originId").value(1))
			.andExpect(jsonPath("$[1].originId").value(2));

		verify(docsService, times(1)).getAllOriginDocuments(1);
	}

	// 원본 문서 특정 단락 조회 테스트
	@Test
	@DisplayName("원본 문서 특정 단락 조회 API 테스트")
	void getOriginDocsByIdTest() throws Exception {
		// given
		OriginDocumentDto originDoc = new OriginDocumentDto(1, 1, 1, "p", "문단 1 내용");

		when(docsService.getOriginDocumentDetail(1)).thenReturn(originDoc);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/1/origin")
				.param("originId", "1"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.originId").value(1))
			.andExpect(jsonPath("$.content").value("문단 1 내용"));

		verify(docsService, times(1)).getOriginDocumentDetail(1);
	}

	// 특정 문서 전체 번역 조회
	@Test
	@DisplayName("특정 문서의 번역 전체 조회 API 테스트")
	void getAllTransDocsTest() throws Exception {
		// given
		List<TranslatedDocumentDto> translatedDocs = List.of(
			new TranslatedDocumentDto(1L, 1, 100L, "번역 내용 1", 0, Status.VISIBLE, LocalDateTime.now(),
				LocalDateTime.now(), 5, List.of(1L, 2L)),
			new TranslatedDocumentDto(2L, 1, 101L, "번역 내용 2", 0, Status.VISIBLE, LocalDateTime.now(),
				LocalDateTime.now(), 8, List.of(3L))
		);

		when(docsService.getAllTranslatedDocuments(1)).thenReturn(translatedDocs);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/1/trans")
				.param("status", "all"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(2));

		verify(docsService, times(1)).getAllTranslatedDocuments(1);
	}

	// 특정 문서의 베스트 번역 조회
	@Test
	@DisplayName("특정 문서의 베스트 번역 조회 API 테스트")
	void getBestTransDocsTest() throws Exception {
		// given
		List<TranslatedDocumentDto> bestTranslatedDocs = List.of(
			new TranslatedDocumentDto(2L, 1, 101L, "베스트 번역 내용", 0, Status.VISIBLE, LocalDateTime.now(),
				LocalDateTime.now(), 10, List.of(1L, 2L, 3L))
		);

		when(docsService.getBestTranslatedDocuments(1)).thenReturn(bestTranslatedDocs);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/1/trans")
				.param("status", "best"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(1));

		verify(docsService, times(1)).getBestTranslatedDocuments(1);
	}

	// 특정 문단 번역 조회
	@Test
	@DisplayName("특정 문단의 번역 조회 API 테스트")
	void getTransDocsByOriginIdTest() throws Exception {
		// given
		List<TranslatedDocumentDto> translatedDocs = List.of(
			new TranslatedDocumentDto(1L, 1, 100L, "문단 번역 내용", 0, Status.VISIBLE, LocalDateTime.now(),
				LocalDateTime.now(), 5, List.of(1L, 2L))
		);

		when(docsService.getTranslatedDocuments(1, 1, "like", "desc")).thenReturn(translatedDocs);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/1/trans/1")
				.param("sort", "like")
				.param("order", "desc"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(1));

		verify(docsService, times(1)).getTranslatedDocuments(1, 1, "like", "desc");
	}

	// 특정 유저 번역 조회
	@Test
	@DisplayName("특정 유저의 번역 조회 API 테스트")
	void getUserTransDocsTest() throws Exception {
		// given
		List<UserTransDocumentDto> userTranslatedDocs = List.of(
			new UserTransDocumentDto(1L, 1, 1, "유저 번역 내용",
				0, 100L, "번역 내용", 0, Status.VISIBLE, LocalDateTime.now(),
				LocalDateTime.now(), 3, List.of(1L))
		);

		when(docsService.getUserTransDocument(100L)).thenReturn(userTranslatedDocs);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/trans")
				.param("userId", "100"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(1));

		verify(docsService, times(1)).getUserTransDocument(100L);
	}

	// 번역 작성
	@Test
	@DisplayName("번역 작성 API 테스트")
	void postTransDocsTest() throws Exception {
		// given
		TranslatedDocumentDto requestDto = new TranslatedDocumentDto(
				null,  // ID는 자동 생성되므로 null
				1, 100L, "새 번역",
				0, Status.VISIBLE,
				LocalDateTime.now(), LocalDateTime.now(),
				0, List.of()
		);

		TranslatedDocumentDto createdTrans = new TranslatedDocumentDto(
				1L, 1, 100L, "새 번역",
				0, Status.VISIBLE,
				LocalDateTime.now(), LocalDateTime.now(),
				0, List.of()
		);

		when(userUtil.getUser()).thenReturn(Mockito.mock(com.ssafy.docshund.domain.users.entity.User.class));
		when(docsService.createTranslatedDocument(1, 1, requestDto)).thenReturn(createdTrans);

		// when & then
		mockMvc.perform(post("/api/v1/docshund/docs/1/trans/1")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestDto)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.content").value("새 번역"));

		verify(docsService, times(1)).createTranslatedDocument(1, 1, requestDto);
	}


	// 번역 상세 조회 테스트
	@Test
	@DisplayName("번역 상세 조회 API 테스트")
	void getTransDetailTest() throws Exception {
		// given
		TranslatedDocumentDto transDocument = new TranslatedDocumentDto(
			1L, 1, 100L, "번역 상세 내용", 0, Status.VISIBLE, LocalDateTime.now(), LocalDateTime.now(), 5, List.of(1L, 2L)
		);

		when(docsService.getTranslatedDocumentDetail(1, 1L)).thenReturn(transDocument);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/1/trans/paragraph/1"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.transId").value(1))
			.andExpect(jsonPath("$.content").value("번역 상세 내용"));

		verify(docsService, times(1)).getTranslatedDocumentDetail(1, 1L);
	}

	// 번역 수정 테스트
	@Test
	@DisplayName("번역 수정 API 테스트")
	void patchTransTest() throws Exception {
		// given
		TranslatedDocumentDto requestDto = new TranslatedDocumentDto(
				1L, 1, 100L, "수정된 번역 내용", 0, Status.VISIBLE,
				LocalDateTime.now(), LocalDateTime.now(), 5, List.of(1L, 2L)
		);

		TranslatedDocumentDto updatedTrans = new TranslatedDocumentDto(
				1L, 1, 100L, "수정된 번역 내용", 0, Status.VISIBLE,
				LocalDateTime.now(), LocalDateTime.now(), 5, List.of(1L, 2L)
		);

		when(userUtil.getUser()).thenReturn(Mockito.mock(com.ssafy.docshund.domain.users.entity.User.class));
		when(docsService.updateTranslatedDocument(1, 1L, requestDto)).thenReturn(updatedTrans);

		// when & then
		mockMvc.perform(patch("/api/v1/docshund/docs/1/trans/paragraph/1")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestDto)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.content").value("수정된 번역 내용"));

		verify(docsService, times(1)).updateTranslatedDocument(1, 1L, requestDto);
	}


	// 번역 삭제 테스트
	@Test
	@DisplayName("번역 삭제 API 테스트")
	void deleteTransTest() throws Exception {
		// given
		when(userUtil.getUser()).thenReturn(Mockito.mock(com.ssafy.docshund.domain.users.entity.User.class));

		// when & then
		mockMvc.perform(delete("/api/v1/docshund/docs/1/trans/paragraph/1"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.message").value("Translation deleted successfully."));

		verify(docsService, times(1)).deleteTranslatedDocument(1, 1L);
	}

	// 번역 좋아요 / 취소 테스트
	@Test
	@DisplayName("번역 좋아요 및 취소 API 테스트")
	void postTransVotesTest() throws Exception {
		// given
		when(userUtil.getUser()).thenReturn(Mockito.mock(com.ssafy.docshund.domain.users.entity.User.class));
		when(docsService.toggleVotes(1, 1L)).thenReturn(true);

		// 좋아요 추가 테스트
		mockMvc.perform(post("/api/v1/docshund/docs/1/trans/paragraph/1/votes"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.message").value("Translation liked successfully."))
			.andExpect(jsonPath("$.liked").value(true));

		verify(docsService, times(1)).toggleVotes(1, 1L);

		// 좋아요 취소 테스트
		when(docsService.toggleVotes(1, 1L)).thenReturn(false);

		mockMvc.perform(post("/api/v1/docshund/docs/1/trans/paragraph/1/votes"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.message").value("Translation unliked successfully."))
			.andExpect(jsonPath("$.liked").value(false));

		verify(docsService, times(2)).toggleVotes(1, 1L);
	}

	// 특정 유저가 좋아한 번역 테스트
	@Test
	@DisplayName("특정 유저가 좋아한 번역 목록 조회 API 테스트")
	void getUserLikedTransTest() throws Exception {
		// given
		List<UserTransDocumentDto> likedTrans = List.of(
			new UserTransDocumentDto(1L, 1, 1, "문서1", 1, 2L, "좋아요한 번역 1", 0, Status.VISIBLE, LocalDateTime.now(),
				LocalDateTime.now(), 5, List.of(1L, 2L)),
			new UserTransDocumentDto(2L, 2, 2, "문서2", 3, 3L, "좋아요한 번역 2", 0, Status.VISIBLE, LocalDateTime.now(),
				LocalDateTime.now(), 8, List.of(3L))
		);

		when(docsService.getUserLikedTrans(100L)).thenReturn(likedTrans);

		// when & then
		mockMvc.perform(get("/api/v1/docshund/docs/trans/votes")
				.param("userId", "100"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.size()").value(2))
			.andExpect(jsonPath("$[0].content").value("좋아요한 번역 1"))
			.andExpect(jsonPath("$[1].content").value("좋아요한 번역 2"));

		verify(docsService, times(1)).getUserLikedTrans(100L);
	}
}
