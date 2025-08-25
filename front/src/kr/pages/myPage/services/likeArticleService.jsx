import { axiosJsonInstance } from "../../../utils/axiosInstance";
import proptypes from "prop-types";

const LikeArticleService = {
  async fetchArticles(currentPage, itemsPerPage) {
    try {
      // 좋아요한 게시글을 가져오는 api 호출
      const response = await axiosJsonInstance.get(
        `forums/likes?page=${currentPage}&size=${itemsPerPage}`
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

LikeArticleService.fetchArticles.propTypes = {
  currentPage: proptypes.number,
  itemsPerPage: proptypes.number,
};

export default LikeArticleService;
