import { axiosJsonInstance } from "../../../utils/axiosInstance";
import propTypes from "prop-types";

const LikeDocsService = {
  // 관심 문서 가져오기
  async fetchDocs(userId) {
    try {
      // 좋아요한 게시글을 가져오는 api 호출
      const response = await axiosJsonInstance.get(
        `docs/likes?userId=${userId}`
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

LikeDocsService.fetchDocs.propTypes = {
  userId: propTypes.number.isRequired,
};

export default LikeDocsService;
