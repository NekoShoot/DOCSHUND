import {
  axiosJsonInstance,
  axiosMultipartInstance,
} from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

// 신고 철회
export const withdrawReport = async (reportId) => {
  try {
    const response = await axiosJsonInstance.post(
      `supports/reports/${reportId}/withdraw`
    );
    const data = response.status;

    return data;
  } catch (error) {
    toast.error(error.response.data.message, {
      toastId: "report-error-in-admin",
    });
  }
};

export const registDocument = async (documentData) => {
  try {
    const response = await axiosJsonInstance.post(`docs`, documentData);
    const data = response.status;
    // console.log(data);
    return data;
  } catch (error) {
    // console.log("문서 등록 실패", error);
  }
};

export const registDocumentContent = async (docsId, originDocumentData) => {
  try {
    const response = await axiosMultipartInstance.post(
      `docs/${docsId}/origin`,
      originDocumentData
    );
    const data = response.status;
    return data;
  } catch (error) {
    // console.log("문서 원본 업로드 실패", error);
    toast.error(error.response.data.message);
  }
};

export const respondInquiry = async (inquiryId, answer) => {
  try {
    const response = await axiosJsonInstance.post(
      `supports/inquiry/${inquiryId}/answer`,
      answer
    );
    const data = response.status;
    return data;
  } catch (error) {
    // console.log("문의 응답 실패", error);
  }
};

export const registNotification = async (title, content) => {
  const noticeData = { title, content };
  try {
    const response = await axiosJsonInstance.post(
      `supports/notice`,
      noticeData
    );
    const data = response.status;
    return data;
  } catch (error) {
    // console.log("공지 등록 실패", error);
  }
};
