import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  // 토큰 설정 함수
  setToken: (newToken) => {
    set({ token: newToken });
  },

  loginWithGoogle: () => {
    window.location.href =
      "https://docshund.site/oauth2/authorization/google";
  },

  // GitHub 로그인 함수
  loginWithGithub: () => {
    // GitHub 로그인 페이지로 리다이렉트
    window.location.href =
      "https://docshund.site/oauth2/authorization/github";
  },

  // 로그아웃 함수
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("communityArticle-storage");
    localStorage.removeItem("flowbite-theme-mode");
    localStorage.removeItem("hasAgreed");
    localStorage.removeItem("hasClearedDB");
    set({ token: null });
  },

  // 인증 여부를 판단하는 함수
  isAuthenticated: () => {
    return !!get().token;
  },
}));

export default useAuthStore;
