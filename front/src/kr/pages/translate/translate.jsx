import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchDocsList } from "./services/translateGetService";
import { likeDocs } from "./services/translatePostService";
import { clearDB } from "./services/indexedDbService.jsx";
import { motion } from "framer-motion";

import useModalStore from "../../store/translateStore/translateModalStore";
import useDocsStore from "../../store/translateStore/docsStore";
import chatStore from "../../store/chatStore";

const TransLatePage = () => {
  const [filteredDocsList, setFilteredDocsList] = useState([]);
  const userId = useRef(0);
  if (localStorage.getItem("token")) {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    userId.current = decodedToken.userId;
  }

  // 필터용 카테고리 배열
  const docsCategories = ["ALL", "FRONTEND", "BACKEND", "DEVOPS", "DBSQL"];
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const closeChat = chatStore((state) => state.closeChat);

  const {
    docsList,
    setDocsList,
    bestDocsList,
    setBestDocsList,
    setDocumentName,
  } = useDocsStore();

  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const filteredBestDocsList =
    windowWidth < 768
      ? bestDocsList.sort((a, b) => b.likeCount - a.likeCount).slice(0, 4)
      : windowWidth < 1024
      ? bestDocsList.sort((a, b) => b.likeCount - a.likeCount).slice(0, 3)
      : bestDocsList.sort((a, b) => b.likeCount - a.likeCount).slice(0, 4);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let tmpDocsList = await fetchDocsList();
      tmpDocsList = await tmpDocsList.sort((a, b) => b.viewCount - a.viewCount);

      setDocsList(tmpDocsList);
      setBestDocsList([...tmpDocsList]);
    };
    closeChat();
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "auto";

    const resetDB = async () => {
      if (!localStorage.getItem("hasClearedDB")) {
        await clearDB("docs");
        localStorage.setItem("hasClearedDB", "true");
      }
    };
    resetDB();
  }, []);

  const handleLike = async (docsId) => {
    await likeDocs(docsId);
    await handleFilter(selectedCategory);
  };

  const handleFilter = async (position) => {
    let tmpDocsList = await fetchDocsList();
    if (position !== "ALL") {
      tmpDocsList = tmpDocsList.filter((docs) => docs.position === position);
    }
    tmpDocsList.sort((a, b) => b.viewCount - a.viewCount);
    setDocsList(tmpDocsList);
  };

  // framer-motion 기본 애니메이션
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-gradient-to-b from-white to-[#FAF9F5] text-center">
      {/* Hero Section */}
      <motion.section
        className="py-16 px-4 bg-gradient-to-b from-white to-[#FAF9F5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#bc5b39] to-[#C96442] text-transparent bg-clip-text drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            공식문서 번역 라이브러리
          </motion.h1>
          <p className="text-sm md:text-lg text-[#7C543F] mt-2 mb-4 max-w-2xl mx-auto">
            다양한 번역 문서를 한 곳에서 찾아보세요.
          </p>
        </div>
      </motion.section>

      {/* 인기 번역 문서 (Best Docs) */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative bg-[#F7F3EC] p-4 rounded-xl shadow-xl">
          <h2 className="text-left text-xl font-semibold text-[#BC5B39] mb-6">
            인기 번역 문서
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
            {filteredBestDocsList.map((item, index) => (
              <motion.div
                key={item.docsId}
                className="relative w-full sm:w-44 h-48 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 border border-[#E8E5E1]"
                onClick={() => {
                  useModalStore.setState({
                    isEditorOpen: false,
                    isArchiveOpen: false,
                  });
                  navigate(`/translate/main/viewer/${item.docsId}`);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-[#D8B6A0] shadow-md rounded-r-lg"></div>
                <div className="flex flex-col items-center py-6 ml-6">
                  <img
                    src={item.documentLogo}
                    alt="문서 로고"
                    className="w-20 h-20 sm:w-16 sm:h-16 object-contain rounded-full border border-[#E8E5E1]"
                  />
                  <div className="w-24 sm:w-40 text-center text-[#BC5B39] text-xs md:text-base font-semibold p-3 sm:p-2 break-words">
                    {item.documentName}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="w-full h-4 bg-[#E3DAC9] shadow-md rounded-t-lg mt-4"></div>
        </div>
      </div>

      {/* 전체 문서 목록 */}
      <div className="max-w-6xl mx-auto px-4">
        {/* 필터 버튼 (카테고리) */}
        <div className="flex flex-wrap gap-2 justify-center my-8">
          {docsCategories.map((docsCategory, index) => (
            <button
              key={index}
              onClick={() => {
                handleFilter(docsCategory);
                setSelectedCategory(docsCategory);
              }}
              className={`cursor-pointer px-4 py-1 rounded-full transition-all duration-200 shadow-sm border border-gray-200 font-medium ${
                selectedCategory === docsCategory
                  ? "bg-[rgba(188,91,57,0.8)] text-white"
                  : "bg-white text-black"
              } text-xs md:text-sm`}
            >
              {docsCategory}
            </button>
          ))}
        </div>

        {/* 문서 카드 그리드 */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6 mt-4">
          {docsList.map((docs, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {localStorage.getItem("token") && (
                <button
                  onClick={() => handleLike(docs.docsId)}
                  className={`absolute right-2 top-2 p-2 rounded-full transition-all duration-300 cursor-pointer ${
                    docs.likeUserIds.includes(Number(userId.current))
                      ? "bg-[#BC5B39] text-white"
                      : "bg-gray-300"
                  }`}
                >
                  <svg
                    className="h-6 w-6"
                    fill={
                      docs.likeUserIds.includes(Number(userId.current))
                        ? "white"
                        : "currentColor"
                    }
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              )}
              <div className="p-4 flex flex-col items-center">
                <div className="rounded-lg flex items-center justify-center mb-3">
                  <img
                    src={docs.documentLogo}
                    alt="문서 아이콘"
                    className="w-16 h-16 sm:w-20 sm:h-20"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                  {docs.documentName}
                </h3>
                <button
                  onClick={() => {
                    useModalStore.setState({
                      isEditorOpen: false,
                      isArchiveOpen: false,
                    });
                    navigate(`/translate/main/viewer/${docs.docsId}`);
                    useDocsStore.setState({
                      documentName: docs.documentName,
                    });
                  }}
                  className="cursor-pointer mt-4 px-6 py-2 bg-[rgba(188,91,57,1)] text-white rounded-lg hover:bg-[rgba(188,91,57,0.8)] transition-colors duration-200 font-medium"
                >
                  {localStorage.getItem("token") ? "번역 하기" : "번역 보기"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 문서 신청 CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#BC5B39]">
            원하는 문서를 찾을 수 없나요?
          </h2>
          <p className="text-xs sm:text-md text-[#7C543F] mt-2">
            새로운 문서를 신청하면 검토 후 추가해드립니다.
          </p>
          <button
            onClick={() => navigate("/helpDesk/inquiryForm")}
            className="cursor-pointer mt-4 px-4 py-2 bg-[#BC5B39] text-white rounded-lg hover:bg-[rgba(188,91,57,0.8)] font-semibold text-xs sm:text-lg shadow-md transition-all duration-300"
          >
            문서 신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransLatePage;
