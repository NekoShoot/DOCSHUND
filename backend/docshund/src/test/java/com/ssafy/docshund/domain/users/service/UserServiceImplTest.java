package com.ssafy.docshund.domain.users.service;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.docshund.domain.users.dto.page.UserAndInfoDto;
import com.ssafy.docshund.domain.users.dto.page.UserProfileDto;
import com.ssafy.docshund.domain.users.dto.page.UserSearchCondition;
import com.ssafy.docshund.domain.users.dto.profile.ProfileRequestDto;
import com.ssafy.docshund.domain.users.entity.Hobby;
import com.ssafy.docshund.domain.users.entity.Provider;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.entity.UserInfo;
import com.ssafy.docshund.domain.users.repository.UserInfoRepository;
import com.ssafy.docshund.domain.users.repository.UserRepository;
import com.ssafy.docshund.fixture.UserTestHelper;
import com.ssafy.docshund.fixture.WithMockCustomOAuth2User;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
@Transactional
class UserServiceImplTest {

	@Autowired
	UserTestHelper userTestHelper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private UserUtil userUtil;
	@Autowired
	private UserInfoRepository userInfoRepository;

	@BeforeEach
	public void saveDefaultUsers() {
		userTestHelper.saveUser("admin@gmail.com", "100000", "adminUser", Provider.GOOGLE, true, "안녕하세요", "Backend",
			true);
		userTestHelper.saveUser("test1@gmail.com", "10001", "testUser1", Provider.GOOGLE, false, "안녕하세요", "Frontend",
			true);
		userTestHelper.saveUser("test2@github.com", "10002", "testUser2", Provider.GITHUB, false, "안녕하세요", "Backend",
			true);
	}

	@Test
	@DisplayName("조회 테스트 - 이메일 검색")
	@WithMockCustomOAuth2User
	void searchUserByEmail() {
		//given
		UserSearchCondition googleEmail = new UserSearchCondition();
		googleEmail.setEmail("@gmail.com");

		UserSearchCondition githubEmail = new UserSearchCondition();
		githubEmail.setEmail("@github.com");

		Pageable pageable = PageRequest.of(0, 10);

		//when
		Page<UserAndInfoDto> googleEmailCount = userService.searchUsers(googleEmail, pageable);
		Page<UserAndInfoDto> githubEmailCount = userService.searchUsers(githubEmail, pageable);

		//then
		Assertions.assertThat(googleEmailCount.getTotalElements()).isEqualTo(2);
		Assertions.assertThat(githubEmailCount.getTotalElements()).isEqualTo(1);

	}

	@Test
	@DisplayName("조회 테스트 - 닉네임 검색")
	@WithMockCustomOAuth2User
	void searchUserByNickname() {
		//given
		UserSearchCondition testUsers = new UserSearchCondition();
		testUsers.setNickname("test");

		UserSearchCondition adminUsers = new UserSearchCondition();
		adminUsers.setEmail("admin");

		Pageable pageable = PageRequest.of(0, 10);

		//when
		Page<UserAndInfoDto> testUsersCount = userService.searchUsers(testUsers, pageable);
		Page<UserAndInfoDto> adminUsersCount = userService.searchUsers(adminUsers, pageable);

		//then
		Assertions.assertThat(testUsersCount.getTotalElements()).isEqualTo(2);
		Assertions.assertThat(adminUsersCount.getTotalElements()).isEqualTo(1);

	}

	@Test
	@DisplayName("프로필 조회 테스트")
	@WithMockCustomOAuth2User
	void getUserProfileSuccess() {
		//given
		User user = userUtil.getUser();

		//when
		UserProfileDto userProfile = userService.getUserProfile(user.getUserId());

		//then
		Assertions.assertThat(userProfile.getNickname()).isEqualTo(user.getNickname());

	}

	@Test
	@DisplayName("수정 테스트")
	@WithMockCustomOAuth2User
	void modifyUserSuccess() {
		//given
		User user = userUtil.getUser();
		ProfileRequestDto profile = new ProfileRequestDto();
		profile.setIntroduce("변경된자기소개");
		profile.setHobby("Frontend");
		profile.setIsDarkmode(false);
		profile.setNickname("변경된 닉네임");

		//when
		userService.modifyUserProfile(user, profile, null);

		//then
		User findUser = userRepository.findByPersonalId(user.getPersonalId()).get();
		UserInfo findUserInfo = userInfoRepository.findByUser(findUser).get();

		Assertions.assertThat(findUser.getNickname()).isEqualTo(profile.getNickname());
		Assertions.assertThat(findUserInfo.getIntroduce()).isEqualTo(profile.getIntroduce());
		Assertions.assertThat(findUserInfo.isDarkmode()).isFalse();
		Assertions.assertThat(findUserInfo.getHobby()).isEqualTo(Hobby.FRONTEND);
	}

	@Test
	@DisplayName("조회 테스트 - 관심사 검색")
	@WithMockCustomOAuth2User
	void searchUserByHobby() {
		//given
		UserSearchCondition backUsers = new UserSearchCondition();
		backUsers.setCategory(Hobby.BACKEND);

		UserSearchCondition frontUsers = new UserSearchCondition();
		frontUsers.setCategory(Hobby.FRONTEND);

		Pageable pageable = PageRequest.of(0, 10);

		//when
		Page<UserAndInfoDto> backendUsersCount = userService.searchUsers(backUsers, pageable);
		Page<UserAndInfoDto> frontendUsersCount = userService.searchUsers(frontUsers, pageable);

		//then
		Assertions.assertThat(backendUsersCount.getTotalElements()).isEqualTo(2);
		Assertions.assertThat(frontendUsersCount.getTotalElements()).isEqualTo(1);

	}

	@Test
	@DisplayName("조회 테스트 - 전체 검색")
	@WithMockCustomOAuth2User
	void searchUserByAll() {
		//given
		UserSearchCondition noCondition = new UserSearchCondition();

		Pageable pageable = PageRequest.of(0, 10);

		//when
		Page<UserAndInfoDto> allUserCount = userService.searchUsers(noCondition, pageable);

		//then
		Assertions.assertThat(allUserCount.getTotalElements()).isEqualTo(3);
	}
}
