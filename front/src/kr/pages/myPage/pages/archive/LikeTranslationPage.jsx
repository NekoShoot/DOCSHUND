import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useOutletContext } from "react-router-dom";
import useKoreanTime from "../../../../hooks/useKoreanTime";

import TranslationStore from "../../../../store/myPageStore/translationStore";
import LikeTranslationService from "../../services/likeTranslationService";
import { fetchTranslateData } from "../../../translate/services/translateGetService";
import ListRender from "../../../../components/pagination/listRender";
import TranslationModal from "../../components/TranslationModal";
import modalStore from "../../../../store/modalStore";

import like from "../../../../assets/icon/heartFilled24.png";
import likeCancel from "../../../../assets/icon/heartEmpty24.png";

const LikeTranslationPage = () => {
  const { handleLikeToggle } = useOutletContext();
  const { convertToKoreanTime } = useKoreanTime();
  const token = localStorage.getItem("token");

  const likeTranslations = TranslationStore((state) => state.likeTranslations);
  const setLikeTranslations = TranslationStore(
    (state) => state.setLikeTranslations
  );
  const setLoading = TranslationStore((state) => state.setLoading);
  const setError = TranslationStore((state) => state.setError);

  const { setOpenId, openId, closeModal } = modalStore();

  const [currentDocsPart, setCurrentDocsPart] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    closeModal();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchTranslations = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const data = await LikeTranslationService.fetchTranslations(userId);
          if (data.length > 0) {
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLikeTranslations(data);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTranslations();
  }, [token]);

  useEffect(() => {
    if (likeTranslations.length > 0) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = Math.min(
        startIndex + itemsPerPage,
        likeTranslations.length
      );
      const newTotalPages = Math.ceil(likeTranslations.length / itemsPerPage);
      setTotalPages(newTotalPages);
      setCurrentData(likeTranslations.slice(startIndex, endIndex));
    }
  }, [likeTranslations, currentPage, itemsPerPage]);

  const fetchDocsPart = async (docsId, originId) => {
    const data = await fetchTranslateData(docsId, originId);
    setCurrentDocsPart(data.content);
  };

  const handleLikeClick = async (item) => {
    await handleLikeToggle("trans", item.docsId, item.transId);
    setLikedItems((prev) => ({
      ...prev,
      [item.transId]: !prev[item.transId],
    }));
  };

  const renderTranslation = (item) => (
    <div key={item.transId} className="flex-col">
      <div className="flex justify-between px-3">
        <div
          className={`flex-1 min-w-0 break-all break-words overflow-wrap mr-3 ${
            openId === item.transId ? "" : "line-clamp-1"
          } text-xs sm:text-sm md:text-base lg:text-lg`}
        >
          <h3
            onClick={async () => {
              await fetchDocsPart(item.docsId, item.originId);
              setOpenId(item.transId === openId ? null : item.transId);
            }}
            className="cursor-pointer font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-[#7d7c77] hover:text-[#bc5b39] line-clamp-1"
          >
            {item.documentName} {item.pOrder}번째 문단 번역본
          </h3>
        </div>
        <div className="flex space-x-4 sm:space-x-6 items-center">
          <p className="whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg">
            {convertToKoreanTime(item.createdAt)}
          </p>
          <button onClick={() => handleLikeClick(item)}>
            <img
              src={likedItems[item.transId] ? likeCancel : like}
              alt="좋아요 아이콘"
              className="w-6 h-6 cursor-pointer"
            />
          </button>
        </div>
      </div>
      {item.transId === openId && (
        <TranslationModal
          isOpen={true}
          item={item}
          docsPart={currentDocsPart}
          closeModal={closeModal}
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">관심 번역본</h1>
      </div>
      <div className="bg-white rounded-tl-xl rounded-tr-xl border-t border-l border-r border-[#E1E1DF] pt-4 pl-6"></div>
      <div className="p-4 sm:p-6 lg:p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
        <ListRender
          data={currentData}
          renderItem={renderTranslation}
          totalPages={likeTranslations.length > 0 ? totalPages : 0}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCategory={"trans"}
        />
      </div>
    </div>
  );
};

export default LikeTranslationPage;
