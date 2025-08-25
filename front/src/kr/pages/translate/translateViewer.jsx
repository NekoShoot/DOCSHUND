import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Virtuoso } from "react-virtuoso";
import {
  initDB,
  addData,
  loadData,
  closeAllConnections,
} from "./services/indexedDbService.jsx";
import userProfileService from "../myPage/services/userProfileService.jsx";
import {
  fetchTranslateData,
  fetchBestTranslate,
} from "./services/translateGetService.jsx";
import { fetchDocsList } from "./services/translateGetService.jsx";
import useMemoService from "../myPage/services/memoService.jsx";

// 컴포넌트 import
import TranslateEditor from "./translateEditor.jsx";
import TranslateArchive from "./translateArchive.jsx";
import ToastViewer from "./components/toastViewer.jsx";
import SearchDB from "./components/searchDB.jsx";

//우클릭 커스타마이즈
import "react-contexify/dist/ReactContexify.css";

import {
  Menu,
  Item,
  Separator,
  useContextMenu,
  contextMenu,
} from "react-contexify";

// 상태 import
import useModalStore from "../../store/translateStore/translateModalStore.jsx";
import useEditorStore from "../../store/translateStore/editorStore.jsx";
import useDocsStore from "../../store/translateStore/docsStore.jsx";
import useArchiveStore from "../../store/translateStore/archiveStore.jsx";
import MemoStore from "../../store/../store/myPageStore/memoStore.jsx";
import useDbStore from "../../store/translateStore/dbStore.jsx";
import useSearchStore from "../../store/translateStore/searchStore.jsx";

// 이미지 import
import loadingGif from "../../assets/loading.gif";
import { Trophy } from "lucide-react";
import { createPortal } from "react-dom";

