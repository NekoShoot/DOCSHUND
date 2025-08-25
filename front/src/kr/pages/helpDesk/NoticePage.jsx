import { useEffect } from "react";
import { Link } from "react-router-dom";
import NoticeService from "../../services/helpDeskServices/noticeService";
import useNoticeStore from "../../store/helpDeskStore/noticeStore";
import ListRender from "../../components/pagination/listRender";
import useKoreanTime from "../../hooks/useKoreanTime";

const NoticePage = () => {
  const {
    notices,
    setNotices,
    setLoading,
    setError,
    totalPages,
    currentPage,
    setTotalPages,
    setCurrentPage,
  } = useNoticeStore();
  const { convertToKoreanTime } = useKoreanTime();

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const data = await NoticeService.fetchNotices(currentPage, 15);
        setNotices(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [currentPage, setError, setLoading, setNotices, setTotalPages]);

  const renderNotice = (item) => (
    <div className="flex justify-between items-center text-sm sm:text-lg px-2 sm:px-3 py-1">
      <div className="flex-1 min-w-0 mr-3 font-semibold line-clamp-1 break-all break-words overflow-wrap">
        <Link
          to={`/helpDesk/notices/${item.noticeId}`}
          className="text-[#7d7c77] hover:text-[#bc5b39]"
        >
          {item.title}
        </Link>
      </div>
      <span className="whitespace-nowrap">
        {convertToKoreanTime(item.createdAt) || "표시할 수 없는 날짜입니다."}
      </span>
    </div>
  );

  return (
    <div className="p-4 sm:p-10 bg-white rounded-bl-xl rounded-br-xl border border-[#E1E1DF] text-[#7D7C77] mb-5">
      <div className="text-xs sm:text-base md:text-xl font-semibold text-[#5a5a5a] rounded-2xl border border-[#eeeeee] p-3 sm:p-5 mb-4 shadow-md">
        📢 Docshund의 새로운 소식들! 신규 콘텐츠, 이벤트, 업데이트 등 다양한
        소식을 만나보세요
      </div>
      <ListRender
        data={notices}
        renderItem={renderNotice}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemCategory="notice"
      />
    </div>
  );
};

export default NoticePage;
