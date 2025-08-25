import { useNavigate } from "react-router-dom";
import modalStore from "../../../store/myPageStore/myPageModalStore";
import inquiryStore from "../../../store/myPageStore/inquiryStore";
import InquiryModal from "../components/InquiryModal";
import ListRender from "../../../components/pagination/listRender";
import InquiryService from "../services/inquiryService";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ChevronUp, ChevronDown } from "lucide-react";
import useKoreanTime from "../../../hooks/useKoreanTime";

const InquiryPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const inquiries = inquiryStore((state) => state.inquiries);
  const setInquiries = inquiryStore((state) => state.setInquiries);
  const totalPages = inquiryStore((state) => state.totalPages);
  const setTotalPages = inquiryStore((state) => state.setTotalPages);
  const currentPage = inquiryStore((state) => state.currentPage);
  const setCurrentPage = inquiryStore((state) => state.setCurrentPage);
  const setLoading = inquiryStore((state) => state.setLoading);
  const setError = inquiryStore((state) => state.setError);

  const { setOpenId, openId, closeModal } = modalStore();

  const [itemsPerPage, setItmesPerPage] = useState(15);
  const { convertToKoreanTime } = useKoreanTime();

  useEffect(() => {
    setLoading(true);
    const fetchInquiries = async () => {
      try {
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;

          const data = await InquiryService.fetchInquiries(
            currentPage,
            itemsPerPage,
            userId
          );
          if (data) {
            const sortedInquiries = data.content.sort(
              (a, b) =>
                new Date(b.inquiryCreatedAt) - new Date(a.inquiryCreatedAt)
            );
            setInquiries(sortedInquiries);
            setCurrentPage(data.pageable.pageNumber);
            setTotalPages(data.totalPages);
            setItmesPerPage(data.size);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [currentPage, itemsPerPage, token]);

  useEffect(() => {
    return () => {
      setOpenId(null);
    };
  }, [setOpenId]);

  const renderInquiry = (item) => {
    return (
      <div key={item.inquiryId} className="flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between px-3">
          <div
            className={`flex-1 min-w-0 break-all break-words overflow-wrap mr-3 ${
              openId === item.inquiryId ? "" : "line-clamp-1"
            }`}
          >
            <h3
              onClick={() => {
                setOpenId(item.inquiryId === openId ? null : item.inquiryId);
              }}
              className="line-clamp-1 text-sm sm:text-base md:text-lg font-semibold text-[#7d7c77] hover:text-[#bc5b39] cursor-pointer"
              style={{ overflowWrap: "anywhere" }}
            >
              {item.inquiryTitle}
            </h3>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6 mt-2 sm:mt-0">
            <p className="text-xs sm:text-sm md:text-base">
              {convertToKoreanTime(item.inquiryCreatedAt) ||
                "표시할 수 없는 날짜입니다."}
            </p>
            <p
              className={`text-xs sm:text-sm font-semibold 
              ${item.answered ? "text-green-500" : "text-red-500 "} `}
            >
              {item.answered ? "답변 완료" : "답변 대기"}
            </p>
            <button
              onClick={() => {
                setOpenId(item.inquiryId === openId ? null : item.inquiryId);
              }}
              className="cursor-pointer"
            >
              {openId === item.inquiryId ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>
        </div>
        {item.inquiryId === openId && (
          <InquiryModal item={item} closeModal={closeModal} />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center sm:items-center mt-5 mb-5">
        <h1 className="font-bold text-2xl">나의 문의</h1>
        <button
          onClick={() => navigate("/helpDesk/inquiryForm")}
          className="border-box bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 text-[#ffffff] hover:bg-[#C96442] cursor-pointer"
        >
          + 문의작성
        </button>
      </div>

      <div className="bg-white rounded-tl-xl rounded-tr-xl border-t border-l border-r border-[#E1E1DF] pt-4 pl-6"></div>
      <div className="bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] p-4 sm:p-10 text-[#7D7C77]">
        <ListRender
          data={inquiries}
          renderItem={renderInquiry}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCategory="inquiry"
        />
      </div>
    </div>
  );
};

export default InquiryPage;
