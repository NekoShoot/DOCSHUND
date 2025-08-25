import propTypes from "prop-types";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";

const ReplyHeader = () => {
  const commentCount = communityArticleStore((state) => state.commentCount);

  // NOTE: 댓글 정렬 방식을 변경하기 위한 store의 메소드
  const setReplySortType = communityArticleStore(
    (state) => state.setReplySortType
  );

  // 등록순 정렬
  const handleSortByRegist = () => {
    // NOTE: default가 등록순이므로 다시 등록순으로 정렬
    setReplySortType("regist");
  };

  const handleSortByLatest = () => {
    // NOTE: map으로 거꾸로 뒤집으면 최신순
    setReplySortType("latest");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-0 inline-flex items-center gap-3">
        <span className="inline-flex">
          <svg
            className="text-[#C65D21]"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M4 2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7l-3 4-3-4H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          </svg>
        </span>
        <span className="inline-flex">{commentCount}개의 댓글이 있습니다.</span>
      </h2>
      <div className="flex gap-2 text-gray-600 text-sm md:text-base">
        <button
          className="hover:text-[#C65D21] cursor-pointer"
          onClick={handleSortByRegist}
        >
          등록순
        </button>
        <span>|</span>
        <button
          className="hover:text-[#C65D21] cursor-pointer"
          onClick={handleSortByLatest}
        >
          최신순
        </button>
      </div>
    </div>
  );
};

ReplyHeader.propTypes = {
  replyCount: propTypes.number,
};

export default ReplyHeader;
