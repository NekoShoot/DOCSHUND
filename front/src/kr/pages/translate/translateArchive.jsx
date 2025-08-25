import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import GoBack from "../../assets/icon/goBack.png";
import ToastViewer from "./components/toastViewer.jsx";
import ReportModal from "../report.jsx";

// 서비스
import { fetchBestTranslate } from "./services/translateGetService.jsx";
import { likeTranslate } from "./services/translatePostService.jsx";
import userProfileService from "../myPage/services/userProfileService.jsx";

//상태관리
import useEditorStore from "../../store/translateStore/editorStore.jsx";
import useArchiveStore from "../../store/translateStore/archiveStore.jsx";
import useReportStore from "../../store/reportStore.jsx";
import useModalStore from "../../store/translateStore/translateModalStore.jsx";
import useChatStore from "../../store/chatStore.jsx";
import _ from "lodash";

const TranslateArchive = () => {
  let userId = 0;
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    userId = jwtDecode(token).userId;
  }

  const [transStates, setTransStates] = useState({});

  const {
    docsId,
    originId,
    porder,
    clearDocsPart,
    clearBestTrans,
    clearTempSave,
    clearSubmitData,
    clearDocsId,
    clearOriginId,
    clearCurrentUserText,
  } = useEditorStore();
  const {
    transList,
    transUserList,
    orderBy,
    orderByLike,
    defaultStyle,
    toggledStyle,
    orderByUpdatedAt,
    setTransList,
    setOrderBy,
    setOrderByLike,
    setOrderByUpdatedAt,
  } = useArchiveStore();
  const { openReport, toggleReport, closeReport } = useReportStore();
  const { toggleChat, isChatVisible } = useChatStore();

  //모달 관련 상태
  const { isArchiveOpen, closeArchive } = useModalStore();

  const toggleTransContent = (transId) => {
    setTransStates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        if (key !== transId) {
          acc[key] = false;
        }
        return acc;
      }, {}),
      [transId]: !prev[transId],
    }));
  };

  const handleLike = async (docsId, transId) => {
    const status = await likeTranslate(docsId, transId);
    setTimeout(async () => {
      const tmpTransList = await fetchBestTranslate(docsId, "");
      changeOrderBy(orderBy, tmpTransList);
      setTransList(tmpTransList);
    }, 300);
    return status;
  };

  // Create debounced version of handleLike
  const debouncedHandleLike = _.debounce(handleLike, 300);

  const handleClose = () => {
    clearDocsPart();
    clearTempSave();
    clearSubmitData();
    clearDocsId();
    clearOriginId();
    clearCurrentUserText();
  };

  const changeOrderBy = (category, list) => {
    if (category === "like") {
      list.sort((a, b) => b.likeCount - a.likeCount);
    } else if (category === "newest") {
      list.sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return dateB - dateA;
      });
    }
  };

  const handleUTC = (time) => {
    const date = new Date(time);
    const kor = date.getHours() + 9;
    date.setHours(kor);
    return date;
  };

  useEffect(() => {
    closeReport();
    useChatStore.setState({ isChatVisible: false });
    const fetchData = async () => {
      if (isArchiveOpen) {
        const tmpTransList = await fetchBestTranslate(docsId, "");
        setTransList(tmpTransList);
        changeOrderBy(orderBy, tmpTransList);
      }
    };
    fetchData();
  }, [isArchiveOpen]);

  return (
    <AnimatePresence>
      {isArchiveOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[2800] backdrop-brightness-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backdropFilter: "blur(10px)" }}
        >
          {/* {isArchiveVisible ? ( */}
          <motion.div
            key="archive-modal"
            className="fixed inset-0 flex items-center justify-center min-w-full min-h-full "
          >
            <ReportModal />
            <div className="relative m-5 p-6 w-1/2 h-[95%] min-w-[768px] min-h-[80%] max-w-full max-h-full rounded-2xl bg-white shadow-lg transition-all duration-300 ease-in-out">
              <div className="flex shrink-0 pb-6 text-2xl font-semibold text-slate-800 justify-between items-center">
                <img
                  src={GoBack}
                  className="cursor-pointer w-[40px] h-[25px] hover:scale-110 transition-transform duration-200"
                  alt="나가기"
                  onClick={async () => {
                    handleClose();
                    setTimeout(() => closeArchive(), 100);
                  }}
                />
                <span className="flex-1 text-center">
                  {porder}번째 문단 번역 기록
                </span>
                <div className="w-[40px]"></div>
              </div>
              <div className="flex justify-end gap-4 mb-2">
                <div
                  onClick={() => {
                    setOrderByUpdatedAt();
                    setOrderBy("newest");
                    changeOrderBy("newest", transList);
                  }}
                  className={`${
                    orderByUpdatedAt ? toggledStyle : defaultStyle
                  } transition-all duration-200 hover:underline`}
                >
                  최신순
                </div>
                <div
                  onClick={() => {
                    setOrderByLike();
                    setOrderBy("like");
                    changeOrderBy("like", transList);
                  }}
                  className={`${
                    orderByLike ? toggledStyle : defaultStyle
                  } transition-all duration-200 hover:underline`}
                >
                  좋아요순
                </div>
              </div>
              <div className="relative border-t border-slate-200 py-6 leading-normal text-slate-600 font-light h-9/11 flex flex-col gap-4 overflow-y-scroll">
                <div>
                  {transList.filter((trans) => trans.originId === originId)
                    .length === 0 && (
                    <div className="text-center text-gray-500 mt-12 text-lg font-medium animate-pulse">
                      첫 번째 번역의 주인공이 되세요!
                    </div>
                  )}
                </div>
                {transList.map((trans) => {
                  if (trans.originId === originId) {
                    return (
                      <div
                        key={trans.transId}
                        className="w-full flex flex-col max-h-[45vh] bg-white border border-[#87867F] py-4 px-5 rounded-xl hover:shadow-lg transition-all duration-300 ease-in-out"
                      >
                        <div
                          onClick={() => {
                            toggleTransContent(trans.transId);
                          }}
                          className="flex flex-row justify-between cursor-pointer items-center"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="text-lg font-medium">
                              {transUserList[trans.userId]}
                              님의 번역본
                            </div>
                            <div className="text-sm text-gray-500">
                              {handleUTC(trans.updatedAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {userId !== trans.userId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // console.log(trans);
                                  useReportStore.setState({
                                    originContent: trans.content,
                                    reportedUser: trans.userId,
                                    commentId: null,
                                    articleId: null,
                                    transId: trans.transId,
                                    chatId: null,
                                  });
                                  openReport();
                                  toggleReport();
                                }}
                                className="text-gray-500 cursor-pointer underline"
                              >
                                신고
                              </button>
                            )}

                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await debouncedHandleLike(
                                  docsId,
                                  trans.transId
                                );
                              }}
                              className={`flex w-fititems-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer right-5 top-1/2  ${
                                trans.likeUserIds.includes(Number(userId))
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={
                                  trans.likeUserIds.includes(Number(userId))
                                    ? "text-white"
                                    : "text-slate-700"
                                }
                              >
                                좋아요
                              </span>
                              <span
                                className={`font-semibold ${
                                  trans.likeUserIds.includes(Number(userId))
                                    ? "text-white"
                                    : "text-slate-900"
                                }`}
                              >
                                {trans.likeCount}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div
                          className={`overflow-y-scroll transition-all duration-300 ease-in-out ${
                            transStates[trans.transId]
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="border-t border-slate-200 mt-4 pt-4 px-2 text-slate-700 leading-relaxed max-w-[10vh">
                            <ToastViewer content={trans.content} />
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </motion.div>
          {/* ) : null} */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranslateArchive;
