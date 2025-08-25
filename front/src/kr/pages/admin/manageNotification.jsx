import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchNoticeList } from "./services/adminGetService";
import { registNotification } from "./services/adminPostService";
import { deleteNotification } from "./services/adminDeleteService";
import { modifyNotice } from "./services/adminPatchService";
import { toast } from "react-toastify";
import _ from "lodash";

const ManageNotification = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    content: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchNoticeData = async () => {
    try {
      const data = await fetchNoticeList();
      setNotifications(data.content);
    } catch (error) {
      // console.log("공지사항 목록 조회 실패", error);
    }
  };

  const debouncedHandleAddNotification = useMemo(() =>
    _.debounce(async () => {
      setIsEditorOpen(true);
      setIsEditing(false);
      setNewNotification({
        title: "",
        content: "",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }, 400)
  );

  const handleSaveNotification = async (title, content) => {
    const response = await registNotification(title, content);
    if (response === 200) {
      toast.success("공지 등록 성공", {
        toastId: "addNotification",
      });
      fetchNoticeData();
    } else {
      toast.error("공지 등록 실패", {
        toastId: "addNotification",
      });
    }
    setIsEditorOpen(false);
    setNewNotification({
      title: "",
      content: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    });
  };

  const debouncedHandleSaveNotification = useCallback(
    _.debounce((title, content) => {
      handleSaveNotification(title, content);
    }, 500),
    []
  );

  const handleEditNotification = async (noticeId, title, content) => {
    const response = await modifyNotice(noticeId, title, content);
    if (response === 200) {
      toast.success("공지 수정 성공", {
        toastId: "editNotification",
      });
      fetchNoticeData();
    } else {
      toast.error("공지 수정 실패", {
        toastId: "editNotification",
      });
    }
    setIsEditorOpen(false);
    setNewNotification({
      title: "",
      content: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    });
  };

  const debouncedHandleEditNotification = useCallback(
    _.debounce((noticeId, title, content) => {
      handleEditNotification(noticeId, title, content);
    }, 500),
    []
  );

  const handleDeleteNotification = async (noticeId) => {
    const response = await deleteNotification(noticeId);
    if (response === 200) {
      toast.success("삭제 성공", {
        toastId: "deleteNotification",
      });
      setTimeout(() => {
        setLoading(false);
      }, 50);
      fetchNoticeData();
    } else {
      toast.error("공지 삭제 실패", {
        toastId: "deleteNotification",
      });
      setTimeout(() => {
        setLoading(false);
      }, 50);
    }
  };

  const debouncedHandleDeleteNotification = useCallback(
    _.debounce((noticeId) => {
      handleDeleteNotification(noticeId);
    }, 500),
    []
  );

  const handleUTC = (time) => {
    const date = new Date(time);
    const kor = date.getHours() + 9;
    date.setHours(kor);

    return date;
  };

  const checkContentMaxLength = (e) => {
    if (e.target.value.length === 15000) {
      toast.warn("공지내용은 15,000자를 초과할 수 없습니다.", {
        toastId: "content-max-length",
      });
    }
  };

  const checkTitleMaxLength = (e) => {
    if (e.target.value.length === 50) {
      toast.warn("공지제목은 50자를 초과할 수 없습니다", {
        toastId: "title-max-length",
      });
    }
  };

  useEffect(() => {
    fetchNoticeData();
  }, []);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">공지사항 관리</h1>
        <button
          onClick={debouncedHandleAddNotification}
          className="bg-[#bc5b39] text-white px-4 py-2 rounded-lg hover:bg-[#a34b2b] transition-colors duration-200 cursor-pointer"
        >
          + 공지사항 등록
        </button>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl z-50">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "공지사항 수정" : "공지사항 등록"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                제목
              </label>
              <input
                type="text"
                value={newNotification.title}
                maxLength={50}
                onChange={(e) => {
                  setNewNotification({
                    ...newNotification,
                    title: e.target.value,
                  });
                  checkTitleMaxLength(e);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                내용
              </label>
              <textarea
                value={newNotification.content}
                maxLength={15000}
                onChange={(e) => {
                  setNewNotification({
                    ...newNotification,
                    content: e.target.value,
                  });
                  checkContentMaxLength(e);
                }}
                className="resize-none mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                style={{ height: "250px" }}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
              >
                취소
              </button>
              <div>
                {isEditing ? (
                  <button
                    onClick={() =>
                      debouncedHandleEditNotification(
                        editId,
                        newNotification.title,
                        newNotification.content
                      )
                    }
                    className="bg-[#bc5b39] text-white px-4 py-2 rounded-lg hover:bg-[#a34b2b] transition-colors duration-200 cursor-pointer"
                  >
                    수정
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      debouncedHandleSaveNotification(
                        newNotification.title,
                        newNotification.content
                      )
                    }
                    className="bg-[#bc5b39] text-white px-4 py-2 rounded-lg hover:bg-[#a34b2b] transition-colors duration-200 cursor-pointer"
                  >
                    작성
                  </button>
                )}
              </div>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsEditorOpen(false)}
          ></div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  게시일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  수정일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr
                  key={notification.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-ellipsis overflow-hidden max-w-[20vw]">
                    {notification.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-ellipsis">
                    {handleUTC(notification.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-ellipsis">
                    {handleUTC(notification.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {!loading && !isEditorOpen && (
                      <div className="gap-2 flex">
                        <button
                          onClick={() => {
                            setIsEditorOpen(true);
                            setIsEditing(true);
                            setEditId(notification.noticeId);
                            setNewNotification({
                              title: notification.title,
                              content: notification.content,
                            });
                          }}
                          className="text-[#bc5b39] hover:text-[#a34b2b] transition-colors duration-150 cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            const deleteConfirm =
                              confirm("공지를 삭제하시겠습니까?");
                            if (deleteConfirm) {
                              setLoading(true);
                              debouncedHandleDeleteNotification(
                                notification.noticeId
                              );
                            }
                          }}
                          className="text-red-600 hover:text-red-700 transition-colors duration-150 cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    )}
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

export default ManageNotification;
