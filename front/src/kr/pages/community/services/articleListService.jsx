import { axiosJsonInstance } from "../../../utils/axiosInstance";
import propTypes from "prop-types";

const ArticleListService = {
  async fetchArticles(
    sortType,
    filter,
    keyword,
    searchType,
    page,
    itemsPerPage
  ) {
    try {
      const params = new URLSearchParams({
        sort: sortType,
        filter: filter,
        keyword: keyword,
        searchType: searchType,
        page: page.toString(), // URLSearchParams는 문자열 값을 받으므로 숫자를 문자열로 변환
        size: itemsPerPage.toString(),
      });

      const response = await axiosJsonInstance.get(
        `forums?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      //TODO: error handling -> 에러 페이지 제작후 연결까지 구현
      // console.error(error);
      return null;
    }
  },
};

ArticleListService.fetchArticles.propTypes = {
  sortType: propTypes.string,
  filter: propTypes.string,
  keyword: propTypes.string,
  searchType: propTypes.string,
  page: propTypes.number,
  itemsPerPage: propTypes.number,
};

export default ArticleListService;
