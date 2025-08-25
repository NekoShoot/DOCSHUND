import { axiosJsonInstance } from "../../../utils/axiosInstance";
import proptypes from "prop-types";

const MyArticleService = {
  async fetchArticles(userId, currentPage, itemsPerPage) {
    try {
      // 좋아요한 게시글을 가져오는 api 호출
      const response = await axiosJsonInstance.get(
        `forums/user/${userId}?page=${currentPage}&size=${itemsPerPage}`
      );

      const data = response.data;

      return data;
    } catch (error) {
      // console.error(error);
      return null;
    }
  },
};

MyArticleService.fetchArticles.propTypes = {
  currentPage: proptypes.number,
  itemsPerPage: proptypes.number,
};

export default MyArticleService;
