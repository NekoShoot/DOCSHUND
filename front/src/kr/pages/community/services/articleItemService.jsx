import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
  axiosJsonInstance,
  axiosMultipartInstance,
} from "../../../utils/axiosInstance";

const ArticleItemService = {
  // 게시글 상세 정보를 가져오는 함수
  async fetchArticleItem(articleId) {
    try {
      // axios 헤더 json에 token을 담아주는 객체를 사용하여 서버에 GET 요청
      const response = await axiosJsonInstance.get(`forums/${articleId}`);

      const data = response.data;

      // 가져온 데이터를 반환
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  // 게시글 삭제 요청 함수
  async deleteArticleItem(articleId) {
    try {
      const response = await axiosJsonInstance.delete(`forums/${articleId}`);

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  // 게시글 좋아요/좋아요취소 요청 함수
  async likeArticleItem(articleId) {
    try {
      const response = await axiosJsonInstance.post(
        `forums/${articleId}/likes`
      );

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  // 이미지 파일 업로드 요청 함수
  async uploadImageFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosMultipartInstance.post(
        `/forums/image`,
        formData
      );

      return response;
    } catch (error) {
      console.error("파일 업로드 실패");
      // 사용자 피드백 (UI)
      toast.warn("이미지 형식이 아닙니다.", {
        toastId: "uploadFail",
      });
      return Promise.reject({ message: "Upload failed" }); // 상세정보 제거
    }
  },

  // 게시글 작성 요청 함수
  async postArticleItem(title, category, content) {
    try {
      const response = await axiosJsonInstance.post("/forums", {
        title,
        category,
        content,
      });

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  // 게시글 수정 요청 함수
  async patchArticleItem(articleId, title, category, content) {
    try {
      const response = await axiosJsonInstance.patch(`/forums/${articleId}`, {
        title,
        category,
        content,
      });

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

ArticleItemService.propTypes = {
  articleId: PropTypes.number,
  file: PropTypes.object,
};

export default ArticleItemService;
