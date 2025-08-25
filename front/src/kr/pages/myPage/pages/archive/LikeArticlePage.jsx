import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import useKoreanTime from "../../../../hooks/useKoreanTime";

import LikeArticleService from "../../services/likeArticleService";
import LikeArticleStore from "../../../../store/myPageStore/likeArticleStore";
import ListRender from "../../../../components/pagination/listRender";
import like from "../../../../assets/icon/heartFilled24.png";
import likeCancel from "../../../../assets/icon/heartEmpty24.png";

const LikeArticlePage = () => {
  const { convertToKoreanTime } = useKoreanTime();
  const likeArticles = LikeArticleStore((state) => state.likeArticles);
  const totalPages = LikeArticleStore((state) => state.totalPages);
  const currentPage = LikeArticleStore((state) => state.currentPage);

  const setLikeArticles = LikeArticleStore((state) => state.setLikeArticles);
  const setTotalPages = LikeArticleStore((state) => state.setTotalPages);
  const setCurrentPage = LikeArticleStore((state) => state.setCurrentPage);
  const setLoading = LikeArticleStore((state) => state.setLoading);
  const setError = LikeArticleStore((state) => state.setError);

  const [itemsPerPage, setItmesPerPage] = useState(15);
  const [likedItems, setLikedItems] = useState({});

  const { handleLikeToggle } = useOutletContext();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await LikeArticleService.fetchArticles(
          currentPage,
          itemsPerPage
        );
        if (data.content.length > 0) {
          setLikeArticles(data.content);
          setTotalPages(data.totalPages);
          setCurrentPage(data.pageable.pageNumber);
          setItmesPerPage(data.numberOfElements);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, itemsPerPage]);

  const handleLikeClick = async (item) => {
    await handleLikeToggle("article", item.articleId);
    setLikedItems((prev) => ({
      ...prev,
      [item.articleId]: !prev[item.articleId],
    }));
  };

  const renderArticle = (item) => (
    <div className="flex justify-between text-sm sm:text-base md:text-lg px-3">
      <div className="flex-1 min-w-0 mr-3 flex flex-col justify-between">
        <Link
          to={`/community/article/${item.articleId}`}
          className="font-semibold line-clamp-1 break-all break-words overflow-wrap text-[#7d7c77] hover:text-[#bc5b39] text-sm sm:text-base md:text-lg"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.title}
        </Link>
        <p
          className="text-xs sm:text-sm md:text-base line-clamp-1 break-all break-words overflow-wrap"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.content}
        </p>
      </div>
      <div className="flex space-x-4 sm:space-x-6 items-center">
        <p className="text-xs sm:text-sm md:text-base">
          {convertToKoreanTime(item.createAt)}
        </p>
        <p className="text-xs sm:text-sm md:text-base">{item.nickname}</p>
        <button onClick={() => handleLikeClick(item)}>
          <img
            src={likedItems[item.articleId] ? likeCancel : like}
            alt="좋아요 아이콘"
            className="w-6 h-6 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">관심 게시글</h1>
      </div>
      <div className="bg-white rounded-tl-xl rounded-tr-xl border-t border-l border-r border-[#E1E1DF] pt-4 pl-6"></div>
      <div className="p-4 sm:p-6 lg:p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
        <ListRender
          data={likeArticles}
          renderItem={renderArticle}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCategory="article"
        />
      </div>
    </div>
  );
};

export default LikeArticlePage;
