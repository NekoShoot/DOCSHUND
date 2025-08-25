import { axiosJsonInstance } from "../../../utils/axiosInstance";

// 좋아요한 문서 조회
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axiosJsonInstance.delete(
      `supports/notice/${notificationId}`
    );
    const data = response.status;

    return data;
  } catch (error) {
    console.log("공지 목록 삭제 실패", error);
  }
};
