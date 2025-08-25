import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useNoticeStore from "../../store/helpDeskStore/noticeStore";
import NoticeService from "../../services/helpDeskServices/noticeService";
import MDEditor from "@uiw/react-md-editor";
import useKoreanTime from "../../hooks/useKoreanTime";

const NoticeDetail = () => {
  const { noticeId } = useParams();
  const { noticeDetail, setNoticeDetail, setLoading, setError } =
    useNoticeStore();
  const { convertToKoreanTime } = useKoreanTime();

  useEffect(() => {
    const fetchNoticeDetail = async (noticeId) => {
      setLoading(true);
      try {
        const data = await NoticeService.fetchNoticeDetail(noticeId);
        setNoticeDetail(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    setNoticeDetail({});
    fetchNoticeDetail(noticeId);
  }, [noticeId, setError, setLoading, setNoticeDetail]);

  return (
    <div className="w-full px-4 md:px-12 py-5 max-w-screen-xl mx-auto">
      {/* 헤더 */}
      <div className="flex flex-row justify-between items-center mt-4 mb-5">
        <h1 className="font-bold text-2xl">공지사항</h1>
        <Link
          to="/helpDesk/notices"
          className="s py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm hover:bg-[#C96442]"
        >
          목록으로
        </Link>
      </div>
      {/* 내용 영역 */}
      <div className="bg-white rounded-xl border border-[#E1E1DF]">
        <div className="p-4 sm:p-6">
          {/* 제목 및 날짜 */}
          <div className="border-b border-[#E1E1DF] pb-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              {noticeDetail.title}
            </h1>
            <div className="flex justify-between items-center text-sm sm:text-base text-[#7d7c77]">
              <span>
                {convertToKoreanTime(noticeDetail.createdAt) ||
                  "표시할 수 없는 날짜입니다."}
              </span>
            </div>
          </div>
          {/* 본문 */}
          <div className="pb-4 mb-4">
            <div className="min-h-[150px] sm:min-h-[200px] whitespace-pre-wrap mb-6">
              {noticeDetail.content ? (
                <MDEditor.Markdown
                  source={noticeDetail.content}
                  style={{ backgroundColor: "white", color: "black" }}
                />
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
