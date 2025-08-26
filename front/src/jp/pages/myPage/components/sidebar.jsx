import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

const mainMenuItems = [
  { name: "프로필", path: "profile" },
  { name: "보관함", path: "archive", defaultPath: "likeTrans" },
  { name: "활동", path: "activity", defaultPath: "myTrans" },
  { name: "메모장", path: "memo" },
  { name: "나의 문의", path: "inquiry" },
];

const subMenuItems = {
  archive: [
    { name: "관심 번역본", path: "likeTrans" },
    { name: "관심 게시글", path: "likeArticle" },
    { name: "관심 문서", path: "likeDocs" },
  ],
  activity: [
    { name: "나의 번역본", path: "myTrans" },
    { name: "나의 게시글", path: "myArticle" },
    { name: "나의 댓글", path: "myComment" },
  ],
};

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  const renderMenuItems = () =>
    mainMenuItems.map((item) => {
      const isActive = location.pathname.includes(item.path);
      return (
        <div key={item.path}>
          <NavLink
            to={`/myPage/${item.path}/${item.defaultPath || ""}`}
            className={({ isActive: navLinkIsActive }) =>
              `block py-2 px-4 mb-2 font-bold ${
                isActive || navLinkIsActive
                  ? "text-[#bc5b39]"
                  : "text-[#7D7C77]"
              } hover:text-[#bc5b39]`
            }
          >
            {item.name}
          </NavLink>
          {subMenuItems[item.path] && (
            <div className="pl-4">
              {subMenuItems[item.path].map((subItem) => (
                <NavLink
                  key={subItem.path}
                  to={`/myPage/${item.path}/${subItem.path}`}
                  className={({ isActive: subNavLinkIsActive }) =>
                    `block py-2 px-4 mb-2 ${
                      subNavLinkIsActive ? "text-[#bc5b39]" : "text-[#7D7C77]"
                    } hover:text-[#bc5b39]`
                  }
                >
                  {subItem.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="bg-white border border-[#E1E1DF] rounded-xl p-4 w-full mr-4 md:w-48 md:h-[600px] md:overflow-y-auto">
      {/* 모바일: 토글 버튼 표시 */}
      {isMobile && (
        <div className="flex justify-end">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1">
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      )}
      {/* 모바일이면 토글 애니메이션 적용, 데스크탑에서는 항상 보임 */}
      {isMobile ? (
        <motion.div
          initial={{ height: "auto" }}
          animate={{ height: isCollapsed ? 0 : "auto" }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {renderMenuItems()}
        </motion.div>
      ) : (
        <div>{renderMenuItems()}</div>
      )}
    </div>
  );
};

export default Sidebar;
