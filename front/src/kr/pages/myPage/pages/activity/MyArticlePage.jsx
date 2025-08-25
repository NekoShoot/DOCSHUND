import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import useKoreanTime from "../../../../hooks/useKoreanTime";
import ListRender from "../../../../components/pagination/listRender";
import MyArticleStore from "../../../../store/myPageStore/myArticleStore";
import MyArticleService from "../../services/myArticleService";
import like from "../../../../assets/icon/heartFilled24.png";
import view from "../../../../assets/icon/viewCnt.png";
import comment from "../../../../assets/icon/commentCnt.png";

const MyArticlePage = () => {
  const token = localStorage.getItem("token");
  const { convertToKoreanTime } = useKoreanTime();

  const myArticles = MyArticleStore((state) => state.myArticles);
  const totalPages = MyArticleStore((state) => state.totalPages);
  const currentPage = MyArticleStore((state) => state.currentPage);

  const setMyArticles = MyArticleStore((state) => state.setMyArticles);
  const setTotalPages = MyArticleStore((state) => state.setTotalPages);
  const setCurrentPage = MyArticleStore((state) => state.setCurrentPage);
  const setLoading = MyArticleStore((state) => state.setLoading);
  const setError = MyArticleStore((state) => state.setError);

  const [itemsPerPage, setItmesPerPage] = useState(15);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const data = await MyArticleService.fetchArticles(
            userId,
            currentPage,
            itemsPerPage
          );
          if (!data.empty && data.content.length > 0) {
            setMyArticles(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(data.pageable.pageNumber);
            setItmesPerPage(data.size);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [token, currentPage, itemsPerPage]);

  const renderArticle = (item) => (
    <div className="flex justify-between text-sm sm:text-base md:text-lg xl:text-xl px-3">
      <div className="flex-1 min-w-0 mr-3 flex flex-col justify-between">
        <Link
          to={`/community/article/${item.articleId}`}
          className="font-semibold line-clamp-1 break-all break-words overflow-wrap text-[#7d7c77] hover:text-[#bc5b39] text-sm sm:text-base md:text-lg"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.title}
        </Link>
        <p
          className="text-xs sm:text-sm md:text-base xl:text-lg line-clamp-1 break-all break-words overflow-wrap"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.content}
        </p>
        <p className="text-xs sm:text-sm md:text-base xl:text-lg">
          {convertToKoreanTime(item.createdAt)}
        </p>
      </div>
      <div className="flex space-x-6 items-end">
        <p className="self-end text-xs sm:text-sm md:text-base xl:text-lg">
          {item.nickname}
        </p>
        <div className="flex flex-col justify-between">
          <div className="flex items-center">
            <img
              className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-7 xl:h-7"
              src={like}
              alt="좋아요수 아이콘"
            />
            <p className="w-8 text-right text-xs sm:text-sm md:text-base xl:text-lg">
              {item.likeCount}
            </p>
          </div>
          <div className="flex items-center">
            <img
              className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-7 xl:h-7"
              src={view}
              alt="조회수 아이콘"
            />
            <p className="w-8 text-right text-xs sm:text-sm md:text-base xl:text-lg">
              {item.viewCount}
            </p>
          </div>
          <div className="flex items-center">
            <img
              className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-7 xl:h-7"
              src={comment}
              alt="댓글수 아이콘"
            />
            <p className="w-8 text-right text-xs sm:text-sm md:text-base xl:text-lg">
              {item.commentCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">나의 게시글</h1>
      </div>
      <div className="bg-white rounded-tl-xl rounded-tr-xl border-t border-l border-r border-[#E1E1DF] pt-4 pl-6"></div>
      <div className="p-4 sm:p-6 lg:p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
        <ListRender
          data={myArticles}
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

export default MyArticlePage;
