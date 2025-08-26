import PropTypes from "prop-types";
import MemoCard from "./MemoCard";

const MemoList = ({ memos, onEditMemo, onDeleteMemo, hasFetched }) => {
  if (hasFetched && !memos.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        아직 작성한 메모가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memos.map((memo) => (
        <MemoCard
          key={memo.memoId}
          memo={memo}
          onEditMemo={() => onEditMemo(memo.memoId, memo)}
          onDeleteMemo={onDeleteMemo}
        />
      ))}
    </div>
  );
};

MemoList.propTypes = {
  memos: PropTypes.array.isRequired,
  onEditMemo: PropTypes.func.isRequired,
  onDeleteMemo: PropTypes.func.isRequired,
  hasFetched: PropTypes.bool.isRequired,
};

export default MemoList;
