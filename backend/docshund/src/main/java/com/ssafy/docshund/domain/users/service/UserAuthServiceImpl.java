package com.ssafy.docshund.domain.users.service;

import static com.ssafy.docshund.domain.users.entity.Provider.GITHUB;
import static com.ssafy.docshund.domain.users.entity.Provider.GOOGLE;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.AUTH_MEMBER_NOT_FOUND;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.LOGIN_PROVIDER_MISMATCH;
import static com.ssafy.docshund.domain.users.exception.user.UserExceptionCode.USER_BANNED;
import static com.ssafy.docshund.domain.users.exception.user.UserExceptionCode.USER_WITHDRAW;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.docshund.domain.users.dto.auth.CustomOAuth2User;
import com.ssafy.docshund.domain.users.dto.auth.GithubResponse;
import com.ssafy.docshund.domain.users.dto.auth.GoogleResponse;
import com.ssafy.docshund.domain.users.dto.auth.OAuth2Response;
import com.ssafy.docshund.domain.users.dto.auth.UserDto;
import com.ssafy.docshund.domain.users.entity.Status;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.entity.UserInfo;
import com.ssafy.docshund.domain.users.exception.auth.AuthException;
import com.ssafy.docshund.domain.users.exception.user.UserException;
import com.ssafy.docshund.domain.users.repository.UserInfoRepository;
import com.ssafy.docshund.domain.users.repository.UserRepository;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserAuthServiceImpl extends DefaultOAuth2UserService {

	private final UserRepository userRepository;
	private final UserInfoRepository userInfoRepository;
	private final UserUtil userUtil;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		String registrationId = userRequest.getClientRegistration().getRegistrationId();
		OAuth2Response oAuth2Response = getOAuth2Response(registrationId, oAuth2User);

		String username = generateUsername(oAuth2Response);
		UserDto userDto = UserDto.createUserDto(oAuth2Response, username);

		User findUser = userRepository.findByProviderAndPersonalId(oAuth2Response.getProvider(),
				oAuth2Response.getProviderId())
			.orElseGet(() -> {
				User saveUser = userRepository.save(User.createUser(userDto));
				userInfoRepository.save(UserInfo.createUserInfo(saveUser));
				return saveUser;
			});

		validateUser(findUser);
		findUser.updateLastLogin();

		userDto.setRole(findUser.getRole().toString());
		userDto.setUserId(findUser.getUserId());

		return new CustomOAuth2User(userDto);
	}

	public void deleteUser() {
		User user = userUtil.getUser();
		if (user == null) {
			throw new AuthException(AUTH_MEMBER_NOT_FOUND);
		}

		user.deleteUser();
	}

	private OAuth2Response getOAuth2Response(String registrationId, OAuth2User oAuth2User) {
		if (registrationId.equals(GITHUB.getLoginProvider())) {
			log.info("Google Register ProviderID: {}", oAuth2User.getAttributes().get("id"));
			return new GithubResponse(oAuth2User.getAttributes());
		}
		if (registrationId.equals(GOOGLE.getLoginProvider())) {
			log.info("Google Register ProviderID: {}", oAuth2User.getAttributes().get("sub"));
			return new GoogleResponse(oAuth2User.getAttributes());
		}
		throw new AuthException(LOGIN_PROVIDER_MISMATCH);
	}

	private String generateUsername(OAuth2Response oAuth2Response) {
		String prefix = oAuth2Response.getProvider().equals(GITHUB) ? "gh" : "gg";
		String reversedId = new StringBuilder(oAuth2Response.getProviderId()).reverse().toString();
		return prefix + "_" + reversedId.substring(0, Math.min(reversedId.length(), 6));
	}

	private void validateUser(User findUser) {
		if (findUser.getStatus() == Status.BANNED) {
			throw new UserException(USER_BANNED);
		}
		if (findUser.getStatus() == Status.WITHDRAWN) {
			throw new UserException(USER_WITHDRAW);
		}
	}
}
    
