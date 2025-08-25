import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CommunityHeader = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  // 현재 페이지가 글 목록인지 확인
  const isArticleList = location.pathname.includes("list");

  return (
    <div className="mb-6">
      {/* 2-1. 헤더 영역 */}
      <div className="flex justify-between items-center mt-4 mb-5">
        <h1 className="text-2xl font-bold text-[#2C2C2C]">커뮤니티</h1>
        {/* NOTE: 로그인한 회원이고, 글 목록에서만 보이게 함 */}
        {isArticleList ? (
          isLoggedIn && (
            <button
              onClick={() => navigate("/community/write")}
              className="bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 relative flex items-center justify-center text-white hover:bg-[#C96442] cursor-pointer"
            >
              글쓰기
            </button>
          )
        ) : (
          <button
            onClick={() => navigate("/community/list")}
            className="bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 relative flex items-center justify-center text-white hover:bg-[#C96442] cursor-pointer"
          >
            목록으로
          </button>
        )}
      </div>
    </div>
  );
};

export default CommunityHeader;
