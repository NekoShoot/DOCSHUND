import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { initDB, searchData } from "../services/indexedDbService"; // indexedDB 관련 함수들
import ToastViewer from "./toastViewer";
import { toast } from "react-toastify";
import { Button, Spinner } from "flowbite-react";
import useDocsStore from "../../../store/translateStore/docsStore";
import useSearchStore from "../../../store/translateStore/searchStore";
import { Virtuoso } from "react-virtuoso";

const SearchDB = ({ tableId }) => {
  const {
    virtuosoRef,
    highlightIndex,
    setHighlightIndex,
    clearHighlightIndex,
  } = useSearchStore();
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("");
  const { searchResults, setSearchResults } = useDocsStore();

  const dbName = "docs";
  const objectStoreName = tableId;
  const searchField = "content"; // 검색할 필드 지정

  // DB 초기화
  useEffect(() => {
    initDB(dbName, objectStoreName).then((database) => setDb(database));
    // .catch((error) => toast.error("DB 초기화 오류: " + error));
  }, []);

  // 검색 실행
  const handleSearch = async () => {
    if (db && query.trim().length < 2) {
      toast.warn("두 글자 이상 입력해주세요.", {
        toastId: "search-min-length",
      });
      return;
    }
    setLoading(true);
    if (db && query.trim() !== "") {
      setSearchResults([]);
      const result = await searchData(objectStoreName, searchField, query);
      if (result.length === 0) {
        setLoading(false);
        // console.log("검색 결과가 없습니다.");
        setSearchResults([{ content: "검색 결과가 없습니다." }]);
      } else {
        setSearchResults(result);
        setLoading(false);
      }
    }
  };

  const checkMaxLength = (e) => {
    if (e.target.value.length === 500) {
      toast.warn("검색어 500자 제한 초과", {
        toastId: "search-max-length",
      });
    }
  };

  return (
    <div
      id="searchBox"
      className="fixed flex flex-col items-center p-4 max-w-md mx-auto z-[1100] top-1 left-[60vw] sm:left-[50vw] translate-x-[-50%] w-[45vw]"
    >
      {loading && (
        <Button className="absolute top-4 right-3" color="warn">
          <Spinner
            aria-label="Spinner button example"
            size="sm"
            color="success"
          />
          <span className="pl-3">검색 중...</span>
        </Button>
      )}
      <input
        type="text"
        placeholder="검색어 입력 후 Enter"
        value={query}
        minLength={5}
        maxLength={500}
        onChange={(e) => {
          setQuery(e.target.value);
          checkMaxLength(e);
          if (e.target.value === "") {
            setSearchResults([]);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); //
            handleSearch();
          }
        }}
        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C96442] bg-[#FAF9F5] break-words"
      />

      {searchResults.length > 0 && (
        <ul className="mt-4 bg-white shadow-md rounded-lg p-2 h-[50vh] max-h-[50vh] overflow-y-scroll overflow-x-hidden w-[45vw]">
          <div className="h-full w-full">
            <Virtuoso
              style={{ height: "100%" }}
              data={searchResults}
              itemContent={(index, item) => (
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    virtuosoRef.current.scrollToIndex({
                      index: item.id,
                      align: "center",
                      behavior: "auto",
                    });
                    setHighlightIndex(item.id - 1);
                    setTimeout(() => {
                      setHighlightIndex(null);
                    }, 2000);
                  }}
                  key={item.id}
                  className="p-2 h-fit w-full flex-col mb-1 border-1 flex bg-[#FAF9F5] hover:bg-slate-200 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <ToastViewer content={item[searchField]} />
                </li>
              )}
            />
          </div>
        </ul>
      )}
    </div>
  );
};

SearchDB.propTypes = {
  tableId: PropTypes.string.isRequired,
};

export default SearchDB;
