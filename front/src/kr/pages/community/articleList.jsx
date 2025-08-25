import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "react-toastify";
import _ from "lodash";

import useKoreanTime from "../../hooks/useKoreanTime.jsx";
import articleListService from "./services/articleListService";
import ListRender from "../../components/pagination/listRender.jsx";
import communityArticleStore from "../../store/communityStore/communityArticleStore.jsx";
import CommunityHeader from "./components/communityHeader.jsx";

import like from "../../assets/icon/heartFilled24.png";
import view from "../../assets/icon/viewCnt.png";
import comment from "../../assets/icon/commentCnt.png";

const ArticleList = () => {
  const navigate = useNavigate();
  const { convertToKoreanTime } = useKoreanTime();
  const articles = communityArticleStore((state) => state.articles);
  const totalPages = communityArticleStore((state) => state.totalPages);
  const currentPage = communityArticleStore((state) => state.currentPage);
  const category = communityArticleStore((state) => state.category);

  const setArticles = communityArticleStore((state) => state.setArticles);
  const setTotalPages = communityArticleStore((state) => state.setTotalPages);
  const setCurrentPage = communityArticleStore((state) => state.setCurrentPage);
  const setLoading = communityArticleStore((state) => state.setLoading);
  const setError = communityArticleStore((state) => state.setError);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortType, setSortBy] = useState("latest");
  const [keyword, setKeyword] = useState("");
  const [tmpKeyword, setTmpKeyword] = useState("");

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "likes", label: "좋아요순" },
    { value: "views", label: "조회수순" },
  ];

  const handleSort = (value) => {
    setSortBy(value);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await articleListService.fetchArticles(
          sortType,
          category,
          keyword,
          "title",
          currentPage,
          itemsPerPage
        );
        setArticles(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.pageable.pageNumber);
        setItemsPerPage(data.size);
      } catch (error) {
        setError(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    fetchArticles();
  }, [sortType, keyword, currentPage, category, itemsPerPage]);

  const updateContent = (value) => {
    if (value.length > 30) {
      window.alert("검색어는 30자 이내로 입력해주세요.");
      return;
    }
    setTmpKeyword(value);
  };

  const handleInputChange = (e) => {
    updateContent(e.target.value);
  };

  const renderItem = (item) => (
    <div
      className="flex justify-between text-base md:text-lg px-5 py-3 hover:bg-[#faf0ed] cursor-pointer"
      onClick={() => {
        navigate(`/community/article/${item.articleId}`);
      }}
    >
      <div className="flex-1 min-w-0 mr-3 flex flex-col justify-between">
        <div
          to={`/community/article/${item.articleId}`}
          className="font-semibold line-clamp-1 break-all break-words overflow-wrap text-[#7d7c77] text-base md:text-lg"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.title}
        </div>
        <p
          className="line-clamp-1 break-all break-words overflow-wrap text-sm md:text-base"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.content}
        </p>
        <p className="text-sm md:text-base">
          {convertToKoreanTime(item.createdAt)}
        </p>
      </div>
      <div className="flex space-x-6 items-bottom">
        <p className="self-end hidden md:block text-sm md:text-base">
          {item.nickname}
        </p>
        <div className="flex flex-col justify-between">
          <div className="flex items-center">
            <img className="mr-2" src={like} alt="좋아요수 아이콘" />
            <p className="w-8 text-right text-sm md:text-base">
              {item.likeCount}
            </p>
          </div>
          <div className="flex items-center">
            <img className="mr-2" src={view} alt="조회수 아이콘" />
            <p className="w-8 text-right text-sm md:text-base">
              {item.viewCount}
            </p>
          </div>
          <div className="flex items-center">
            <img className="mr-2" src={comment} alt="댓글수 아이콘" />
            <p className="w-8 text-right text-sm md:text-base">
              {item.commentCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <main className="flex-1">
        <CommunityHeader />
        <div>
          {/* 검색 및 정렬 영역 */}
          <div className="py-4 px-5 bg-white rounded-tl-xl rounded-tr-xl border-t border-l border-r border-[#E1E1DF]">
            <div className="flex flex-row items-center justify-between p-2">
              <div className="relative w-full mr-2 mb-0">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="w-full border p-2 pl-5 rounded-full h-8 focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-sm md:text-base"
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputChange(e);
                      setKeyword(tmpKeyword);
                    }
                  }}
                  value={tmpKeyword}
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer"
                  onClick={() => setKeyword(tmpKeyword)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path
                      fill="none"
                      stroke="#bc5b39"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.5 15.5L20 20M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                    />
                  </svg>
                </div>
              </div>
              <select
                value={sortType}
                onChange={(e) => handleSort(e.target.value)}
                className="px-2 h-8 rounded-full border bg-white focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
                style={{ height: "30px" }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* 글 목록 영역 */}
          <div className="bg-white rounded-bl-xl rounded-br-xl border border-[#E1E1DF] p-5">
            <ListRender
              data={articles}
              renderItem={renderItem}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemCategory="article"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleList;
