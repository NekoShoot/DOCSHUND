import { useState, useEffect, useRef } from "react";
import { useParams, useNavigationType } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  initDB,
  addData,
  loadData,
  closeAllConnections,
} from "./services/indexedDbService.jsx";
import {
  fetchTranslateData,
  fetchBestTranslate,
  fetchDocsList,
} from "./services/translateGetService.jsx";

// 컴포넌트 import
import ToastViewer from "./components/toastViewer.jsx";

//이미지 import
import loadingGif from "../../assets/loading.gif";

//상태
import useModalStore from "../../store/translateStore/translateModalStore.jsx";
import useDocsStore from "../../store/translateStore/docsStore.jsx";
import useEditorStore from "../../store/translateStore/editorStore.jsx";
import useDbStore from "../../store/translateStore/dbStore.jsx";
import useSearchStore from "../../store/translateStore/searchStore.jsx";

const BestTransViewer = () => {
  const navigationType = useNavigationType();
  const { docsId } = useParams();
  const [docParts, setDocParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [processedCount, setProcessedCount] = useState(0);
  //각 문단 별 상태 저장 및 추적
  const tmpTransList = useRef([]);
  const tmpBestTransList = useRef([]);
  //
  const [checkComplete, setCheckComplete] = useState(false);
  const docData = useRef([]);
  const loadingRef = useRef(null);
  const chunk_size = 20;

  //indexedDB 관련 변수
  const dbName = "docs";
  const objectStoreName = docsId;
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  //뒤로가기시 예외 처리
  const { isEditorOpen, closeEditor, openArchive, closeArchive } =
    useModalStore();
  const {
    clearDocsPart,
    clearBestTrans,
    clearCurrentUserText,
    clearTempSave,
    clearSubmitData,
  } = useEditorStore();

  const { documentName, setDocumentName } = useDocsStore();

  const { dbInitialized, activateDbInitialized, deactivateDbInitialized } =
    useDbStore();

  const {
    virtuosoRef,
    docDataLength,
    highlightIndex,
    setHighlightIndex,
    clearHighlightIndex,
  } = useSearchStore();

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

  //뒤로가기 예외 처리
  useEffect(() => {
    if (navigationType === "POP") {
      closeEditor();
      closeArchive();
      handleClose();
    }
  }, [navigationType]);

  useEffect(() => {
    showCurrentDocumentName();
    let isMounted = true; // 컴포넌트 마운트 상태 추적
    closeAllConnections();
    // 상태 초기화
    setDocParts([]);
    setProcessedCount(0);
    setHasMore(true);
    setCheckComplete(false);
    setIsDbInitialized(false); // 여기로 이동
    deactivateDbInitialized();
    docData.current = [];
    docDataLength.current = 0;

    const fetchData = async () => {
      const data = await fetchBestTranslate(docsId, "best");
      tmpTransList.current = data;
      // console.log("tmpTransList.current", tmpTransList.current);
      tmpTransList.current.forEach((element) => {
        tmpBestTransList.current[element.originId] = {
          element,
          key: element.originId,
        };
      });
    };

    async function checkDB() {
      if (!isMounted) return; // 컴포넌트가 언마운트되었습니다면 중단
      setLoading(true);

      try {
        await initDB(dbName, objectStoreName);
        const loadedData = await loadData(objectStoreName);
        if (!isMounted) return; // 비동기 작업 후 마운트 상태 다시 확인

        if (!loadedData || loadedData.length === 0) {
          try {
            const data = await fetchTranslateData(docsId, false);
            if (!isMounted) return;
            if (data && Array.isArray(data)) {
              docData.current = data;
              docDataLength.current = docData.current.length;
              await addData(data, objectStoreName);

              if (isMounted) {
                setIsDbInitialized(true);
                activateDbInitialized();
                setCheckComplete(true);
              }
            } else {
              throw new Error("Invalid data format received from server");
            }
          } catch (error) {}
        } else {
          if (isMounted) {
            docData.current = loadedData;
            docDataLength.current = docData.current.length;
            setIsDbInitialized(true);
            setCheckComplete(true);
            activateDbInitialized();
          }
        }
      } catch (error) {
        // console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    checkDB();
    fetchData();
    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, [docsId]);

  // Race Condition Prevention Pattern : useEffect에서 함수가 동시 실행되는 것을 방지

  return (
    <div className="h-screen w-[90vw] md:w-[60vw] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-x-auto overflow-y-scroll p-6 flex flex-col z-[1000] mx-auto shadow-xl">
      <div className="flex flex-col gap-2 w-full h-[90vh]">
        <div className="h-[8vh]"></div>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: "100%" }}
          data={docData.current}
          itemContent={(index) => (
            <div
              key={index}
              className={`paragraph flex flex-row gap-4 w-ful transition-all duration-500 ${
                highlightIndex === index ? "bg-[#E4DCD4] animate-pulse" : ""
              }`}
            >
              <div className="flex flex-col w-full p-1 rounded-sm text-[#424242]">
                <div className="flex justify-between">
                  {tmpBestTransList.current[docData.current[index].originId] ? (
                    <ToastViewer
                      content={
                        tmpBestTransList.current[
                          docData.current[index].originId
                        ].element.content
                      }
                    />
                  ) : (
                    <ToastViewer content={docData.current[index].content} />
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
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default BestTransViewer;
