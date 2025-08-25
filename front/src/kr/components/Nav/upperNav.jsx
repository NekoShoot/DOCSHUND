import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// components
import RectBtn from "../button/rectBtn";
import NotificationModal from "../notificationModal/notificationModal";

// store
import useUserProfileStore from "../../store/myPageStore/userProfileStore";
import useModalStore from "../../store/modalStore";
import notificationModalStore from "../../store/notificationModalStore";
import communityArticleStore from "../../store/communityStore/communityArticleStore";

// services
import authService from "../../services/authService";

// assets
import logo from "../../assets/logo.png";
import notification from "../../assets/icon/notification32.png";

const UpperNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const { token, isAuthenticated, logout } = authService();
  const { profile, fetchProfile } = useUserProfileStore();
  const { openModal } = useModalStore();
  const {
    toggleNotificationModal,
    isNotificationModalOpen,
    closeNotificationModal,
    isAllChecked,
  } = notificationModalStore();
  const { clearArticles } = communityArticleStore();

  const [profileImgUrl, setProfileImgUrl] = useState(profile?.profileImage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 프로필 정보 불러오기
  useEffect(() => {
    if (isAuthenticated() && token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        fetchProfile(userId);
      } catch (error) {
        // console.error("토큰 디코딩 실패", error);
      }
    }
  }, [isAuthenticated, token, fetchProfile]);

  // 프로필 이미지 업데이트
  useEffect(() => {
    setProfileImgUrl(profile?.profileImage);
  }, [profile]);

  // 위치 이동 시 알림 모달 및 모바일 메뉴 닫기
  useEffect(() => {
    closeNotificationModal();
    setIsMobileMenuOpen(false);
  }, [location]);

  // 로그인 버튼 동작
  const handleLoginClick = () => {
    if (isAuthenticated()) {
      logout();
    } else {
      openModal();
    }
  };

  const handleImageClick = () => {
    if (isAuthenticated() && isAdmin) {
      navigate("/admin/manageUser");
    } else if (isAuthenticated()) {
      navigate("/myPage/profile");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === "ROLE_ADMIN") setIsAdmin(true);
    }
  }, [localStorage.getItem("token")]);

  const handleToggleNotificationModal = (e) => {
    e.stopPropagation();
    toggleNotificationModal();
  };

  // 링크 스타일
  const activeLink = "font-bold text-[clamp(16px,1.5vw,20px)] text-[#bc5b39]";
  const inactiveLink =
    "text-[clamp(16px,1.5vw,20px)] text-[#424242] hover:text-[#bc5b39]";

  return (
    <nav className="bg-[#f0eee5] shadow-[0px_-1px_1px_0px_rgba(0,0,0,0.10)]">
      {/* 모바일 레이아웃 */}
      <div className="md:hidden">
        <div className="flex justify-between items-center px-4 py-3">
          {/* 왼쪽: 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md focus:outline-none"
          >
            <svg
              className="h-6 w-6 text-[#424242]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
          {/* 오른쪽: 액션 아이콘 (로고 제거) */}
          <div className="flex items-center gap-3">
            {isAuthenticated() && (
              <div className="relative">
                {isAllChecked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 2 20 20"
                    className="w-[clamp(20px,2.1vw,32px)] h-auto cursor-pointer"
                    onClick={handleToggleNotificationModal}
                    alt="알림 아이콘"
                  >
                    <path
                      d="M12 2.5c-0.3 0-0.5 0.2-0.5 0.5v1.1c-3 0.4-5.5 3-5.5 6.2v3.8l-2 2v1h16v-1l-2-2v-3.8c0-3.2-2.5-5.8-5.5-6.2V3c0-0.3-0.2-0.5-0.5-0.5zM7.9 18c0.5 1.2 1.7 2 3.1 2s2.6-0.8 3.1-2H7.9z"
                      fill="#CD412A"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 2 20 20"
                    className="w-[clamp(20px,2.1vw,32px)] h-auto cursor-pointer"
                    onClick={handleToggleNotificationModal}
                    alt="알림 아이콘"
                  >
                    <path
                      d="M12 2.5c-0.3 0-0.5 0.2-0.5 0.5v1.1c-3 0.4-5.5 3-5.5 6.2v3.8l-2 2v1h16v-1l-2-2v-3.8c0-3.2-2.5-5.8-5.5-6.2V3c0-0.3-0.2-0.5-0.5-0.5zM7.9 18c0.5 1.2 1.7 2 3.1 2s2.6-0.8 3.1-2H7.9z"
                      fill="#CD412A"
                    />
                    <circle cx="17" cy="17" r="4" fill="white" />
                    <circle cx="17" cy="17" r="3" fill="#CD412A" />
                  </svg>
                )}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+1.8rem)] z-[1000] transition-all duration-300 transform ${
                    isNotificationModalOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <NotificationModal />
                </div>
              </div>
            )}
            <RectBtn
              onClick={handleLoginClick}
              text={isAuthenticated() ? "로그아웃" : "로그인"}
            />
            {isAuthenticated() && profileImgUrl && (
              <img
                onClick={handleImageClick}
                className="w-[clamp(40px,4vw,64px)] h-[clamp(40px,4vw,64px)] border border-[#c5afa7] shadow-sm rounded-full cursor-pointer"
                src={profileImgUrl}
                alt="프로필 이미지"
              />
            )}
          </div>
        </div>
        {/* 모바일 내비게이션 메뉴 */}
        {isMobileMenuOpen && (
          <div className="bg-[#f0eee5] px-4 py-6">
            <div className="flex flex-col items-start space-y-4">
              <div
                onClick={() => {
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
                className={`cursor-pointer ${
                  location.pathname === "/" ? activeLink : inactiveLink
                }`}
              >
                홈
              </div>
              <div
                onClick={() => {
                  navigate("/translate");
                  setIsMobileMenuOpen(false);
                }}
                className={`cursor-pointer ${
                  location.pathname.startsWith("/translate")
                    ? activeLink
                    : inactiveLink
                }`}
              >
                번역문서
              </div>
              <div
                onClick={() => {
                  clearArticles();
                  navigate("/community");
                  setIsMobileMenuOpen(false);
                }}
                className={`cursor-pointer ${
                  location.pathname.startsWith("/community")
                    ? activeLink
                    : inactiveLink
                }`}
              >
                커뮤니티
              </div>
              <div
                onClick={() => {
                  navigate("/helpDesk");
                  setIsMobileMenuOpen(false);
                }}
                className={`cursor-pointer ${
                  location.pathname.startsWith("/helpDesk")
                    ? activeLink
                    : inactiveLink
                }`}
              >
                헬프데스크
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 데스크탑 레이아웃 */}
      <div className="hidden md:flex justify-center items-center px-9 py-3">
        <div className="w-full max-w-screen-xl mx-auto gap-3 flex items-center justify-between">
          {/* 로고 */}
          <NavLink to="/">
            <img
              className="w-[clamp(120px,10vw,148px)] h-auto"
              src={logo}
              alt="로고 이미지"
            />
          </NavLink>
          {/* 내비게이션 메뉴 */}
          <div className="flex w-2/4 justify-between">
            <div
              onClick={() => navigate("/")}
              className={`cursor-pointer ${
                location.pathname === "/" ? activeLink : inactiveLink
              }`}
            >
              홈
            </div>
            <div
              onClick={() => navigate("/translate")}
              className={`cursor-pointer ${
                location.pathname.startsWith("/translate")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              번역문서
            </div>
            <div
              onClick={() => {
                clearArticles();
                navigate("/community");
              }}
              className={`cursor-pointer ${
                location.pathname.startsWith("/community")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              커뮤니티
            </div>
            <div
              onClick={() => navigate("/helpDesk")}
              className={`cursor-pointer ${
                location.pathname.startsWith("/helpDesk")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              헬프데스크
            </div>
          </div>
          {/* 오른쪽 영역 */}
          <div className="flex items-center gap-4">
            {isAuthenticated() && (
              <div className="relative">
                {isAllChecked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 2 20 20"
                    className="w-[clamp(20px,2.1vw,32px)] h-auto cursor-pointer"
                    onClick={handleToggleNotificationModal}
                    alt="알림 아이콘"
                  >
                    <path
                      d="M12 2.5c-0.3 0-0.5 0.2-0.5 0.5v1.1c-3 0.4-5.5 3-5.5 6.2v3.8l-2 2v1h16v-1l-2-2v-3.8c0-3.2-2.5-5.8-5.5-6.2V3c0-0.3-0.2-0.5-0.5-0.5zM7.9 18c0.5 1.2 1.7 2 3.1 2s2.6-0.8 3.1-2H7.9z"
                      fill="#CD412A"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 2 20 20"
                    className="w-[clamp(20px,2.1vw,32px)] h-auto cursor-pointer"
                    onClick={handleToggleNotificationModal}
                    alt="알림 아이콘"
                  >
                    <path
                      d="M12 2.5c-0.3 0-0.5 0.2-0.5 0.5v1.1c-3 0.4-5.5 3-5.5 6.2v3.8l-2 2v1h16v-1l-2-2v-3.8c0-3.2-2.5-5.8-5.5-6.2V3c0-0.3-0.2-0.5-0.5-0.5zM7.9 18c0.5 1.2 1.7 2 3.1 2s2.6-0.8 3.1-2H7.9z"
                      fill="#CD412A"
                    />
                    <circle cx="17" cy="17" r="4" fill="white" />
                    <circle cx="17" cy="17" r="3" fill="#CD412A" />
                  </svg>
                )}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+1.8rem)] z-[1000] transition-all duration-300 transform ${
                    isNotificationModalOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <NotificationModal />
                </div>
              </div>
            )}
            <RectBtn
              onClick={handleLoginClick}
              text={isAuthenticated() ? "로그아웃" : "로그인"}
            />
            {isAuthenticated() && profileImgUrl && (
              <img
                onClick={handleImageClick}
                className="w-[clamp(40px,4vw,64px)] h-[clamp(40px,4vw,64px)] border border-[#c5afa7] shadow-sm rounded-full cursor-pointer"
                src={profileImgUrl}
                alt="프로필 이미지"
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UpperNav;
