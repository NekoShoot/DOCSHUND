import { axiosJsonInstance } from "../../../utils/axiosInstance";
import proptypes from "prop-types";

const MyCommentService = {
  async fetchComments(userId) {
    try {
      const response = await axiosJsonInstance.get(
        `forums/comments/user/${userId}`
      );

      const data = response.data;
      return data;
    } catch (error) {
      //TODO: error handling -> 에러 페이지 제작후 연결까지 구현
      // console.error(error);
      return null;
    }
  },
};

MyCommentService.fetchComments.propTypes = {
  userId: proptypes.number,
};

export default MyCommentService;
