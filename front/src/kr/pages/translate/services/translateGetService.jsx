import { axiosJsonInstance } from "../../../utils/axiosInstance";
import PropTypes from "prop-types";

// 좋아요한 문서 조회
export const fetchLikedList = async (docsId) => {
  try {
    const response = await axiosJsonInstance.get(`docs/${docsId}/likes`);
    const data = response.data;
    return data;
  } catch (error) {
    // console.log("좋아요한 문서 조회 실패", error);
  }
};

// 문서 리스트 조회
export const fetchDocsList = async () => {
  try {
    const response = await axiosJsonInstance.get(`docs`);
    const data = response.data;
    return data;
  } catch (error) {
    // console.log(error);
  }
};

export const fetchTranslateData = async (docsId, originId) => {
  try {
    const response = await axiosJsonInstance.get(
      `docs/${docsId}/origin?originId=${originId}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// 베스트 번역본 조회
export const fetchBestTranslate = async (docsId, isBest) => {
  const status = isBest ? "best" : "";
  try {
    if (isBest === "best") {
      const response = await axiosJsonInstance.get(
        `docs/${docsId}/trans?status=${status}`
      );
      const data = response.data;

      return data;
    } else {
      const response = await axiosJsonInstance.get(
        `docs/${docsId}/trans?status=${status}`
      );
      const data = response.data;
      return data;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// 좋아요한 번역본 조회
export const fetchLikedTranslateList = async (userId) => {
  try {
    const response = await axiosJsonInstance.get(`docs/trans/votes`, {
      params: { userId: userId },
    });
    const data = response.data;
    return data;
  } catch (error) {
    // console.log("좋아요 번역 조회 실패", error);
  }
};

fetchTranslateData.propTypes = {
  docsId: PropTypes.string.isRequired,
  originId: PropTypes.string,
  test: PropTypes.bool.isRequired,
};

fetchBestTranslate.propTypes = {
  docsId: PropTypes.string.isRequired,
  isBest: PropTypes.bool.isRequired,
  originId: PropTypes.string.isRequired,
  test: PropTypes.bool.isRequired,
};
