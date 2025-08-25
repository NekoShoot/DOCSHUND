import { useState, useEffect, useRef } from "react";
import { fetchInquiryList, fetchUserList } from "./services/adminGetService";

import { respondInquiry } from "./services/adminPostService";

import { Download } from "lucide-react";
import useUserManagerStore from "../../store/adminStore/userManagerStore";
import ToastViewer from "../../pages/translate/components/toastViewer";
import { toast } from "react-toastify";
import LodingImage from "../../assets/loading.gif";
import _ from "lodash";

const ManageInquiry = () => {
  const inquiryListData = useRef([]);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [inquiryStates, setInquiryStates] = useState({});
  const [userList, setUserList] = useState([]);
  const [inquiryList, setInquiryList] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const { currentUserList, addUserList, removeUserList } =
    useUserManagerStore();

  const handleFilter = async (category) => {
    if (category === "ALL") {
      setInquiryList(inquiryListData.current);
    } else if (category === "MEMBER") {
      const tmpInquiryList = inquiryListData.current.filter(
        (inquiry) => inquiry.inquiryCategory === "MEMBER"
      );
      setInquiryList(tmpInquiryList);
    } else if (category === "DOCUMENT_REQUEST") {
      const tmpInquiryList = inquiryListData.current.filter(
        (inquiry) => inquiry.inquiryCategory === "DOCUMENT_REQUEST"
      );
      setInquiryList(tmpInquiryList);
    } else if (category === "REPORT") {
      const tmpInquiryList = inquiryListData.current.filter(
        (inquiry) => inquiry.inquiryCategory === "REPORT"
      );
      setInquiryList(tmpInquiryList);
    } else if (category === "ANSWERED") {
      const tmpInquiryList = inquiryListData.current.filter(
        (inquiry) => inquiry.answered === true
      );
      setInquiryList(tmpInquiryList);
    } else if (category === "NOTANSWERED") {
      const tmpInquiryList = inquiryListData.current.filter(
        (inquiry) => inquiry.answered === false
      );
      setInquiryList(tmpInquiryList);
    }
  };

  const processUserList = (userListContent) => {
    userListContent.forEach((user) => {
      currentUserList[user.userId] = user.nickname;
    });
  };

  const toggleInquiryContent = (inquiryId) => {
    setInquiryStates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        if (key !== inquiryId) {
          acc[key] = false;
        }
        return acc;
      }, {}),
      [inquiryId]: !prev[inquiryId],
    }));
  };

  const handleRespond = _.debounce(async (inquiryId) => {
    setLoading(true);
    const data = await respondInquiry(inquiryId, answer);

    if (data === 200) {
      setLoading(false);
      toast.success("작성 완료", {
        toastId: "respond",
      });
      const data = await fetchInquiryList();
      const processedData = await data.sort(
        (a, b) => new Date(b.inquiryCreatedAt) - new Date(a.inquiryCreatedAt)
      );
      inquiryListData.current = processedData;
      await handleFilter(activeFilter);
    } else {
      setLoading(false);
      toast.error("작성 실패", {
        toastId: "respond",
      });
    }
  }, 500); // 500ms delay

  const handleSearch = async (text) => {
    if (!text) {
      const data = await fetchInquiryList();
      setInquiryList(data);
      return;
    } else {
      const data = await fetchInquiryList();
      const filteredList = data.filter(
        (item) =>
          item.inquiryTitle.includes(text.toLowerCase()) ||
          item.email.includes(text.toLowerCase())
      );
      filteredList.sort(
        (a, b) => new Date(b.inquiryCreatedAt) - new Date(a.inquiryCreatedAt)
      );
      setInquiryList(filteredList);
    }
  };

  const handleUTC = (time) => {
    const date = new Date(time);
    const kor = date.getHours() + 9;
    date.setHours(kor);
    return date;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchUserList();
        data.sort((a, b) => b.reportCount - a.reportCount);
        setUserList(data);
        processUserList(data);
      } catch (error) {
        // console.error("Error fetching users:", error);
      }
    };

    const fetchInquiryData = async () => {
      try {
        const data = await fetchInquiryList();
        const processedData = await data.sort(
          (a, b) => new Date(b.inquiryCreatedAt) - new Date(a.inquiryCreatedAt)
        );
        await handleFilter(activeFilter);

        setInquiryList(processedData);
        inquiryListData.current = processedData;
      } catch (error) {
        // console.error("Error fetching inquiry:", error);
      }
    };

    fetchUsers();
    fetchInquiryData();
  }, []);

  const checkMaxLength = (e) => {
    if (e.target.value.length === 2000) {
      toast.warn("답변 글자 수 2000자를 초과했습니다.", {
        toastId: "answer-max-length",
      });
    }
  };

  const filterButtons = [
    { label: "전체", value: "ALL" },
    { label: "회원 관련", value: "MEMBER" },
    { label: "문서 요청 관련", value: "DOCUMENT_REQUEST" },
    { label: "신고 관련", value: "REPORT" },
    { label: "답변 완료", value: "ANSWERED" },
    { label: "답변 대기", value: "NOTANSWERED" },
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">문의 관리</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="이메일로 검색"
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#bc5b39] focus:ring-1 focus:ring-[#bc5b39] transition-colors duration-200"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-start space-x-2 mb-4">
        {filterButtons.map((button) => (
          <button
            key={button.value}
            onClick={() => {
              handleFilter(button.value);
              setActiveFilter(button.value);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer duration-200 ${
              activeFilter === button.value
                ? "bg-[#bc5b39] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  제목
                </th>
                <th className="flex gap-1 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div>작성자</div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  작성일자
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  파일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inquiryList.map((inquiry) => (
                <>
                  <tr
                    key={inquiry.inquiryId}
                    onClick={(e) => {
                      e.stopPropagation();

                      toggleInquiryContent(inquiry.inquiryId);
                    }}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 overflow-hidden text-ellipsis max-w-[300px]">
                      {inquiry.inquiryTitle}
                    </td>
                    <td className="flex gap-1 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {handleUTC(inquiry.inquiryCreatedAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap w-28 flex items-center gap-2">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          inquiry.answered
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inquiry.answered ? "답변 완료" : "답변 대기"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {inquiry.inquiryImageUrl && (
                        <button className="text-[#bc5b39] hover:text-[#a34b2b] transition-colors duration-150 cursor-pointer">
                          <a
                            onClick={(e) => e.stopPropagation()}
                            href={inquiry.inquiryImageUrl}
                            download="문의 이미지"
                            target="_blank"
                          >
                            <Download />
                          </a>
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="7" className="p-0">
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          inquiryStates[inquiry.inquiryId]
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="border-t border-slate-200 p-4 text-slate-700 leading-relaxed max-h-[45vh] overflow-y-scroll">
                          <div className="mb-4 max-w-[55vw]">
                            <div className="font-medium text-slate-900 mb-2">
                              문의 내용
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 max-w-[60vw] overflow-hidden text-ellipsis">
                              <ToastViewer content={inquiry.inquiryContent} />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 mb-2">
                              답변 작성
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              {inquiry.answerCreatedAt ? (
                                <ToastViewer content={inquiry.answerContent} />
                              ) : (
                                <textarea
                                  className="w-full p-2 text-ellipsis break-words break-all resize-none whitespace-pre-wrap"
                                  rows={5}
                                  onChange={(e) => {
                                    setAnswer(e.target.value);
                                    checkMaxLength(e);
                                  }}
                                  maxLength={2000}
                                  placeholder="답변을 입력해주세요."
                                  name=""
                                  id=""
                                />
                              )}
                            </div>

                            {!inquiry.answerCreatedAt && (
                              <button
                                onClick={() => {
                                  handleRespond(inquiry.inquiryId, answer);
                                }}
                                className="cursor-pointer mt-2 text-white bg-[#BC5B39] hover:bg-[#C96442]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2"
                              >
                                작성 완료
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-opacity-50 flex flex-col justify-center items-center z-50 backdrop-brightness-80">
          <img src={LodingImage} alt="로딩중" />
        </div>
      )}
    </div>
  );
};

export default ManageInquiry;
