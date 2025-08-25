import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import loadingGif from "../../assets/loading.gif";
import ToastViewer from "../../pages/translate/components/toastViewer";

const InfiniteScroll = ({
  dataList, //필수: 렌더링할 데이터 리스트
  chunkSize, //필수: 한번에 보여줄 데이터 개수
  loadingTime, // 선택: 자연스러운 로딩을 위한 지연
  renderItem, //필수: 리스트 안의 각 객체를 보여줄 형식을 지정 Ex)
  // propo 작성 형식 : renderItem = {(data)=><div>{data.content}</div>}
  onClick, //선택 : 각 요소를 클릭했을 때 실행될 함수
  partStyle, //선택: 각 요소의 스타일
  completeMessage, //선택: 모두 렌더링했을 때 표시할 메시지
}) => {
  const [dataParts, setDataParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [processedCount, setProcessedCount] = useState(0);
  const loadingRef = useRef(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      // 인위적인 지연 추가 (개발용) : 자연스러운 로딩 목적
      await new Promise((resolve) => setTimeout(resolve, loadingTime));
      const data = dataList;

      if (!data || data.length === 0) {
        // console.log("오류 발생 : 데이터 없음");
        setHasMore(false);
        return;
      }
      const newChunk = data.slice(processedCount, processedCount + chunkSize);
      if (!newChunk || newChunk.length === 0) {
        setHasMore(false);
        return;
      }
      //element.content가 null이나 undefined일 경우 ""로 대체 ==> React의 불변성 패턴
      const processedChunk = newChunk.map((element) => ({
        ...element,
        content: element.content || "",
      }));
      //전개 연산자 사용 : 두 객체들을 쉽게 합칠 수 있음.
      setDataParts((prev) => [...prev, ...processedChunk]);
      setProcessedCount((prev) => prev + chunkSize);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true; // 컴포넌트 마운트 상태 추적
    // 상태 초기화
    setDataParts([]);
    setProcessedCount(0);
    setHasMore(true);

    dataList.current = [];
    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    return () => observer.disconnect();
  }, [hasMore, loading, processedCount]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {dataParts.map((data, index) => (
          <div key={index} className="paragraph flex flex-row gap-4 relative">
            <div
              onClick={async (e) => {
                onClick?.(e);
              }}
              className={partStyle}
            >
              {renderItem(data)}
            </div>
          </div>
        ))}
      </div>
      <div ref={loadingRef} className="py-6 text-center">
        {loading && (
          <div className="flex justify-center items-center" role="status">
            <img
              className="w-[250px] h-[250px]"
              src={loadingGif}
              alt="로딩 애니메이션"
            />
          </div>
        )}
        {!hasMore && (
          <div className="text-gray-600 font-medium">{completeMessage}</div>
        )}
      </div>
    </div>
  );
};

InfiniteScroll.propTypes = {
  dataList: PropTypes.array.isRequired,
  chunkSize: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,
  loadingTime: PropTypes.number,
  onClick: PropTypes.func,
  partStyle: PropTypes.string,
  completeMessage: PropTypes.string,
};

InfiniteScroll.defaultProps = {
  loadingTime: 150,
  partStyle:
    "cursor-pointer mg-2 p-4 rounded-xl text-[#424242] bg-gray-200 hover:bg-[#cfccc9] hover:shadow-lg flex flex-col w-full transition-all duration-200 shadow-md",
  completeMessage: "모든 요소를 불러왔습니다.",
};

export default InfiniteScroll;
