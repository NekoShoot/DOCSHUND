package com.ssafy.docshund.domain.docs.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.docshund.domain.alerts.service.AlertsService;
import com.ssafy.docshund.domain.docs.dto.DocumentDto;
import com.ssafy.docshund.domain.docs.dto.OriginDocumentDto;
import com.ssafy.docshund.domain.docs.dto.TranslatedDocumentDto;
import com.ssafy.docshund.domain.docs.dto.UserTransDocumentDto;
import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.DocumentLike;
import com.ssafy.docshund.domain.docs.entity.OriginDocument;
import com.ssafy.docshund.domain.docs.entity.Status;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import com.ssafy.docshund.domain.docs.exception.DocsException;
import com.ssafy.docshund.domain.docs.exception.DocsExceptionCode;
import com.ssafy.docshund.domain.docs.repository.CustomDocumentRepository;
import com.ssafy.docshund.domain.docs.repository.DocumentLikeRepository;
import com.ssafy.docshund.domain.docs.repository.DocumentRepository;
import com.ssafy.docshund.domain.docs.repository.OriginDocumentRepository;
import com.ssafy.docshund.domain.docs.repository.TranslatedDocumentLikeRepository;
import com.ssafy.docshund.domain.docs.repository.TranslatedDocumentRepository;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.repository.UserRepository;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DocsServiceImpl implements DocsService {

	private final DocumentRepository documentRepository;
	private final DocumentLikeRepository documentLikeRepository;
	private final OriginDocumentRepository originDocumentRepository;
	private final CustomDocumentRepository customDocumentRepository;
	private final TranslatedDocumentRepository translatedDocumentRepository;
	private final TranslatedDocumentLikeRepository translatedDocumentLikeRepository;
	private final AlertsService alertsService;
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final UserUtil userUtil;
	private final UserRepository userRepository;

	// 문서 목록 조회 후 좋아요와 함께 추출하는 메서드
	private List<DocumentDto> getDocumentsWithLikes(List<Document> documents) {
		// 문서 ID 목록 추출
		List<Integer> documentIds = documents.stream().map(Document::getDocsId).toList();

		// 다수의 문서 좋아요 정보 가져오기
		Map<Integer, List<Long>> likeUsersMap = documentLikeRepository.findLikedUserIdsByDocumentIds(documentIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Integer)result[0],
				Collectors.mapping(result -> (Long)result[1], Collectors.toList())
			));

		return documents.stream().map(document -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(document.getDocsId(), List.of());
			return new DocumentDto(
				document.getDocsId(),
				document.getDocumentCategory(),
				document.getDocumentName(),
				document.getDocumentLogo(),
				document.getDocumentVersion(),
				document.getViewCount(),
				likeUserIds.size(),
				document.getPosition(),
				document.getLicense(),
				document.getDocumentLink(),
				document.getCreatedAt(),
				likeUserIds
			);
		}).toList();
	}

	// 번역목록을 좋아요와 함께 추출하는 메서드
	private List<TranslatedDocumentDto> getTranslatedDocumentsWithLikes(List<TranslatedDocument> translatedDocuments) {
		// 번역 문서 ID 목록 추출
		List<Long> transIds = translatedDocuments.stream().map(TranslatedDocument::getTransId).toList();

		// 다수의 번역 문서 좋아요 정보 가져오기
		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // 첫 번째 값 = 번역 문서 ID
				Collectors.mapping(result -> (Long)result[1], Collectors.toList()) // 두 번째 값 = 유저 ID
			));

		return translatedDocuments.stream().map(translatedDocument -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(translatedDocument.getTransId(), List.of());
			return new TranslatedDocumentDto(
				translatedDocument.getTransId(),
				translatedDocument.getOriginDocument().getOriginId(),
				translatedDocument.getUser().getUserId(),
				translatedDocument.getContent(),
				translatedDocument.getReportCount(),
				translatedDocument.getStatus(),
				translatedDocument.getCreatedAt(),
				translatedDocument.getUpdatedAt(),
				likeUserIds.size(),
				likeUserIds
			);
		}).toList();
	}

	private List<UserTransDocumentDto> getUserTransDocumentDtos(List<TranslatedDocument> userLikedTrans) {
		List<Long> transIds = userLikedTrans.stream().map(TranslatedDocument::getTransId).toList();

		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // transId
				Collectors.mapping(result -> (Long)result[1], Collectors.toList()) // 좋아요한 userId 리스트로 매핑
			));

		return userLikedTrans.stream().map(transDoc -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(transDoc.getTransId(), List.of());
			return new UserTransDocumentDto(
				transDoc.getTransId(),
				transDoc.getOriginDocument().getOriginId(),
				transDoc.getOriginDocument().getDocument().getDocsId(),
				transDoc.getOriginDocument().getDocument().getDocumentName(),
				transDoc.getOriginDocument().getPOrder(),
				transDoc.getUser().getUserId(),
				transDoc.getContent(),
				transDoc.getReportCount(),
				transDoc.getStatus(),
				transDoc.getCreatedAt(),
				transDoc.getUpdatedAt(),
				likeUserIds.size(),
				likeUserIds
			);
		}).toList();
	}

	// 전체 문서 목록 조회
	@Override
	public List<DocumentDto> getAllDocuments(String sort, String order) {

		// 정렬 방식 설정
		Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

		// 정렬 기준 설정
		Sort sortOption = switch (sort.toLowerCase()) {
			case "newest" -> Sort.by(direction, "createdAt");
			case "view" -> Sort.by(direction, "viewCount");
			default -> Sort.by(direction, "documentName");
		};

		// 문서 목록 조회
		List<Document> documents = documentRepository.findAll(sortOption);

		return getDocumentsWithLikes(documents);
	}

	// 특정 문서 상세 조회
	@Override
	@Transactional
	public DocumentDto getDocumentDetail(Integer docsId) {

		// 문서가 존재하지 않으면 예외처리
		Document document = documentRepository.findById(docsId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.DOCS_NOT_FOUND));

		// 조회수 증가
		document.increaseViewCount();
		documentRepository.save(document);

		// 좋아요한 유저들 조회
		List<Long> likeUserIds = documentLikeRepository.findLikedUserIdsByDocumentId(docsId);

		// DocumentDto 생성 후 반환
		return new DocumentDto(
			document.getDocsId(),
			document.getDocumentCategory(),
			document.getDocumentName(),
			document.getDocumentLogo(),
			document.getDocumentVersion(),
			document.getViewCount(),
			likeUserIds.size(),    // 좋아요 갯수
			document.getPosition(),
			document.getLicense(),
			document.getDocumentLink(),
			document.getCreatedAt(),
			likeUserIds
		);
	}

	// 문서 생성
	@Override
	@Transactional
	public DocumentDto createDocument(DocumentDto documentDto) {

		// 유저가 존재하는지, 어드민인지 확인 후 예외처리
		User user = userUtil.getUser();
		if (user == null) {
			throw new DocsException(DocsExceptionCode.USER_NOT_AUTHORIZED);
		}
		if (!userUtil.isAdmin(user)) {
			throw new DocsException(DocsExceptionCode.NO_PERMISSION);
		}

		Document document = new Document(
			documentDto.documentCategory(),
			documentDto.documentName(),
			documentDto.documentLogo(),
			documentDto.documentVersion(),
			documentDto.viewCount() != null ? documentDto.viewCount() : 0,
			documentDto.position(),
			documentDto.license(),
			documentDto.documentLink()
		);

		Document savedDocument = documentRepository.save(document);
		return DocumentDto.fromEntity(savedDocument, 0, List.of());
	}

	// 관심문서 등록 및 해제
	@Override
	@Transactional
	public DocumentDto toggleLikes(Integer docsId) {

		// 로그인하지 않은 유저 예외처리
		User user = userUtil.getUser();
		if (user == null) {
			throw new DocsException(DocsExceptionCode.USER_NOT_AUTHORIZED);
		}

		// 현재 사용자가 해당 문서를 좋아요 했는지 확인
		boolean isLiked = documentLikeRepository.existsByDocument_DocsIdAndUser_UserId(docsId, user.getUserId());

		if (isLiked) {
			// 좋아요 취소
			documentLikeRepository.deleteByDocument_DocsIdAndUser_UserId(docsId, user.getUserId());
		} else {
			// 좋아요 등록
			Document document = documentRepository.findById(docsId)
				.orElseThrow(() -> new DocsException(DocsExceptionCode.DOCS_NOT_FOUND));

			DocumentLike documentLike = new DocumentLike(document, user);
			documentLikeRepository.save(documentLike);
		}

		// 문서 정보 조회
		Document targetDocument = documentRepository.findById(docsId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.DOCS_NOT_FOUND));

		// 갱신된 좋아요 유저들 조회
		List<Long> likeUserIds = documentLikeRepository.findLikedUserIdsByDocumentId(docsId);

		// 좋아요 개수 갱신
		int updatedLikeCount = likeUserIds.size();

		return DocumentDto.fromEntity(targetDocument, updatedLikeCount, likeUserIds);
	}

	// 유저 관심 문서 조회
	@Override
	public List<DocumentDto> getLikesDocument(Long userId) {

		if (userId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}
		userRepository.findById(userId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.USER_NOT_FOUND));

		List<Document> documents = customDocumentRepository.findLikedDocumentByUserId(userId);

		return getDocumentsWithLikes(documents);
	}

	// 문서 원본(origin_document) 조회
	@Override
	@Transactional
	public List<OriginDocumentDto> getAllOriginDocuments(Integer docsId) {
		if (docsId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}
		Document document = documentRepository.findById(docsId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.DOCS_NOT_FOUND));
		List<OriginDocument> originDocuments = originDocumentRepository.findByDocument_DocsId(docsId);
		document.increaseViewCount();
		documentRepository.save(document);

		return originDocuments.stream()
			.map(OriginDocumentDto::fromEntity)
			.collect(Collectors.toList());
	}

	// 특정 단락 원본 조회
	@Override
	public OriginDocumentDto getOriginDocumentDetail(Integer originId) {
		if (originId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}
		OriginDocument originDocument = originDocumentRepository.findByOriginId(originId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.ORIGIN_NOT_FOUND));
		return OriginDocumentDto.fromEntity(originDocument);
	}

	// 원본 생성 시즌 2 (파일)
	@Override
	@Transactional
	public List<OriginDocumentDto> createOriginDocuments(Integer docsId, MultipartFile file) {

		User user = userUtil.getUser();

		// 유저가 존재하지 않을 시 예외 처리
		if (user == null) {
			throw new DocsException(DocsExceptionCode.USER_NOT_AUTHORIZED);
		}
		// 관리자가 아닐 시 예외 처리
		if (!userUtil.isAdmin(user)) {
			throw new DocsException(DocsExceptionCode.NO_PERMISSION);
		}
		// 이미 원본이 존재하는 문서인 경우 예외 처리
		if (originDocumentRepository.existsByDocument_DocsId(docsId)) {
			throw new DocsException(DocsExceptionCode.ALREADY_EXIST_ORIGIN);
		}

		// 파일이 없을 시 예외 처리
		if (file == null || file.isEmpty()) {
			throw new DocsException(DocsExceptionCode.REQUIRED_IS_EMPTY);
		}

		String fileName = file.getOriginalFilename();
		if (fileName == null || !fileName.toLowerCase().endsWith(".txt")) {
			throw new DocsException(DocsExceptionCode.INVALID_FILE_TYPE);
		}

		log.info("[Service] 업로드된 파일 크기: {} bytes", file.getSize());
		log.info("[Service] 파이썬 스크립트 실행 준비중...");

		StringBuilder errorBuilder = new StringBuilder();

		try {
			log.info("scriptPath Finding");
			String scriptPath = "/usr/src/app/python/divide_by_tags.py";

			log.info("new ProcessBuilder create");
			ProcessBuilder processBuilder = new ProcessBuilder("python3.9", scriptPath);
			processBuilder.environment().put("PYTHONIOENCODING", "UTF-8");

			Process process = processBuilder.start();
			log.info("[Service] 파이썬 스크립트 시작...");

			try (OutputStream outputStream = process.getOutputStream()) {
				outputStream.write(file.getBytes());
				outputStream.flush();
				log.info("[Service] 파이썬에 파일을 보내는 중...");
			}

			// Python 출력 스트림 읽기
			StringBuilder resultJsonBuilder = new StringBuilder();
			try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
				String line;
				while ((line = reader.readLine()) != null) {
					resultJsonBuilder.append(line);
				}
			}
			log.info("[Service] 파이썬으로부터 응답을 성공적으로 받았습니다...");

			// Python 에러 스트림 읽기
			try (BufferedReader errorReader = new BufferedReader(
				new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
				String line;
				while ((line = errorReader.readLine()) != null) {
					errorBuilder.append(line).append(System.lineSeparator());
				}
			}
			if (!errorBuilder.isEmpty()) {
				log.error("[Service] 파이썬 스크립트 에러 로그: {}", errorBuilder.toString());
			}

			process.waitFor();
			if (process.exitValue() != 0) {
				throw new DocsException(DocsExceptionCode.PYTHON_ERROR);
			}

			String resultJson = resultJsonBuilder.toString();
			List<OriginDocumentDto> documents = objectMapper.readValue(resultJson,
				new TypeReference<List<OriginDocumentDto>>() {
				});

			Document document = documentRepository.findById(docsId)
				.orElseThrow(() -> new DocsException(DocsExceptionCode.DOCS_NOT_FOUND));

			return documents.stream().map(dto -> {
				OriginDocument originDocument = new OriginDocument(
					document,
					dto.pOrder(),
					dto.tag(),
					dto.content()
				);

				OriginDocument savedEntity = originDocumentRepository.save(originDocument);
				return OriginDocumentDto.fromEntity(savedEntity);
			}).toList();

		} catch (Exception e) {
			log.error("[Service] 파이썬 스크립트 실행 중 예외 발생!", e);
			throw new DocsException(DocsExceptionCode.PYTHON_ERROR);
		}
	}

	// 특정 문서에 대한 번역 문서 목록 전체 조회하기
	@Transactional(readOnly = true)
	public List<TranslatedDocumentDto> getAllTranslatedDocuments(Integer docsId) {

		// docsId가 null이면 / docs가 없으면 예외 처리
		if (docsId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}
		if (!documentRepository.existsById(docsId)) {
			throw new DocsException(DocsExceptionCode.DOCS_NOT_FOUND);
		}

		List<TranslatedDocument> translatedDocuments = translatedDocumentRepository
			.findByOriginDocument_Document_DocsIdAndStatus(docsId, Status.VISIBLE);

		return getTranslatedDocumentsWithLikes(translatedDocuments);

	}

	// 특정 문서 내에서 베스트 번역본 조회
	@Transactional(readOnly = true)
	@Override
	public List<TranslatedDocumentDto> getBestTranslatedDocuments(Integer docsId) {

		// docsId가 null이면 / docs가 없으면 예외 처리
		if (docsId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}
		if (!documentRepository.existsById(docsId)) {
			throw new DocsException(DocsExceptionCode.DOCS_NOT_FOUND);
		}

		// 베스트 번역본 가져오기
		List<TranslatedDocumentDto> bestTransDocuments = customDocumentRepository.findBestTrans(docsId);

		// transId 목록 추출
		List<Long> transIds = bestTransDocuments.stream().map(TranslatedDocumentDto::transId).toList();

		// 좋아요한 유저 목록 조회
		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // transId
				Collectors.mapping(result -> (Long)result[1], Collectors.toList())
			));

		return bestTransDocuments.stream().map(transDoc -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(transDoc.transId(), List.of());
			return transDoc.withLikeUserIds(likeUserIds);
		}).toList();
	}

	// 특정 문단의 번역 전체 조회
	@Transactional(readOnly = true)
	@Override
	public List<TranslatedDocumentDto> getTranslatedDocuments(Integer docsId, Integer originId, String sort,
		String order) {

		if (docsId == null || originId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}
		if (!documentRepository.existsById(docsId)) {
			throw new DocsException(DocsExceptionCode.DOCS_NOT_FOUND);
		}
		if (!originDocumentRepository.existsById(originId)) {
			throw new DocsException(DocsExceptionCode.ORIGIN_NOT_FOUND);
		}

		// 번역문 조회
		List<TranslatedDocumentDto> translatedDocuments = customDocumentRepository.findTranslatedDocs(docsId, originId,
			sort, order);

		// 번역 문서 ID 목록 추출
		List<Long> transIds = translatedDocuments.stream().map(TranslatedDocumentDto::transId).toList();

		// 좋아요한 유저 목록 조회
		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // transId
				Collectors.mapping(result -> (Long)result[1], Collectors.toList()) // 좋아요한 userId 리스트로 매핑
			));

		return translatedDocuments.stream().map(transDoc -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(transDoc.transId(), List.of());
			return transDoc.withLikeUserIds(likeUserIds);
		}).toList();
	}

	// 번역 작성하기
	@Override
	@Transactional
	public TranslatedDocumentDto createTranslatedDocument(Integer docsId, Integer originId,
		TranslatedDocumentDto translatedDocumentDto) {
		User user = userUtil.getUser();

		if (user == null) {
			throw new DocsException(DocsExceptionCode.USER_NOT_AUTHORIZED);
		}
		if (docsId == null || originId == null) {
			throw new DocsException(DocsExceptionCode.REQUIRED_IS_EMPTY);
		}
		if (translatedDocumentDto.content().isBlank()) {
			throw new DocsException(DocsExceptionCode.REQUIRED_IS_EMPTY);
		}
		if (!documentRepository.existsById(docsId)) {
			throw new DocsException(DocsExceptionCode.DOCS_NOT_FOUND);
		}

		// 원본 문서 조회
		OriginDocument originDocument = originDocumentRepository.findById(originId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.ORIGIN_NOT_FOUND));

		// 번역 문서 생성
		TranslatedDocument translatedDocument = new TranslatedDocument(originDocument, user,
			translatedDocumentDto.content(), 0, Status.VISIBLE);
		translatedDocumentRepository.save(translatedDocument);

		return TranslatedDocumentDto.fromEntity(translatedDocument, 0, List.of());
	}

	// 특정 유저가 작성한 번역 조회
	@Transactional(readOnly = true)
	@Override
	public List<UserTransDocumentDto> getUserTransDocument(Long userId) {

		if (!userRepository.existsById(userId)) {
			throw new DocsException(DocsExceptionCode.USER_NOT_FOUND);
		}

		List<TranslatedDocument> userTransDocuments = translatedDocumentRepository
			.findByUser_UserIdAndStatus(userId, Status.VISIBLE);

		// 번역 문서 ID 목록 추출
		return getUserTransDocumentDtos(userTransDocuments);
	}

	// 번역 상세 조회
	@Transactional(readOnly = true)
	@Override
	public TranslatedDocumentDto getTranslatedDocumentDetail(Integer docsId, Long transId) {

		if (docsId == null || transId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}

		if (!documentRepository.existsById(docsId)) {
			throw new DocsException(DocsExceptionCode.DOCS_NOT_FOUND);
		}

		// 번역 문서 조회
		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.TRANSLATION_NOT_FOUND));

		// 해당 번역 문서가 docsId에 속하는지 확인
		if (!translatedDocument.getOriginDocument().getDocument().getDocsId().equals(docsId)) {
			throw new DocsException(DocsExceptionCode.MISMATCH_TRANSLATION_AND_DOCS);
		}

		// 좋아요한 유저 목록 가져오기
		List<Long> likeUserIds = translatedDocumentLikeRepository.findLikedUserIdsByTransId(transId);

		return new TranslatedDocumentDto(
			translatedDocument.getTransId(),
			translatedDocument.getOriginDocument().getOriginId(),
			translatedDocument.getUser().getUserId(),
			translatedDocument.getContent(),
			translatedDocument.getReportCount(),
			translatedDocument.getStatus(),
			translatedDocument.getCreatedAt(),
			translatedDocument.getUpdatedAt(),
			likeUserIds.size(),
			likeUserIds
		);
	}

	// 번역 수정하기
	@Override
	@Transactional
	public TranslatedDocumentDto updateTranslatedDocument(Integer docsId, Long transId,
		TranslatedDocumentDto translatedDocumentDto) {
		// 유저 조회
		User user = userUtil.getUser();
		if (user == null) {
			throw new DocsException(DocsExceptionCode.USER_NOT_AUTHORIZED);
		}
		if (docsId == null || transId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}
		if (translatedDocumentDto.content().isBlank()) {
			throw new DocsException(DocsExceptionCode.REQUIRED_IS_EMPTY);
		}

		// 해당하는 번역 문서 찾기
		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.TRANSLATION_NOT_FOUND));

		// docsId와 transId가 일치하는지 검증
		if (!translatedDocument.getOriginDocument().getDocument().getDocsId().equals(docsId)) {
			throw new DocsException(DocsExceptionCode.MISMATCH_TRANSLATION_AND_DOCS);
		}

		// 작성자가 맞는지 확인 (작성자가 아니면 수정 불가)
		if (!translatedDocument.getUser().getUserId().equals(user.getUserId())) {
			throw new DocsException(DocsExceptionCode.NOT_YOUR_CONTENT);
		}

		// 내용 업데이트 후 저장
		translatedDocument.updateContent(translatedDocumentDto.content());

		// 좋아요한 유저 목록 가져오기
		List<Long> likeUserIds = translatedDocumentLikeRepository.findLikedUserIdsByTransId(transId);

		return TranslatedDocumentDto.fromEntity(translatedDocument, likeUserIds.size(), likeUserIds);
	}

	// 번역 삭제하기
	@Override
	@Transactional
	public void deleteTranslatedDocument(Integer docsId, Long transId) {

		User user = userUtil.getUser();

		if (user == null) {
			throw new DocsException(DocsExceptionCode.USER_NOT_AUTHORIZED);
		}
		if (docsId == null || transId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}

		// 번역 문서 조회
		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.TRANSLATION_NOT_FOUND));

		// docsId와 transId의 문서가 일치하는지 검증
		if (!translatedDocument.getOriginDocument().getDocument().getDocsId().equals(docsId)) {
			throw new DocsException(DocsExceptionCode.MISMATCH_TRANSLATION_AND_DOCS);
		}

		// 삭제 권한 확인 (작성자 본인만 삭제 가능)
		if (!translatedDocument.getUser().getUserId().equals(user.getUserId())) {
			throw new DocsException(DocsExceptionCode.NOT_YOUR_CONTENT);
		}

		// 번역삭제
		translatedDocument.setStatus(Status.DELETED);
		translatedDocumentRepository.save(translatedDocument);
	}

	// 번역 투표 / 투표해제
	@Override
	@Transactional
	public boolean toggleVotes(Integer docsId, Long transId) {

		User user = userUtil.getUser();
		if (user == null) {
			throw new DocsException(DocsExceptionCode.USER_NOT_AUTHORIZED);
		}
		if (docsId == null || transId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}

		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.TRANSLATION_NOT_FOUND));

		if (!translatedDocument.getOriginDocument().getDocument().getDocsId().equals(docsId)) {
			throw new DocsException(DocsExceptionCode.MISMATCH_TRANSLATION_AND_DOCS);
		}

		boolean hasVoted = translatedDocumentLikeRepository
			.existsByTranslatedDocument_TransIdAndUser_UserId(transId, user.getUserId());

		if (hasVoted) {
			translatedDocumentLikeRepository
				.deleteByTranslatedDocument_TransIdAndUser_UserId(transId, user.getUserId());
		} else {
			translatedDocumentLikeRepository.addVote(translatedDocument, user);
			alertsService.sendTranslationVoteAlert(translatedDocument, user);
		}

		return !hasVoted;
	}

	// 특정 유저가 좋아한 번역본 목록 조회
	@Override
	public List<UserTransDocumentDto> getUserLikedTrans(Long userId) {

		if (userId == null) {
			throw new DocsException(DocsExceptionCode.ILLEGAL_ARGUMENT);
		}
		if (!userRepository.existsById(userId)) {
			throw new DocsException(DocsExceptionCode.USER_NOT_FOUND);
		}

		List<TranslatedDocument> userLikedTrans =
			translatedDocumentLikeRepository.findLikedTranslatedDocsByUserId(userId);

		return getUserTransDocumentDtos(userLikedTrans);
	}

	@Transactional
	public void modifyDocsStatus(Long transId, Status status) {
		User user = userUtil.getUser();
		if (!userUtil.isAdmin(user)) {
			throw new DocsException(DocsExceptionCode.NO_PERMISSION);
		}

		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new DocsException(DocsExceptionCode.TRANSLATION_NOT_FOUND));

		translatedDocument.modifyStatus(status);
	}
}
