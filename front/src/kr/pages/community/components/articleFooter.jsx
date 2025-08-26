import { Link } from "react-router-dom";
import propTypes from "prop-types";

const ArticleFooter = ({ articleData }) => {
  return (
    <div className="inline-flex justify-between w-full">
      {/* 게시글 본문 푸터 */}
      <div className="bg-gray-50 p-4 rounded-lg w-full">
        <p className="font-medium mb-2">참조된 문서:</p>
        <Link
          to={`/translate/main/viewer/${articleData.docsId}`}
          className="hover:underline"
        >
          <p>{articleData.documentName}</p>
          <p className="text-sm text-[#7d7c77]">
            카테고리: {articleData.position}
          </p>
        </Link>
      </div>
    </div>
  );
};

ArticleFooter.propTypes = {
  articleData: propTypes.object,
};

export default ArticleFooter;
