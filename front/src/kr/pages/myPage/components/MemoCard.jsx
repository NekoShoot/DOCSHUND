import PropTypes from "prop-types";
import useKoreanTime from "../../../hooks/useKoreanTime";

const MemoCard = ({ memo, onEditMemo }) => {
  const { convertToKoreanTime } = useKoreanTime();

  return (
    <div className="bg-white rounded-xl p-4 border border-[#E1E1DF]">
      <h2 className="text-lg line-clamp-1 break-all break-words overflow-wrap font-bold mb-2">
        {memo.title}
      </h2>
      <p className="text-sm h-20 line-clamp-4 text-gray-600 mb-4 break-all break-words overflow-wrap overflow-hidden text-ellipsis">
        {memo.content}
      </p>
      <div className="flex text-sm justify-between items-center text-gray-400">
        <span>
          {convertToKoreanTime(memo.createdAt) || "표시할 수 없는 날짜입니다."}
        </span>
        <button
          onClick={() => onEditMemo(memo.memoId, memo)}
          className="bg-[#bc5b39] rounded-xl px-4 md:px-2 h-10 text-white text-sm hover:bg-[#C96442] transition cursor-pointer"
        >
          메모 보기
        </button>
      </div>
    </div>
  );
};

MemoCard.propTypes = {
  memo: PropTypes.shape({
    memoId: PropTypes.number.isRequired, // 추가된 부분
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onEditMemo: PropTypes.func.isRequired,
};

export default MemoCard;
