import { axiosJsonInstance } from "../../../utils/axiosInstance";

// 유저상태 변경
export const changeUserStatus = async (userId, status) => {
  try {
    const response = await axiosJsonInstance.patch(`users/${userId}/status`, {
      status: status,
    });
    const data = response.status;
    // console.log(data);
    return data;
  } catch (error) {
    // console.log("유저 상태 변경 실패", error);
  }
};

// 공지사항 수정
export const modifyNotice = async (noticeId, title, content) => {
  try {
    const response = await axiosJsonInstance.patch(
      `supports/notice/${noticeId}`,
      { title, content }
    );
    const data = response.status;
    // console.log(data);
    return data;
  } catch (error) {
    // console.log("공지사항 수정 실패", error);
  }
};
