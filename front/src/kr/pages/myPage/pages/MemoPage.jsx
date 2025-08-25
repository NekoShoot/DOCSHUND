import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import MemoList from "../components/MemoList";
import MemoModal from "../components/MemoModal";
import modalStore from "../../../store/myPageStore/myPageModalStore";
import useMemoStore from "../../../store/myPageStore/memoStore";
import memoService from "../services/memoService";
import ListPagination from "../../../components/pagination/listPagination";
import ConfirmModal from "../../../components/alertModal/confirmModal";
import useAlertStore from "../../../store/alertStore";
// lodash debounce 제거 (또는 꼭 필요하면 옵션 변경 후 useCallback 사용)

const MemoPage = () => {
  const token = localStorage.getItem("token");

  const { isOpen, openId, openModal, closeModal, setOpenId } = modalStore();
  const { isAlertOpen, toggleAlert, resetAlert } = useAlertStore();
  const { memos, setMemos, setIsLoading, setError, updateMemo, deleteMemo } =
    useMemoStore();
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentData, setCurrentData] = useState([]);
  const [memoToDelete, setMemoToDelete] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const pageSize = 15;

  useEffect(() => {
    closeModal();
    resetAlert();
  }, []);

  useEffect(() => {
    const fetchMemos = async (userId) => {
      try {
        const data = await memoService.fetchMemos(userId);
        if (data) {
          setMemos(data.reverse());
        } else {
          setMemos([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setHasFetched(true);
      }
    };

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      fetchMemos(userId);
    }
  }, [token, setMemos, setIsLoading, setError]);

  useEffect(() => {
    if (memos.length > 0) {
      const startIndex = currentPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, memos.length);
      const newTotalPages = Math.ceil(memos.length / pageSize);

      setTotalPages(newTotalPages);
      setCurrentData(memos.slice(startIndex, endIndex));
    } else {
      setTotalPages(0);
      setCurrentData([]);
    }
  }, [memos, currentPage, pageSize]);

  // debounce 제거한 삭제 함수
  const handleDeleteMemo = useCallback(
    (memoId) => {
      setMemoToDelete(memoId);
      toggleAlert();
    },
    [toggleAlert]
  );

  const confirmDeleteMemo = useCallback(async () => {
    if (userId && memoToDelete) {
      try {
        await memoService.deleteMemo(userId, memoToDelete);
        deleteMemo(memoToDelete);
      } catch (error) {
        // 오류 처리
      } finally {
        setMemoToDelete(null);
        closeModal();
        toggleAlert();
      }
    }
  }, [userId, memoToDelete, closeModal, toggleAlert, deleteMemo]);

  const handleCreateMemo = useCallback(
    async (memoData) => {
      if (userId) {
        try {
          await memoService.createMemo(userId, memoData);
          const data = await memoService.fetchMemos(userId);
          setMemos(data ? data.reverse() : []);
          closeModal();
        } catch (error) {
          // 오류 처리
        }
      }
    },
    [userId, setMemos, closeModal]
  );

  const handleEditMemo = useCallback(
    async (memoId, memoData) => {
      if (userId) {
        try {
          await memoService.updateMemo(userId, memoId, memoData);
          const data = await memoService.fetchMemos(userId);
          setMemos(data ? data.reverse() : []);
          closeModal();
        } catch (error) {
          // 오류 처리
        }
      }
    },
    [userId, setMemos, closeModal]
  );

  const handleOpenModal = async (memoId) => {
    if (memoId) {
      try {
        const detailedMemo = await memoService.fetchMemo(userId, memoId);
        if (detailedMemo) {
          updateMemo(memoId, detailedMemo);
        }
      } catch (error) {
        // 오류 처리
      }
    }
    setOpenId(memoId);
    openModal();
  };

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">메모장</h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="border-box bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 text-[#ffffff] hover:bg-[#C96442] cursor-pointer"
        >
          + 새메모
        </button>
      </div>
      <MemoList
        memos={currentData || []}
        onEditMemo={handleOpenModal}
        onDeleteMemo={handleDeleteMemo}
        hasFetched={hasFetched}
      />
      {totalPages > 0 && (
        <ListPagination
          totalPages={totalPages}
          currentPage={currentPage + 1}
          setCurrentPage={setCurrentPage}
        />
      )}
      <MemoModal
        title={openId ? "메모 수정" : "새 메모"}
        buttonText={openId ? "수정 완료" : "완료"}
        isOpen={isOpen}
        closeModal={closeModal}
        onSubmit={openId ? handleEditMemo : handleCreateMemo}
        memoData={memos ? memos.find((memo) => memo.memoId === openId) : null}
        onDelete={openId ? handleDeleteMemo : null}
      />
      {isAlertOpen && (
        <ConfirmModal
          message={{ title: "정말로 메모를 삭제하시겠습니까?" }}
          onConfirm={confirmDeleteMemo}
          onCancel={toggleAlert}
        />
      )}
    </div>
  );
};

export default MemoPage;
