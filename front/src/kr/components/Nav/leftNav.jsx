import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Drawer,
  Sidebar,
  TextInput,
  useThemeMode,
  Flowbite,
} from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import MemoModal from "../../pages/myPage/components/MemoModal.jsx";
import { fetchDocsList } from "../../pages/translate/services/translateGetService.jsx";
import memoService from "../../pages/myPage/services/memoService";
import useMemoStore from "../../store/myPageStore/memoStore";
import useMemoMode from "../../pages/myPage/hooks/useMemoMode";

import NotificationModal from "../notificationModal/notificationModal";

// 상태 import
import useModalStore from "../../store/translateStore/translateModalStore.jsx";
import useDocsStore from "../../store/translateStore/docsStore.jsx";
import modalStore from "../../store/myPageStore/myPageModalStore.jsx";
import notificationModalStore from "../../store/notificationModalStore";

// **삭제 확인 모달 관련 import**
import useAlertStore from "../../store/alertStore";
import ConfirmModal from "../../components/alertModal/confirmModal";

import Logo from "../../assets/logo.png";
import { Bell, ScrollText, StickyNote, Plus, X } from "lucide-react";
import { closeAllConnections } from "../../pages/translate/services/indexedDbService.jsx";

const LeftNav = () => {
  // flowbite 라이트모드 강제 설정
  const { setMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  // 내브 바 열림 및 닫힘
  const { isNavOpen, openNav, closeNav } = useModalStore();

  // 메모 및 알림
  const { isOpen, openModal, closeModal } = modalStore();
  const { memos, setMemos, deleteMemo } = useMemoStore();
  const { memoData, setMemoData, handleOpenCreateModal, handleOpenEditModal } =
    useMemoMode();
  const [userId, setUserId] = useState(null);

  const [memoToDelete, setMemoToDelete] = useState(null);
  const { isAlertOpen, toggleAlert, resetAlert } = useAlertStore();

  const toggleNotificationModal = notificationModalStore(
    (state) => state.toggleNotificationModal
  );
  const isNotificationModalOpen = notificationModalStore(
    (state) => state.isNotificationModalOpen
  );
  const closeNotificationModal = notificationModalStore(
    (state) => state.closeNotificationModal
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    closeModal();
    resetAlert();
  }, []);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  useEffect(() => {
    setMode("light");
  }, [setMode]);

  useEffect(() => {
    if (userId) {
      fetchMemos(userId);
    }
  }, [userId, location]);

  const fetchMemos = async (userId) => {
    if (!userId) return;
    try {
      const data = await memoService.fetchMemos(userId);
      setMemos(data ? data.reverse() : []);
    } catch (error) {
      // console.error("Error fetching memos:", error);
    }
  };

  const handleCreateMemo = async (memoData) => {
    if (userId) {
      try {
        await memoService.createMemo(userId, memoData);
        const data = await memoService.fetchMemos(userId);
        setMemos(data ? data.reverse() : []);
        closeModal();
      } catch (error) {
        // console.error("Error creating memo:", error);
      }
    }
  };

  const handleEditMemo = async (memoId, memoData) => {
    if (userId) {
      try {
        await memoService.updateMemo(userId, memoId, memoData);
        const data = await memoService.fetchMemos(userId);
        setMemos(data ? data.reverse() : []);
        closeModal();
      } catch (error) {
        // console.error("Error updating memo:", error);
      }
    }
  };

  const handleDeleteMemo = (memoId) => {
    setMemoToDelete(memoId);
    toggleAlert();
  };

  const confirmDeleteMemo = async () => {
    if (userId && memoToDelete) {
      try {
        await memoService.deleteMemo(userId, memoToDelete);
        deleteMemo(memoToDelete);
      } catch (error) {
        // console.error("Error deleting memo:", error);
      } finally {
        setMemoToDelete(null);
        closeModal();
        toggleAlert();
      }
    }
  };

  const handleToggleNotificationModal = (e) => {
    e.stopPropagation();
    console.log("toggleNotificationModal", isNotificationModalOpen);
    toggleNotificationModal();
  };

  const { docsList, setDocsList } = useDocsStore();

  // 문서 목록 불러오기 (DocsList 높이는 모바일: h-48, 데스크탑: h-[200px])
  useEffect(() => {
    fetchDocsList(true);
  }, [docsList]);

  useEffect(() => {
    closeNotificationModal();
  }, []);

  return (
    <div className="z-[1500]">
      <Drawer
        open={isNavOpen}
        onClose={closeNav}
        className="dark:bg-[#FAF9F5] max-w-full md:max-w-[36vw] shadow-2xl"
        backdrop={false}
      >
        <div className="flex items-center justify-center">
          <NavLink to="/">
            <img
              className="w-[clamp(120px,10vw,148px)] h-auto hover:opacity-80 transition-opacity duration-200"
              src={Logo}
              alt="닥스훈트 로고"
            />
          </NavLink>
        </div>
        <button
          className="absolute top-4 right-4 cursor-pointer"
          onClick={closeNav}
        >
          <X />
        </button>
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item className="dark:hover:bg-transparent">
                      <div className="px-2 py-2.5 mb-2 flex flex-row items-center cursor-pointer hover:bg-[#F5F4F0] transition-colors duration-200">
                        <ScrollText className="w-6 h-6 text-[#7E7C77]" />
                        <span className="ml-5 font-medium text-[#7E7C77]">
                          문서목록
                        </span>
                      </div>
                      <div className="h-48 md:h-[200px] overflow-y-scroll">
                        <div className="px-2">
                          {docsList.map((doc, index) => (
                            <div
                              onClick={async () => {
                                window.location.replace(
                                  `/translate/main/viewer/${doc.docsId}`
                                );
                              }}
                              key={index}
                              className="cursor-pointer py-2.5 flex justify-between items-center border-b border-[#E0DED9] hover:bg-[#F5F4F0] transition-colors duration-200"
                            >
                              <span className="text-[#7E7C77]">
                                {doc.documentName}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Sidebar.Item>
                    <Sidebar.Item className="dark:hover:bg-transparent">
                      {localStorage.getItem("token") && (
                        <div className="flex-1 overflow-y-auto">
                          <div
                            className="px-2 py-2.5 mb-2 flex items-center hover:bg-[#F5F4F0] cursor-pointer transition-colors duration-200"
                            onClick={handleToggleNotificationModal}
                            alt="알림 아이콘"
                          >
                            <Bell className="w-6 h-6 text-[#7E7C77]" />
                            <span className="ml-5 font-medium text-[#7E7C77]">
                              알림
                            </span>
                          </div>
                          {createPortal(
                            <div
                              className={`absolute transition-all top-110 left-2 duration-300 z-[1600] transform ${
                                isNotificationModalOpen
                                  ? "opacity-100 translate-y-0"
                                  : "opacity-0 -translate-y-2 pointer-events-none"
                              }`}
                            >
                              <NotificationModal />
                            </div>,
                            document.body
                          )}
                        </div>
                      )}
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item className="dark:hover:bg-transparent">
                      {localStorage.getItem("token") && (
                        <div className="flex-1 overflow-y-auto">
                          <div className="px-2 py-2.5 mb-2 w-full flex items-center hover:bg-[#F5F4F0] transition-colors duration-200">
                            <StickyNote className="w-6 h-6 text-[#7E7C77]" />
                            <span className="ml-5 font-medium text-[#7E7C77]">
                              메모장
                            </span>
                            <Plus
                              onClick={() => handleOpenCreateModal(openModal)}
                              className="cursor-pointer w-6 h-6 text-[#7E7C77] hover:text-[#4A4A4A] ml-auto"
                            />
                          </div>
                          <div className="px-2">
                            {Array.isArray(memos) && memos.length === 0 ? (
                              <p className="text-[#7E7C77] text-xs sm:text-sm">
                                작성된 메모가 없습니다.
                              </p>
                            ) : (
                              Array.isArray(memos) &&
                              memos.slice(0, 3).map((memo, index) => (
                                <div
                                  key={index}
                                  className="py-2.5 flex justify-between items-center border-b border-[#E0DED9] hover:bg-[#F5F4F0] transition-colors duration-200"
                                >
                                  <span className="sm:w-25 md:w-36 text-[#7E7C77] break-all break-words overflow-wrap break-words overflow-wrap line-clamp-1 text-xs sm:text-sm">
                                    {memo.title}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleOpenEditModal(memo, openModal)
                                    }
                                    className="text-[#7E7C77] hover:text-[#4A4A4A] underline cursor-pointer text-xs sm:text-sm transition-colors duration-200"
                                  >
                                    보기
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
      <div className="absolute z-[3000]">
        <MemoModal
          title={memoData ? "메모 수정" : "새 메모"}
          buttonText={memoData ? "수정 완료" : "작성 완료"}
          onSubmit={memoData ? handleEditMemo : handleCreateMemo}
          isOpen={isOpen}
          closeModal={closeModal}
          memoData={memoData}
          onDelete={memoData ? handleDeleteMemo : null}
        />
      </div>
      <div className="absolute z-[3000]">
        {isAlertOpen && (
          <ConfirmModal
            message={{ title: "정말로 메모를 삭제하시겠습니까?" }}
            onConfirm={confirmDeleteMemo}
            onCancel={toggleAlert}
          />
        )}
      </div>
    </div>
  );
};

export default LeftNav;
