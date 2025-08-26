import { useState } from "react";

const useMemoMode = () => {
  const [memoData, setMemoData] = useState(null);

  const handleOpenCreateModal = (openModal) => {
    setMemoData(null);
    openModal();
  };

  const handleOpenEditModal = (memo, openModal) => {
    setMemoData(memo);
    openModal();
  };

  return {
    memoData,
    handleOpenCreateModal,
    handleOpenEditModal,
  };
};

export default useMemoMode;
