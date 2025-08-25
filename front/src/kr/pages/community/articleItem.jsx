import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import _ from "lodash";

import communityArticleStore from "../../store/communityStore/communityArticleStore";
import useReportStore from "../../store/reportStore";
import ArticleItemService from "./services/articleItemService";

import ReportModal from "../../pages/report";
import CommunityHeader from "./components/communityHeader";
import ArticleFooter from "./components/articleFooter";
import SkeletonArticleItem from "./components/skeletonArticleItem";
import ReplyList from "./replyList";
import RectBtn from "../../components/button/rectBtn";
import ToastViewer from "../translate/components/toastViewer";
import useKoreanTime from "../../hooks/useKoreanTime";

const ArticleItem = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { convertToKoreanTime } = useKoreanTime();

  const isLikedArticleIds = communityArticleStore(
    (state) => state.isLikedArticleIds
  );
  const setIsLikedArticleIds = communityArticleStore(
    (state) => state.setIsLikedArticleIds
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const token = localStorage.getItem("token");

  // store에서 데이터를 가져오기 위해 정의
  const articleItems = communityArticleStore((state) => state.articleItems);
  const likeCount = communityArticleStore((state) => state.likeCount);

  // store의 메소드를 가져오기 위해 정의
  const setArticleId = communityArticleStore((state) => state.setArticleId);
  const setLikeCount = communityArticleStore((state) => state.setLikeCount);
  const setLoading = communityArticleStore((state) => state.setLoading);
  const setError = communityArticleStore((state) => state.setError);
  const clearArticleItems = communityArticleStore(
    (state) => state.clearArticleItems
  );

  // Items, likeCount 등 설정
  const setArticleData = communityArticleStore((state) => state.setArticleData);
  const setCommentCount = communityArticleStore(
    (state) => state.setCommentCount
  );
  const toggleReport = useReportStore((state) => state.toggleReport);
  const openReport = useReportStore((state) => state.openReport);
  const { closeReport } = useReportStore();

  const handleReport = (data) => {
    useReportStore.setState({
      originContent: data.content,
      reportedUser: data.userId,
      commentId: null,
      articleId: data.articleId,
      transId: null,
      chatId: null,
    });

    openReport();
    toggleReport();
  };

  const handleLikeClick = _.debounce(async () => {
    // 좋아요 api 날리기
    const response = await ArticleItemService.likeArticleItem(articleId);
    const status = response.status;
    // console.log(response);

    // status가 204이면 좋아요 성공
    if (status === 204) {
      // 좋아요 취소
      if (isLikedArticleIds.includes(articleId)) {
        setIsLikedArticleIds(
          isLikedArticleIds.filter((id) => id !== articleId)
        );
      } else {
        setIsLikedArticleIds([...isLikedArticleIds, articleId]); // 좋아요한 게시글 기록
      }

      // setLikeCount(
      //   isLikedArticleIds.includes(articleId) ? likeCount - 1 : likeCount + 1
      // );

      const resData = await ArticleItemService.fetchArticleItem(articleId);

      if (resData) {
        setLikeCount(resData.likeCount);
        toast.success("좋아요를 눌렀습니다.", {
          toastId: "like",
        });
      }
    } else {
      toast.alert("좋아요에 실패했습니다.", {
        toastId: "like",
      });
    }
  }, 300); // 300ms 딜레이 설정

  useEffect(() => {
    const fetchArticleItems = async (articleId) => {
      setLoading(true);
      clearArticleItems();

      try {
        if (articleId) {
          const data = await ArticleItemService.fetchArticleItem(articleId);
          if (data) {
            setArticleId(articleId);
            setArticleData(data);
            setCommentCount(data.commentCount);
            setIsInitialLoad(false);
          } else {
            toast.error("해당 게시글을 찾을 수 없습니다.", {
              toastId: "notFound",
            });
            navigate("/community/list");
          }
        } else {
          setTimeout(() => {
            setIsInitialLoad(false);
          }, 500);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleItems(articleId);

    return () => {
      clearArticleItems();
    };
  }, [articleId]);

  useEffect(() => {
    closeReport();
  }, []);

  const handleDeleteClick = _.debounce(async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    const response = await ArticleItemService.deleteArticleItem(articleId);

    if (response.status === 204) {
      toast.info("게시글이 삭제되었습니다.", {
        toastId: "delete",
      });
      navigate("/community");
    }
  }, 100);

  if (isInitialLoad) {
    return (
      <div className="flex justify-center w-full">
        <main className="flex-1 p-8 max-w-[1280px]">
          <CommunityHeader />
          <SkeletonArticleItem />
        </main>
      </div>
    );
  }

  const renderActionButtons = () => {
    try {
      if (!token || !articleItems) return null;
      const decodedToken = jwtDecode(token);
      const isAuthor = decodedToken?.userId === articleItems.userId;

      if (!isAuthor) return null;

      return (
        <div className="flex gap-2 text-xs md:text-sm text-gray-500 flex-shrink-0">
          <button
            className="text-[#7d7c77] underline hover:text-gray-700 cursor-pointer"
            onClick={() => navigate(`/community/modify/${articleId}`)}
          >
            수정
          </button>
          <span>|</span>
          <button
            className="text-[#7d7c77] underline hover:text-gray-700 cursor-pointer"
            onClick={handleDeleteClick}
          >
            삭제
          </button>
        </div>
      );
    } catch (error) {
      // console.error("권한 확인 중 에러:", error);
      return null;
    }
  };

  return (
    <div className="flex justify-center w-full">
      <main className="flex-1 w-[50vw] max-w-[90vw]">
        {/* Header */}
        <CommunityHeader />
        {/* 게시글 전체 박스 영역 */}
        <div className="bg-white rounded-xl border border-[#E1E1DF]">
          <div className="p-4 md:p-6">
            {/* 게시글 헤더 */}
            <div className="border-b border-[#E1E1DF] pb-4 mb-4">
              <div className="flex w-full justify-between items-center mb-4">
                <h1 className="text-xl md:text-2xl font-bold flex-1 mr-4 break-all break-words overflow-wrap">
                  {articleItems.title}
                </h1>
                <div className="flex gap-2">
                  {renderActionButtons()}
                  {token &&
                    jwtDecode(token)?.userId !== articleItems.userId && (
                      <div className="flex gap-2 text-xs md:text-sm text-gray-500">
                        <button
                          className="text-[#7d7c77] underline hover:text-gray-700 cursor-pointer"
                          onClick={() => handleReport(articleItems)}
                        >
                          신고
                        </button>
                      </div>
                    )}
                </div>
              </div>
              <div className="flex flex-row justify-between items-center text-[#7d7c77] text-xs md:text-sm">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/userPage/${articleItems.userId}`)}
                >
                  <img
                    src={articleItems.profileImage}
                    alt={`${articleItems.nickname}의 프로필`}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
                  />
                  <span className="hidden md:block font-medium">
                    {articleItems.nickname}
                  </span>
                  <span>
                    {convertToKoreanTime(articleItems.createdAt) ||
                      "표시할 수 없는 날짜입니다."}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <div className="flex items-center gap-1">
                    <span>조회</span>
                    <span>{articleItems.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>좋아요</span>
                    <span>{likeCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 게시글 본문 */}
            <div className="border-b border-[#E1E1DF] pb-4 mb-4">
              <div className="min-h-[200px] w-full whitespace-pre-wrap mb-6 text-sm md:text-base break-all break-words overflow-wrap">
                <ToastViewer content={articleItems.content} />
              </div>
              <div className="flex justify-center items-center gap-4">
                {token && (
                  <RectBtn
                    onClick={handleLikeClick}
                    text={
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <ThumbsUp className="w-4 h-4" />
                        {likeCount}
                      </div>
                    }
                    className="px-4 py-2 text-xs md:text-base"
                  />
                )}
              </div>
            </div>

            {/* 게시글 푸터 */}
            <ArticleFooter articleData={articleItems} />
          </div>
        </div>
        {/* 댓글 리스트 */}
        <ReplyList replyCount={articleItems.commentCount} />
      </main>
      <ReportModal />
    </div>
  );
};

export default ArticleItem;
