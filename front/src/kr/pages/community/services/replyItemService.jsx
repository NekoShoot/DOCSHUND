import { axiosJsonInstance } from "../../../utils/axiosInstance";
import propTypes from "prop-types";

const ReplyItemService = {
  async fetchReplyItem(articleId) {
    try {
      const response = await axiosJsonInstance.get(
        `forums/${articleId}/comments`
      );

      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // 원댓글 작성
  async postReplyItem(articleId, content) {
    try {
      const response = await axiosJsonInstance.post(
        `forums/${articleId}/comments`,
        {
          content,
        }
      );

      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // 대댓글 작성
  async postReReplyItem(articleId, commentId, content) {
    try {
      const response = await axiosJsonInstance.post(
        `forums/${articleId}/comments/${commentId}`,
        {
          content,
        }
      );

      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // 댓글 삭제
  async deleteReplyItem(articleId, commentId) {
    try {
      const response = await axiosJsonInstance.delete(
        `forums/${articleId}/comments/${commentId}`
      );

      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

ReplyItemService.fetchReplyItem.propTypes = {
  articleId: propTypes.number.isRequired,
};

ReplyItemService.postReplyItem.propTypes = {
  articleId: propTypes.number.isRequired,
  content: propTypes.string.isRequired,
};

export default ReplyItemService;
