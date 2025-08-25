import { axiosJsonInstance } from "../../../utils/axiosInstance";

// 좋아요한 문서 조회
export const fetchUserList = async (page = 0, size = 9999999) => {
  try {
    const response = await axiosJsonInstance.get(
      `/users?page=${page}&size=${size}`
    );
    const data = response.data.content;
    return data;
  } catch (error) {
    // console.log("유저 목록 조회 실패", error);
  }
};

export const fetchReportList = async (page = 0, size = 9999999) => {
  try {
    const response = await axiosJsonInstance.get(
      `/supports/reports?page=${page}&size=${size}`
    );
    const data = response.data.content;
    return data;
  } catch (error) {
    // console.log("신고 목록 조회 실패", error);
  }
};

export const fetchInquiryList = async (page = 0, size = 999999) => {
  try {
    const response = await axiosJsonInstance.get(
      `/supports/inquiry?page=${page}&size=${size}`
    );
    const data = response.data.content;
    return data;
  } catch (error) {
    // console.log("문의 목록 조회 실패", error);
    // console.log(response);
    alert(error);
  }
};

export const fetchNoticeList = async () => {
  try {
    const response = await axiosJsonInstance.get(`supports/notice`);
    const data = response.data;
    return data;
  } catch (error) {
    // console.log("공지 목록 조회 실패", error);
  }
};
