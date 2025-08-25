import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Layout, Menu as MenuIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import docsStore from "../../../store/translateStore/docsStore";
import docsCategoryStore from "../../../store/docsCategoryStore";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";
import { fetchDocsList } from "../../translate/services/translateGetService";

// TODO: 디자인 수정(패딩, 마진 등)

const CommunityLeftNav = () => {
  // docsList를 가져옴
  const docsList = docsStore((state) => state.docsList);
  const setDocsList = docsStore((state) => state.setDocsList);

  // 대분류 목록과 소분류 목록을 가져옴
  const setPositions = docsCategoryStore((state) => state.setPositions);
  const category = communityArticleStore((state) => state.category); // 소분류 카테고리(단일)
  const setCategory = communityArticleStore((state) => state.setCategory);
  const setDocumentNames = docsCategoryStore((state) => state.setDocumentNames);
  const clearArticles = communityArticleStore((state) => state.clearArticles);

  // 대분류와 소분류 목록을 저장할 Map
  const [positionMap, setPositionMap] = useState(new Map());
  const [expandedSections, setExpandedSections] = useState({});
  const [navData, setNavData] = useState({});

  // 모바일 토글 상태 및 모바일 여부
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // collapsed 상태를 반응형 디자인에 사용할 변수 (모바일에서만 적용)
  const isSidebarCollapsed = isMobile && isCollapsed;

  const location = useLocation();
  const navigate = useNavigate();

  // 섹션 토글 hook
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 모바일 화면 감지
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 카테고리 및 문서 목록 가져오기
  useEffect(() => {
    async function asyncFetchDocsList() {
      try {
        const response = await fetchDocsList(); // docsList 호출
        // response가 있으면
        if (response) {
          setDocsList(response); // store에 저장
        }
      } catch (error) {
        console.log(error);
      }
    }
    asyncFetchDocsList();
  }, []); // 빈 의존성 배열 추가

  // navData 초기화 부분 수정
  useEffect(() => {
    try {
      if (docsList.length > 0) {
        const newPositionMap = new Map();

        // 대분류와 소분류 목록을 Map에 추가
        docsList.forEach((docs) => {
          if (docs.position && docs.documentName) {
            if (!newPositionMap.has(docs.position)) {
              newPositionMap.set(docs.position, new Set([docs.documentName]));
            } else {
              newPositionMap.get(docs.position).add(docs.documentName);
            }
          }
        });

        setPositionMap(newPositionMap);
        const newPositions = Array.from(newPositionMap.keys());
        setPositions(newPositions);

        // 섹션 토글 초기화
        const initialExpanded = {};
        newPositions.forEach((position) => {
          initialExpanded[position] = true;
        });
        setExpandedSections(initialExpanded);

        // navData 초기화
        const initialNavData = {};
        newPositions.forEach((position) => {
          initialNavData[position] = Array.from(
            newPositionMap.get(position) || new Set()
          );
        });

        // 초기화된 데이터를 state에 저장
        setNavData(initialNavData);
        setDocumentNames(initialNavData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [docsList, setPositions]);

  return (
    <div className="bg-white border border-[#E1E1DF] rounded-xl p-4 w-full mr-4 md:w-48 h-fit md:overflow-y-auto">
      {/* 모바일 토글 버튼: sm 미만에서만 보임 */}
      {isMobile && (
        <div className="flex justify-end">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1">
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      )}
      {/* 내비게이션: 데스크탑에서는 항상 보이고, 모바일에서는 collapsed 여부에 따라 너비가 변경됨 */}
      <nav
        className={`rounded-xl py-5 bg-[#FFFFFF] transition-all duration-300 ${
          isMobile && isSidebarCollapsed ? "hidden" : "block"
        }`}
      >
        <button
          onClick={() => {
            clearArticles();
            navigate("/community");
          }}
          className="w-full flex items-center justify-between p-2 bg-[#424242] text-white rounded cursor-pointer mb-2"
        >
          <div className="flex items-center gap-2">
            <Layout size={18} />
            {/* collapsed 상태에서는 텍스트 숨김 */}
            <span
              className={`text-sm font-medium ${
                isSidebarCollapsed ? "hidden" : ""
              }`}
            >
              ALL
            </span>
          </div>
        </button>
        {/* navData에 있는 각 entry들 조회 */}
        {Object.entries(navData).map(([section, items]) => (
          <div key={section} className="mb-2">
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex items-center justify-between p-2 bg-[#bc5b39] text-white rounded cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {/* collapsed 상태이면 섹션명의 첫 글자만 */}
                {isSidebarCollapsed ? (
                  <span className="text-lg font-bold">
                    {section.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <>
                    <Layout size={18} />
                    <span className="text-sm font-medium">{section}</span>
                  </>
                )}
              </div>
              {!isSidebarCollapsed &&
                (expandedSections[section] ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                ))}
            </button>
            {!isSidebarCollapsed && expandedSections[section] && (
              <ul className="mt-1 ml-6 space-y-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className={`text-sm cursor-pointer py-1 hover:text-[#bc5b39] ${
                      category === item ? "text-[#bc5b39]" : "text-[#7D7C77]"
                    }`}
                    onClick={() => {
                      setCategory(item);
                      if (!location.pathname.includes("list")) {
                        navigate(`/community/list`);
                      }
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default CommunityLeftNav;