const TranslateViewer = () => {
  let userId = 0;
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [bestTransMap, setBestTransMap] = useState({});

  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    userId = jwtDecode(token).userId;
  }

  const { docsId } = useParams();
  const [docParts, setDocParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [processedCount, setProcessedCount] = useState(0);
  // 각 문단 별 상태 저장 및 추적

  const [docpartStates, setDocpartStates] = useState({});
  const [heightStates, setHeightStates] = useState({});
  // 마우스 위치 저장 (컨텍스트 메뉴 위치 조정용)
  const [checkComplete, setCheckComplete] = useState(false);
  const docData = useRef([]);
  const loadingRef = useRef(null);
  const chunk_size = 20;
  // 문단 높이 조절을 위한 초기 높이 저장 ref
  const initialHeights = useRef({});
  //우클릭메뉴 커스텀을 위한 상태
  const [contextMenuPorder, setContextMenuPorder] = useState(0);

  // indexedDB 관련 변수
  const dbName = "docs";
  const objectStoreName = docsId;
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  // 번역 관련 상태
  const { transList, setTransList, transUserList } = useArchiveStore();
  const {
    bestTrans,
    setBestTrans,
    setDocsId,
    setOriginId,
    setDocsPart,
    setPorder,
    clearCurrentUserText,
    clearDocsPart,
    clearBestTrans,
    clearTempSave,
    clearSubmitData,
  } = useEditorStore();
  const { documentName, setDocumentName, docsList, clearSearchResults } =
    useDocsStore();
  // 모달 관련 상태
  const { openEditor, openArchive, closeEditor, closeArchive } =
    useModalStore();

  const { dbInitialized, activateDbInitialized, deactivateDbInitialized } =
    useDbStore();

  const {
    virtuosoRef,
    docDataLength,
    highlightIndex,
    setHighlightIndex,
    clearHighlightIndex,
  } = useSearchStore();

  // 우클릭 또는 버튼 클릭 시 UI 상태 토글

  const generateUserList = async (translateList) => {
    translateList.forEach(async (trans) => {
      const user = await userProfileService.fetchProfile(trans.userId);
      transUserList[trans.userId] = user.nickname;
    });
  };

  const toggleDocpart = (partId, type) => {
    const partKey = String(partId);
    setDocpartStates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        if (key !== partKey && type === "leftClick") {
          acc[key] = false;
        }
        return acc;
      }, {}),
      [partKey]: type === "leftClick" ? !prev[partKey] : prev[partKey],
    }));
  };

  // 주송 이동 예외 처리
  const handleClose = () => {
    clearDocsPart();
    clearBestTrans();
    clearTempSave();
    clearSubmitData();
    clearCurrentUserText();
    clearHighlightIndex();
  };

  const showCurrentDocumentName = async () => {
    const tmpDocsList = await fetchDocsList();
    const currentDocs = await tmpDocsList.filter(
      (doc) => doc.docsId === Number(docsId)
    );
    if (currentDocs.length !== 0) {
      setDocumentName(currentDocs[0].documentName);
    } else {
      setDocumentName("");
    }
  };

  useEffect(() => {
    closeEditor();
    closeArchive();
    handleClose();
  }, [location.pathname, docsId]);

  useEffect(() => {
    //현재 문서 이름 설정
    showCurrentDocumentName();
    let isMounted = true; // 마운트 여부 추적
    closeAllConnections();
    // 상태 초기화
    setDocParts([]);
    setProcessedCount(0);
    setHasMore(true);
    setCheckComplete(false);
    setIsDbInitialized(false);
    deactivateDbInitialized();
    MemoStore.setState({ memos: useMemoService.fetchMemos(userId) });
    docData.current = [];
    docDataLength.current = 0;
    setHighlightIndex(null);

    async function checkDB() {
      if (!isMounted) return;
      setLoading(true);

      try {
        await initDB(dbName, objectStoreName);
        const loadedData = await loadData(objectStoreName);
        // setTotalData(loadedData.length);

        if (!isMounted) return;

        if (!loadedData || loadedData.length === 0) {
          toast.info("서버와 연결되었습니다.");
          try {
            const data = await fetchTranslateData(docsId, "");
            if (data.length === 0) {
              toast.info("문서 원본을 추가 중입니다.");
              navigate(-1);
              return;
            }
            if (!isMounted) return;
            if (data && Array.isArray(data)) {
              docData.current = data;
              docDataLength.current = data.length;
              await addData(data, objectStoreName);
              toast.success("원문 데이터가 준비되었습니다.");
              if (isMounted) {
                setIsDbInitialized(true);
                activateDbInitialized();
                setCheckComplete(true);
              }
            } else {
              throw new Error("Invalid data format received from server");
            }
          } catch (error) {
            // console.error("Failed to fetch data from server:", error);
          }
        } else {
          toast.success("원문 데이터가 준비되었습니다.");
          if (isMounted) {
            docData.current = loadedData;
            docDataLength.current = loadedData.length;
            setIsDbInitialized(true);
            activateDbInitialized();
            setCheckComplete(true);
          }
        }
      } catch (error) {
        // console.log("Error in checkDB:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkDB();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, docsId]);

  const { show } = useContextMenu({
    id: "translate-menu",
  });

  // 우클릭 시 컨텍스트 메뉴 실행
  const handleContextMenu = (e, part) => {
    e.preventDefault();
    show({ event: e, props: { part } });
  };

  // 메뉴 항목: 번역하기
  const handleTranslate = async ({ props }) => {
    const { part } = props;
    const data = await fetchBestTranslate(part.docsId, "best");
    const bestTransList = [...data].filter(
      (item) => item.originId === part.originId
    );

    if (bestTransList.length !== 0) {
      setBestTrans(bestTransList[0].content);
    }
    useEditorStore.setState({
      docsPart: part.content,
      porder: part.pOrder,
      docsId: part.docsId,
      originId: part.originId,
    });

    await openEditor();
  };

  // 메뉴 항목: 번역 기록
  const handleArchive = async ({ props }) => {
    const { part } = props;
    const tmpTransList = await fetchBestTranslate(part.docsId, "");
    setTransList(tmpTransList);
    setDocsPart(part.content);
    setDocsId(part.docsId);
    setOriginId(part.originId);
    setPorder(part.pOrder);
    await openArchive();
  };

  return (
    <div
      id="mainContent"
      onClick={(e) => {
        e.stopPropagation();
        clearSearchResults();
      }}
      key={docsId}
      className="h-screen w-[90vw] md:w-[60vw] bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-x-auto overflow-y-scroll p-6 flex flex-col z-[1000] mx-auto shadow-xl"
    >
      {createPortal(<SearchDB tableId={docsId} />, document.body)}

      <div className="flex flex-col gap-2 w-full h-[90vh]">
        <div className="h-[8vh]"></div>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: "100%", width: "100%", padding: "0px" }}
          data={docData.current}
          itemContent={(index, part) => (
            <div
              onContextMenu={async (e) => {
                toggleDocpart(part.id, "rightClick");
                if (!localStorage.getItem("token")) {
                  e.preventDefault();
                  return;
                }
                setContextMenuPorder(part.pOrder);
                handleContextMenu(e, part);
                const tmpTransList = await fetchBestTranslate(
                  docData.current[index].docsId,
                  ""
                );
                setTransList(tmpTransList);
                await generateUserList(tmpTransList);
              }}
              className={`paragraph flex flex-row gap-4 w-ful transition-all duration-500 ${
                highlightIndex === index ? "bg-[#E4DCD4] animate-pulse" : ""
              }`}
            >
              <div
                onClick={async (e) => {
                  e.stopPropagation();
                  contextMenu.hideAll();
                  clearSearchResults();
                  const tmpTransList = await fetchBestTranslate(
                    part.docsId,
                    "best"
                  );
                  setTransList(tmpTransList);

                  if (tmpTransList) {
                    const filteredTranslations = tmpTransList.filter(
                      (item) => item.originId === part.originId
                    );
                    if (filteredTranslations.length > 0) {
                      setBestTrans(filteredTranslations[0].content);

                      toggleDocpart(part.id, "leftClick");
                    } else {
                      setBestTrans("");
                      toast.info("아직 등록된 변역이 없습니다.", {
                        toastId: "no-trans",
                      });
                    }
                  } else {
                    setBestTrans("");
                  }
                }}
                className="flex flex-col w-full h-fit rounded-md p-2 m-1 text-[#424242] hover:shadow-[0px_0px_15px_0px_rgba(149,_157,_165,_0.3)] hover:border-gray-200 cursor-pointer transition-all duration-250 ease-in-out"
              >
                <div>
                  {!docpartStates[part.id] ? (
                    <ToastViewer content={part.content} />
                  ) : (
                    <div className="flex flex-col">
                      {bestTrans !== "" && (
                        <div className="flex justify-end">
                          <p className="font-extrabold mr-2">BEST</p>
                          <Trophy className="w-6 h-6 text-yellow-500" />
                        </div>
                      )}
                      {bestTrans === "" ? (
                        <ToastViewer content={part.content} />
                      ) : (
                        <ToastViewer content={bestTrans} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        />
      </div>

      {loading && (
        <div ref={loadingRef} className="py-6 text-center">
          <div className="flex justify-center items-center" role="status">
            <img
              className="w-[250px] h-[250px]"
              src={loadingGif}
              alt="로딩 애니메이션"
            />
          </div>
        </div>
      )}

      {createPortal(<TranslateEditor />, document.body)}
      {createPortal(<TranslateArchive />, document.body)}

      {/* Menu를 Portal로 document.body에 렌더링하고 z-index를 높게 지정 */}
      {createPortal(
        <Menu
          ref={menuRef}
          id="translate-menu"
          theme="none"
          animation="scale"
          style={{ zIndex: 1900 }}
        >
          <Item disabled>{contextMenuPorder}번째 문단</Item>
          <Separator />
          <Item className="hover:bg-gray-100!" onClick={handleTranslate}>
            번역하기
          </Item>
          <Item onClick={handleArchive}>번역 기록</Item>
        </Menu>,
        document.body
      )}
    </div>
  );
};

export default TranslateViewer;
