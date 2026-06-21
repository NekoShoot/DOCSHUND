package com.ssafy.docshund.global.i18n;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Locale;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.context.support.ResourceBundleMessageSource;

/**
 * i18n 메시지 번들 스모크 테스트.
 *
 * Spring 컨텍스트(DB) 없이, Spring Boot 가 application.properties 의
 * spring.messages.basename 으로 자동 구성하는 것과 동일한 ResourceBundleMessageSource 를
 * 직접 만들어, 7개 도메인 번들의 대표 키가 한국어(base)/일본어(_ja) 양쪽으로
 * 비어있지 않게, 그리고 서로 다른 값으로 정상 해석되는지 검증한다.
 */
class I18nMessageBundleTest {

	private static ResourceBundleMessageSource messageSource() {
		ResourceBundleMessageSource ms = new ResourceBundleMessageSource();
		ms.setBasenames(
			"messages/alerts",
			"messages/chats",
			"messages/docs",
			"messages/forums",
			"messages/supports",
			"messages/users",
			"messages/global"
		);
		ms.setDefaultEncoding("UTF-8");
		// 키가 없으면 NoSuchMessageException 을 던지도록(누락 즉시 실패) 기본 동작 유지
		return ms;
	}

	static Stream<Arguments> representativeKeys() {
		return Stream.of(
			Arguments.of("global", "global.error.noPermission"),
			Arguments.of("alerts", "alert.error.alertNotFound"),
			Arguments.of("chats", "chat.error.notFound"),
			Arguments.of("docs", "docs.error.docsNotFound"),
			Arguments.of("forums", "forums.error.articleNotFound"),
			Arguments.of("supports", "supports.notice.error.notFound"),
			Arguments.of("users-memo", "memo.error.notYourMemo"),
			Arguments.of("users-nickname", "user.nickname.available")
		);
	}

	@ParameterizedTest(name = "[{0}] {1} → ko/ja 모두 해석되고 서로 다름")
	@MethodSource("representativeKeys")
	@DisplayName("각 도메인 번들 대표 키가 한/일로 정상 해석된다")
	void resolvesKoAndJa(String bundle, String key) {
		ResourceBundleMessageSource ms = messageSource();

		String ko = ms.getMessage(key, null, Locale.KOREAN);
		String ja = ms.getMessage(key, null, Locale.JAPANESE);

		assertThat(ko).as("%s (ko)", key).isNotBlank();
		assertThat(ja).as("%s (ja)", key).isNotBlank();
		assertThat(ja).as("%s 는 ko 와 ja 가 달라야 함", key).isNotEqualTo(ko);
	}

	@org.junit.jupiter.api.Test
	@DisplayName("Locale.KOREAN 은 base(.properties) 한국어로, JAPANESE 는 _ja 로 해석된다")
	void koreanFallsBackToBaseJapaneseUsesJaFile() {
		ResourceBundleMessageSource ms = messageSource();

		// 알려진 일본어 값(메모 권한): users_ja.properties 의 memo.error.notYourMemo
		String ja = ms.getMessage("memo.error.notYourMemo", null, Locale.JAPANESE);
		String ko = ms.getMessage("memo.error.notYourMemo", null, Locale.KOREAN);

		// 일본어 결과에는 일본어 문자(히라가나/가타카나/한자)가 포함되어야 한다
		assertThat(ja.codePoints().anyMatch(I18nMessageBundleTest::isJapanese))
			.as("일본어 메시지에 일본어 문자가 포함되어야 함: %s", ja)
			.isTrue();
		// 한국어 결과에는 한글 음절이 포함되어야 한다
		assertThat(ko.codePoints().anyMatch(cp -> cp >= 0xAC00 && cp <= 0xD7A3))
			.as("한국어 메시지에 한글이 포함되어야 함: %s", ko)
			.isTrue();
	}

	private static boolean isJapanese(int cp) {
		return (cp >= 0x3040 && cp <= 0x309F)   // Hiragana
			|| (cp >= 0x30A0 && cp <= 0x30FF)   // Katakana
			|| (cp >= 0x4E00 && cp <= 0x9FFF);  // CJK (한자/漢字)
	}
}
