import { useNavigate, useLocation } from "react-router-dom";
import RoundCornerBtn from "../../../components/button/roundCornerBtn";
import Logo from "../../../assets/logo.png";
import authService from "../../../services/authService";

const menuItems = [
  { text: "회원관리", path: "/admin/manageUser" },
  { text: "신고관리", path: "/admin/manageReport" },
  { text: "문의관리", path: "/admin/manageInquiry" },
  { text: "공지사항 관리", path: "/admin/manageNotification" },
  { text: "문서관리", path: "/admin/manageDocs" },
];

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = authService();

  return (
    <div className="w-[280px] h-screen bg-[#E4DCD4] text-[#424242] fixed left-0 top-0 p-6">
      <div className="pb-6 mb-6 border-b border-white/10">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer"
          src={Logo}
          alt="Logo"
        />
      </div>
      <div className="flex flex-col justify-between h-7/10">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.text}
              onClick={() => navigate(item.path)}
              className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 cursor-pointer
              ${
                location.pathname === item.path
                  ? "bg-white/20 font-bold"
                  : "hover:bg-white/10"
              }`}
            >
              {item.text}
            </button>
          ))}
        </nav>
        <div className="flex flex-col mt-[2vh] gap-3 justify-center align-center">
          <RoundCornerBtn
            onClick={() => navigate("/myPage")}
            text="마이페이지"
          />
          <RoundCornerBtn onClick={() => logout()} text="로그아웃" />
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
