import CommunityLeftNav from "./components/communityLeftNav";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useReportStore from "../../store/reportStore";

const community = () => {
  const { closeReport } = useReportStore();
  useEffect(() => {
    document.body.style.overflow = "auto";
    closeReport();
  }, []);
  return (
    <div className="w-full flex flex-col md:flex-row px-4 md:px-8 py-5 max-w-screen-xl mx-auto gap-4">
      {/* 좌측 내비게이션 바 */}
      <CommunityLeftNav />
      {/* 리스트, 글 상세, 글 작성, 글 수정 페이지 routes */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default community;
