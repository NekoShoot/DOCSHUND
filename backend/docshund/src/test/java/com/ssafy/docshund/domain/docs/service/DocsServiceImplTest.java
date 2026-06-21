package com.ssafy.docshund.domain.docs.service;

import com.ssafy.docshund.domain.docs.dto.DocumentDto;
import com.ssafy.docshund.domain.docs.dto.OriginDocumentDto;
import com.ssafy.docshund.domain.docs.dto.TranslatedDocumentDto;
import com.ssafy.docshund.domain.docs.entity.*;
import com.ssafy.docshund.domain.docs.repository.*;
import com.ssafy.docshund.domain.users.entity.Provider;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.repository.UserRepository;
import com.ssafy.docshund.fixture.UserTestHelper;
import com.ssafy.docshund.fixture.WithMockCustomOAuth2User;
import com.ssafy.docshund.global.util.user.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@Slf4j
@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("[ Document Service Test ]")
class DocsServiceImplTest {

	@Autowired
	private DocsService docsService;

	@Autowired
	private UserTestHelper userTestHelper;

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private DocumentRepository documentRepository;
	@Autowired
	private DocumentLikeRepository documentLikeRepository;
	@Autowired
	private OriginDocumentRepository originDocumentRepository;
	@Autowired
	private TranslatedDocumentRepository translatedDocumentRepository;
	@Autowired
	private TranslatedDocumentLikeRepository translatedDocumentLikeRepository;
	@Autowired
	private CustomDocumentRepository customDocumentRepository;

	private User user1;    // 어드민 유저
	private User user2; // 좋아요 및 번역 CUD 테스트용 유저
	private User user3; // 좋아요 및 번역 CUD 테스트용 유저

	private Document doc1;
	private Document doc2;
	private OriginDocument originDoc1;
	private OriginDocument originDoc2;
	private TranslatedDocument transDoc1;
	private TranslatedDocument transDoc2;

	@MockitoBean
	private UserUtil userUtil;

	@BeforeEach
	public void setUp() {
		// user repository setup
		user1 = userTestHelper.saveUser("admin@gmail.com", "100000", "adminUser", Provider.GOOGLE, true, "안녕하세요",
			"Backend",
			true);
		user2 = userTestHelper.saveUser("test1@gmail.com", "10001", "testUser1", Provider.GOOGLE, false, "안녕하세요",
			"Frontend",
			true);
		user3 = userTestHelper.saveUser("test2@github.com", "10002", "testUser2", Provider.GITHUB, false, "안녕하세요",
			"Backend",
			true);
		// document repository setup
		doc1 = documentRepository.save(new Document("Spring", "Spring Boot", "logoImage", "v1",
			0, Position.BACKEND, "apache", "docLink"));
		doc2 = documentRepository.save(new Document("MySQL", "MySQL", "logoImage", "v1",
			0, Position.DBSQL, "apache", "docLink"));

		// document like repository setup
		documentLikeRepository.save(new DocumentLike(doc1, user2));
		documentLikeRepository.save(new DocumentLike(doc1, user3));
		documentLikeRepository.save(new DocumentLike(doc2, user2));

		// origin document repository setup
		originDoc1 = originDocumentRepository.save(
			new OriginDocument(doc1, 1, "<p>", "<p>Spring Framework is the best Framework for Java.</p>"));
		originDoc2 = originDocumentRepository.save(
			new OriginDocument(doc1, 2, "<p>", "<p>And Spring boot is very easy and simple.</p>"));

		// translated document repository setup
		transDoc1 = translatedDocumentRepository.save(
			new TranslatedDocument(originDoc1, user2, "스프링 프레임워크는 자바를 위한 최고의 프레임워크입니다.", 0, Status.VISIBLE));
		transDoc2 = translatedDocumentRepository.save(
			new TranslatedDocument(originDoc2, user3, "그리고 스프링 부트는 아주 쉽고 간단합니다.", 0, Status.VISIBLE));

		// translated document like repository setup
		translatedDocumentLikeRepository.save(new TranslatedDocumentLike(transDoc1, user2));
		translatedDocumentLikeRepository.save(new TranslatedDocumentLike(transDoc2, user3));

	}

	@Test
	@DisplayName("문서 목록 조회 테스트")
	void getAllDocuments() {
		// given
		String sort = "newest";
		String order = "desc";

		// when
		List<DocumentDto> result = docsService.getAllDocuments(sort, order);

		// then
		assertThat(result).isNotNull();
		assertThat(result).isNotEmpty();
		log.info("문서 목록 조회 결과: {}", result);
	}

	@Test
	@DisplayName("특정 문서 상세 조회 테스트")
	void getDocumentDetail() {

		// when
		DocumentDto result = docsService.getDocumentDetail(doc1.getDocsId());

		// then
		assertThat(result).isNotNull();
		log.info("문서 상세 조회 결과: {}", result);
	}

	@Test
	@DisplayName("문서 작성 테스트")
	void createDocument() {
		// given
		DocumentDto documentDto = new DocumentDto(
			null,
			"Category",
			"New Document",
			"logo.png",
			"v1.0",
			0,
			0,
			Position.BACKEND,
			"Apache",
			"http://link.com",
			LocalDateTime.now(),
			List.of()
		);

		// when
		Mockito.when(userUtil.getUser()).thenReturn(user1);
		Mockito.when(userUtil.isAdmin(any())).thenReturn(true);
		User user = userUtil.getUser();
		DocumentDto result = docsService.createDocument(documentDto);

		// then
		assertThat(result).isNotNull();
		log.info("문서 작성 결과: {}", result);
	}

