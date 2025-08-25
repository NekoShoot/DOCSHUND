import { axiosJsonInstance } from "../../../utils/axiosInstance";

export const likeDocs = async (docsId) => {
  try {
    const response = await axiosJsonInstance.post(`docs/${docsId}/likes`);
    // console.log(response.data);
  } catch (error) {
    // console.log("문서 좋아요 실패", error);
  }
};

export const likeTranslate = async (docsId, transId) => {
  try {
    const response = await axiosJsonInstance.post(
      `docs/${docsId}/trans/paragraph/${transId}/votes`
    );
    // console.log(response.status);
    return response.status;
  } catch (error) {
    // console.log("번역 좋아요 실패", error);
  }
};

export const registTranslate = async (docsId, originId, content) => {
  try {
    const response = await axiosJsonInstance.post(
      `docs/${docsId}/trans/${originId}`,
      { content: content }
    );
    // console.log(response.status);
    return response.status;
  } catch (error) {
    // console.log("번역 등록 실패", error);
  }
};
