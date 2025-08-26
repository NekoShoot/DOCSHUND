package com.ssafy.docshund.domain.supports.service;

import static com.ssafy.docshund.domain.supports.exception.inquiry.InquiryExceptionCode.INQUIRY_NOT_FOUND;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.INVALID_MEMBER_ROLE;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.docshund.domain.alerts.service.AlertsService;
import com.ssafy.docshund.domain.supports.dto.inquiry.AnswerRequestDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.InquiryRequestDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.page.InquiryAndAnswerDto;
import com.ssafy.docshund.domain.supports.entity.Answer;
import com.ssafy.docshund.domain.supports.entity.Inquiry;
import com.ssafy.docshund.domain.supports.entity.InquiryCategory;
import com.ssafy.docshund.domain.supports.exception.inquiry.InquiryException;
import com.ssafy.docshund.domain.supports.repository.AnswerRepository;
import com.ssafy.docshund.domain.supports.repository.InquiryRepository;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.exception.auth.AuthException;
import com.ssafy.docshund.global.aws.s3.S3FileUploadService;
import com.ssafy.docshund.global.mail.MailSendService;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {

	private final InquiryRepository inquiryRepository;
	private final AnswerRepository answerRepository;
	private final MailSendService mailSendService;
	private final S3FileUploadService fileUploadService;
	private final UserUtil userUtil;
	private final AlertsService alertsService;
	private final MessageSource messageSource;

	@Override
	@Transactional
	public void createInquiry(InquiryRequestDto inquiryRequestDto, MultipartFile file) {
		User user = userUtil.getUser();
		String imageUrl = null;
		if (file != null) {
			imageUrl = fileUploadService.uploadFile(file, "inquiry");
		}

		Inquiry inquiry = Inquiry.createInquiry(user, inquiryRequestDto, imageUrl);

		// 이메일 제목과 본문을 여기서 생성
		Locale locale = LocaleContextHolder.getLocale();
		String titleSuffix = messageSource.getMessage("supports.inquiry.email.title.suffix", null, locale);
		String categoryDescription = InquiryCategory.valueOf(inquiryRequestDto.getCategory()).getLocalizedDescription(messageSource, locale);
		String contentPrefix = messageSource.getMessage("supports.inquiry.email.content.prefix", new Object[]{categoryDescription}, locale);
		String contentSuffix = messageSource.getMessage("supports.inquiry.email.content.suffix", null, locale);

		String emailTitle = inquiryRequestDto.getTitle() + titleSuffix;
		String emailContent = contentPrefix + inquiryRequestDto.getContent() + contentSuffix;

		mailSendService.sendEmail(inquiryRequestDto.getEmail(), emailTitle, emailContent, imageUrl);

		inquiryRepository.save(inquiry);
	}

	@Override
	public Page<InquiryAndAnswerDto> getInquiries(Long userId, Pageable pageable) {
		User user = userUtil.getUser();
		if (user == null) {
			throw new AuthException(INVALID_MEMBER_ROLE);
		}

		if (userUtil.isAdmin(user) || (userId != null && userUtil.isMine(userId, user))) {
			return inquiryRepository.searchInquiryAndAnswer(userId, pageable);
		}

		throw new AuthException(INVALID_MEMBER_ROLE);
	}

	@Override
	@Transactional
	public void respondToInquiry(Long inquiryId, AnswerRequestDto answerRequestDto) {
		Inquiry inquiry = inquiryRepository.findById(inquiryId).orElseThrow(
			() -> new InquiryException(INQUIRY_NOT_FOUND));

		Answer answer = Answer.createAnswer(answerRequestDto, inquiry);

		Locale locale = LocaleContextHolder.getLocale();
		String titleSuffix = messageSource.getMessage("supports.inquiry.email.answer.title.suffix", null, locale);

		mailSendService.sendEmail(inquiry.getEmail(), inquiry.getTitle() + titleSuffix, answer.getContent(),
			null);

		inquiry.isAnsweredTrue();
		answerRepository.save(answer);
		if (inquiry.getUser() != null) {
			alertsService.sendInquiryAnswerAlert(inquiry);
		}
	}

}
    