	@Test
	@WithMockCustomOAuth2User
	@DisplayName("문서 좋아요 등록/취소 테스트")
	void toggleLikes() {

		Mockito.when(userUtil.getUser()).thenReturn(user2);

		// when
		DocumentDto result = docsService.toggleLikes(doc2.getDocsId());

		// then
		assertThat(result).isNotNull();
		log.info("문서 좋아요 결과: {}", result);
	}

	@Test
	@WithMockCustomOAuth2User
	@DisplayName("유저가 좋아한 관심 문서 조회 테스트")
	void getLikesDocument() {

		// when
		List<DocumentDto> result = docsService.getLikesDocument(user1.getUserId());

		// then
		assertThat(result).isNotNull();
		log.info("유저 관심 문서 조회 결과: {}", result);
	}

	@Test
	@DisplayName("원본 문서 조회 테스트 (전체)")
	void getAllOriginDocuments() {
		// given

		Mockito.when(userUtil.getUser()).thenReturn(user2);

		// when

		List<OriginDocumentDto> result = docsService.getAllOriginDocuments(doc1.getDocsId());

		// then
		assertThat(result).isNotNull();
		log.info("원본 문서 조회 결과: {}", result);
	}

	@Test
	@DisplayName("원본 문서 등록 테스트")
	void createOriginDocuments() {
		// given
		MockMultipartFile file = new MockMultipartFile(
			"file", "origin.html", "text/html", "<p>문서 테스트 내용</p>".getBytes());

		// when
		Mockito.when(userUtil.getUser()).thenReturn(user1);
		Mockito.when(userUtil.isAdmin(any())).thenReturn(true);
		User user = userUtil.getUser();

		List<OriginDocumentDto> result = docsService.createOriginDocuments(doc2.getDocsId(), file);

		// then
		assertThat(result).isNotNull();
		log.info("원본 문서 등록 결과: {}", result);
	}

	@Test
	@DisplayName("특정 문서에 대한 번역 문서 목록 전체 조회 테스트")
	void getAllTranslatedDocuments() {

		// when
		List<TranslatedDocumentDto> result = docsService.getAllTranslatedDocuments(doc1.getDocsId());

		// then
		assertThat(result).isNotNull();
		log.info("번역 문서 목록 조회 결과: {}", result);
	}

	@Test
	@DisplayName("특정 문서 내 베스트 번역본 조회 테스트")
	void getBestTranslatedDocuments() {

		// when
		List<TranslatedDocumentDto> result = docsService.getBestTranslatedDocuments(doc1.getDocsId());

		// then
		assertThat(result).isNotNull();
		log.info("베스트 번역 조회 결과: {}", result);
	}

	@Test
	@WithMockCustomOAuth2User
	@DisplayName("번역 작성 테스트")
	void createTranslatedDocument() {
		// given
		TranslatedDocumentDto createdTrans = new TranslatedDocumentDto(1L, 1, 100L, "새 번역", 0, Status.VISIBLE,
				LocalDateTime.now(), LocalDateTime.now(), 0, List.of());

		Mockito.when(userUtil.getUser()).thenReturn(user2);

		// when
		TranslatedDocumentDto result = docsService.createTranslatedDocument(doc1.getDocsId(), originDoc2.getOriginId(), createdTrans);

		// then
		assertThat(result).isNotNull();
		log.info("번역 작성 결과: {}", result);
	}

	@Test
	@WithMockCustomOAuth2User
	@DisplayName("번역 수정 테스트")
	void updateTranslatedDocument() {
		String content = "수정된 번역 내용";
		TranslatedDocumentDto updateTrans = new TranslatedDocumentDto(1L, 1, user2.getUserId(), "새 번역", 0, Status.VISIBLE,
				LocalDateTime.now(), LocalDateTime.now(), 0, List.of());
		Mockito.when(userUtil.getUser()).thenReturn(user2);

		// when
		TranslatedDocumentDto result = docsService.updateTranslatedDocument(doc1.getDocsId(),
			(long)Math.toIntExact(transDoc1.getTransId()), updateTrans);

		// then
		assertThat(result).isNotNull();
		log.info("번역 수정 결과: {}", result);
	}

	@Test
	@WithMockCustomOAuth2User
	@DisplayName("번역 삭제 테스트")
	void deleteTranslatedDocument() {

		Mockito.when(userUtil.getUser()).thenReturn(user2);

		// when
		docsService.deleteTranslatedDocument(doc1.getDocsId(), (long)Math.toIntExact(transDoc1.getTransId()));

		// then
		log.info("번역 삭제 성공");
	}

	@Test
	@WithMockCustomOAuth2User
	@DisplayName("번역 좋아요 테스트")
	void toggleVotes() {

		Mockito.when(userUtil.getUser()).thenReturn(user1);

		// when
		boolean result = docsService.toggleVotes(doc1.getDocsId(), (long)Math.toIntExact(transDoc1.getTransId()));

		// then
		assertThat(result).isTrue();
		log.info("번역 좋아요 결과: {}", result);
	}
}
