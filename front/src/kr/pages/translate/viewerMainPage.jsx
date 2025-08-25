import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import ChatBotBtn from "../chatBot/chatBotBtn.jsx";
import Information from "./page/information.jsx";
import { MessageCircle } from "lucide-react";
import { contextMenu } from "react-contexify";
import { toast } from "react-toastify";

// 아이콘
import Korean from "../../assets/icon/korean.png";
import English from "../../assets/icon/english.png";
import { ArrowLeftToLine } from "lucide-react";
import { Menu } from "lucide-react";

// 상태
import useModalStore from "../../store/translateStore/translateModalStore.jsx";
import useDocsStore from "../../store/translateStore/docsStore.jsx";
import useReportStore from "../../store/reportStore.jsx";
import useDbStore from "../../store/translateStore/dbStore.jsx";
import useSearchStore from "../../store/translateStore/searchStore.jsx";

// 채팅
import Chat from "../chat/chat.jsx";
import ChatStore from "../../store/chatStore.jsx";
import ChatBotStore from "../../store/chatBotStore.jsx";

// 서비스
import { fetchDocsList } from "./services/translateGetService.jsx";

const ViewerMainPage = () => {
  const targetPartId = useRef(null);
  const { isChatVisible, toggleChat } = ChatStore();
  const navigate = useNavigate();
  const { docsId } = useParams();
  const location = useLocation().pathname;

  const { isArchiveOpen, isEditorOpen, openNav } = useModalStore();
  const { isReportOpen, closeReport } = useReportStore();
  const { setDocsList, setBestDocsList, documentName, clearSearchResults } =
    useDocsStore();
  const { dbInitialized, activateDbInitialized, deactivateDbInitialized } =
    useDbStore();
  const {
    virtuosoRef,
    docDataLength,
    highlightIndex,
    setHighlightIndex,
    clearHighlightIndex,
  } = useSearchStore();

  const CheckNumber = (e) => {
    if (e.target.value > docDataLength.current) {
      e.target.value = docDataLength.current;
    } else if (e.target.value < 1 && e.target.value !== "") {
      toast.warn("최소 값은 1입니다.", {
        toastId: "minValue",
      });
    }
    targetPartId.current = Number(e.target.value - 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const tmpDocsList = await fetchDocsList();
      setDocsList(tmpDocsList);
      setBestDocsList(tmpDocsList);
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  // URL 변경 시 채팅창과 챗봇을 닫도록 하는 useEffect
  useEffect(() => {
    if (isReportOpen) {
      closeReport();
    }
    if (isChatVisible) {
      toggleChat(); // 채팅창이 열려있다면 닫기
    }
    ChatBotStore.setState({ isChatBotVisible: false }); // 챗봇 닫기
  }, [location]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        contextMenu.hideAll();
        clearSearchResults();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="md:min-w-[768px] h-screen flex overflow-hidden relative"
      id="mainPage"
    >
      <Information />
      {docDataLength.current > 0 && (
        <div className="flex fixed top-5 right-4 gap-2 z-[1100] items-center hidden sm:flex">
          <div className="relative">
            <input
              type="number"
              placeholder="번호"
              max={docDataLength.current + 1}
              onChange={async (e) => {
                CheckNumber(e);
                targetPartId.current = e.target.value - 1;
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  if (targetPartId.current !== null) {
                    await setHighlightIndex(parseInt(targetPartId.current));
                  }
                  await virtuosoRef.current.scrollToIndex({
                    index: targetPartId.current,
                    behavior: "auto", // 'auto' 대신 'smooth'로 부드러운 스크롤
                    align: "center",
                  });

                  setTimeout(() => {
                    setHighlightIndex(null);
                  }, 2000);
                }
              }}
              className="w-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C96442] focus:border-[#C96442] outline-none transition-all duration-200 shadow-sm hover:shadow-md bg-white text-gray-700 placeholder-gray-400 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              / {docDataLength.current}
            </span>
          </div>
          <button
            onClick={async () => {
              if (targetPartId.current !== null) {
                await setHighlightIndex(parseInt(targetPartId.current));
              }
              await virtuosoRef.current.scrollToIndex({
                index: targetPartId.current,
                behavior: "smooth",
                align: "auto",
              });

              console.log(highlightIndex);

              setTimeout(() => {
                setHighlightIndex(null);
              }, 2000);
            }}
            className="px-3 py-2 bg-[#BC5B39] text-white rounded-lg hover:bg-[#C96442] active:bg-[#C96442] transition-colors duration-150 shadow-md hover:shadow-lg cursor-pointer"
          >
            이동
          </button>
        </div>
      )}

      <div className="hidden md:block fixed top-20 left-5 text-4xl font-bold mb-4 text-[#424242] w-[15vw] break-words break-all">
        {documentName}
      </div>

      {/* 내브바 관련 버튼 (왼쪽 상단) */}
      <div
        id="upperBtns"
        className="fixed top-4 left-4 z-[1200] flex items-center gap-2 px-2 py-1 bg-white/80 backdrop-blur-md rounded-full shadow-lg"
      >
        <button
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#BC5B39] to-[#ff835a] text-white hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => navigate("/translate")}
        >
          <ArrowLeftToLine />
        </button>
        <button
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#BC5B39] to-[#ff835a] text-white hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={openNav}
        >
          <Menu />
        </button>
      </div>

      {/* 원문/전체번역 버튼 (하단, 가장 위: bottom-34) */}
      {!isArchiveOpen && !isEditorOpen && dbInitialized && (
        <button
          id="translateAllBtn"
          onClick={async () => {
            if (location.includes("best")) {
              navigate(`/translate/main/viewer/${docsId}/`);
            } else {
              navigate(`/translate/main/viewer/${docsId}/best`);
            }
          }}
          className="cursor-pointer group fixed bottom-34 right-4 z-[2500] flex items-center overflow-hidden w-10 h-10 rounded-full bg-gradient-to-r from-[#BC5B39] to-[#ff835a] text-white transition-all duration-300 hover:w-42 hover:shadow-2xl"
        >
          {/* 아이콘 영역 */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">
            {location.includes("best") ? (
              <img className="w-6 h-6" src={English} alt="원문 보기" />
            ) : (
              <img className="w-6 h-6" src={Korean} alt="전체 번역 보기" />
            )}
          </div>
          {/* 텍스트 영역 */}
          <span className="ml-2 whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100">
            {location.includes("best") ? "원문 보기" : "전체 번역 보기"}
          </span>
        </button>
      )}

      {/* 챗봇 버튼 */}
      <ChatBotBtn />

      {/* 채팅 버튼 */}
      {localStorage.getItem("token") && (
        <div
          id="chatBtn"
          onClick={() => {
            toggleChat();
            ChatBotStore.setState({ isChatBotVisible: false });
          }}
          className="group fixed right-4 bottom-6 z-[2500] flex items-center overflow-hidden w-10 h-10 rounded-full bg-gradient-to-r from-[#BC5B39] to-[#ff835a] text-white transition-all duration-300 hover:w-24 hover:shadow-2xl cursor-pointer"
        >
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="ml-2 whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100">
            채팅
          </span>
        </div>
      )}
      {localStorage.getItem("token") && <Chat />}
      <Outlet className="h-screen pr-16" />
    </div>
  );
};

export default ViewerMainPage;
