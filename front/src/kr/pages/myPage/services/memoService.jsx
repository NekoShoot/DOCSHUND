import { axiosJsonInstance } from "../../../utils/axiosInstance";

const memoService = {
  // 메모 목록 가져오기
  async fetchMemos(userId, page = 0, size = 9) {
    if (!userId) {
      return null;
    }
    try {
      const response = await axiosJsonInstance.get(
        `users/${userId}/memo?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      // console.error("메모 목록을 가져오는 중 오류 발생:", error);
      return null;
    }
  },

  // 특정 메모 가져오기 (상세 조회)
  async fetchMemo(userId, memoId) {
    try {
      const response = await axiosJsonInstance.get(
        `users/${userId}/memo/${memoId}`
      );
      return response.data;
    } catch (error) {
      // console.error("메모를 가져오는 중 오류 발생:", error);
      return null;
    }
  },

  // 새로운 메모 생성하기
  async createMemo(userId, memoData) {
    try {
      const response = await axiosJsonInstance.post(
        `users/${userId}/memo`,
        memoData
      );
      return response.data;
    } catch (error) {
      // console.error("메모를 생성하는 중 오류 발생:", error);
      return null;
    }
  },

  // 메모 업데이트하기
  async updateMemo(userId, memoId, memoData) {
    try {
      const response = await axiosJsonInstance.patch(
        `users/${userId}/memo/${memoId}`,
        memoData
      );
      return response.data;
    } catch (error) {
      // console.error("메모를 업데이트하는 중 오류 발생:", error);
      return null;
    }
  },

  // 메모 삭제하기
  async deleteMemo(userId, memoId) {
    try {
      await axiosJsonInstance.delete(`users/${userId}/memo/${memoId}`);
    } catch (error) {
      // console.error("메모를 삭제하는 중 오류 발생:", error);
    }
  },
};

export default memoService;
