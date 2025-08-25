import { useEffect, useState, useCallback } from "react";
import { fetchUserList } from "../admin/services/adminGetService";
import { changeUserStatus } from "../admin/services/adminPatchService";
import useUserManagerStore from "../../store/adminStore/userManagerStore";
import { toast } from "react-toastify";
import { RefreshCw } from "lucide-react";
import _ from "lodash";

const ManageUser = () => {
  const [userList, setUserList] = useState([]);
  const { addUserList, removeUserList, currentUserList } =
    useUserManagerStore();

  const handleSearch = async (e) => {
    const searchKeyword = e.target.value;
    console.log(searchKeyword);
    if (!searchKeyword) {
      const data = await fetchUserList();
      data.sort((a, b) => b.reportCount - a.reportCount);
      setUserList(data);
      return;
    } else if (searchKeyword !== "") {
      const data = await fetchUserList();
      const filteredList = data.filter(
        (item) =>
          item.email.includes(searchKeyword.toLowerCase()) ||
          item.nickname.includes(searchKeyword.toLowerCase())
      );
      setUserList(filteredList);
    }
  };

  const processUserList = (userListContent) => {
    userListContent.forEach((user) => {
      currentUserList[user.userId] = user.nickname;
    });
  };

  const handleUserStatus = useCallback(
    _.debounce(async (userId, currentStatus) => {
      if (currentStatus === "ACTIVE") {
        const response = await changeUserStatus(userId, "WITHDRAWN");
        if (response === 200) {
          toast.success("상태 변경 완료", {
            toastId: "changeStatus",
          });
        } else {
          toast.error("상태 변경 실패", {
            toastId: "changeStatus",
          });
        }
      } else if (currentStatus === "WITHDRAWN") {
        const response = await changeUserStatus(userId, "BANNED");
        if (response === 200) {
          toast.success("상태 변경 완료", {
            toastId: "changeStatus",
          });
        } else {
          toast.error("상태 변경 실패", {
            toastId: "changeStatus",
          });
        }
      } else if (currentStatus === "BANNED") {
        const response = await changeUserStatus(userId, "ACTIVE");
        if (response === 200) {
          toast.success("상태 변경 완료", {
            toastId: "changeStatus",
          });
        } else {
          toast.error("상태 변경 실패", {
            toastId: "changeStatus",
          });
        }
      }

      const data = await fetchUserList();
      data.sort((a, b) => b.reportCount - a.reportCount);
      setUserList(data);
    }, 300),
    []
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchUserList();
        data.sort((a, b) => b.reportCount - a.reportCount);
        setUserList(data);
        processUserList(data);
      } catch (error) {
        // console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">회원 관리</h1>
        <div className="relative w-70">
          <input
            onChange={handleSearch}
            type="text"
            placeholder="이메일로 검색"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#bc5b39] focus:ring-1 focus:ring-[#bc5b39] transition-colors duration-200"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  닉네임
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  신고 횟수
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userList.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.nickname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(
                      new Date(user.createdAt).toISOString()
                    ).toLocaleString()}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap w-28 flex items-center gap-2">
                    <span
                      className={`flex justify-center items-center py-1 px-2 w-3/4 text-xs font-medium rounded-full ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : user.status === "BANNED"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-400 text-white"
                      }`}
                    >
                      {user.status === "ACTIVE"
                        ? "ACTIVE"
                        : user.status === "BANNED"
                        ? "BANNED"
                        : "BLIND"}
                    </span>
                    <button
                      onClick={() => handleUserStatus(user.userId, user.status)}
                      className="cursor-pointer hover:text-[#bc5b39] transition-colors duration-100"
                    >
                      <RefreshCw />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {user.reportCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
