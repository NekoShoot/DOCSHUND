import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import likeDocsService from "../../services/likeDocsService";
import ListRender from "../../../../components/pagination/listRender";
import likeDocsStore from "../../../../store/myPageStore/likeDocsStore";

import like from "../../../../assets/icon/heartFilled24.png";
import likeCancel from "../../../../assets/icon/heartEmpty24.png";

const LikeDocsPage = () => {
  const token = localStorage.getItem("token");
  const { handleLikeToggle } = useOutletContext();

  const docs = likeDocsStore((state) => state.docs);
  const setDocs = likeDocsStore((state) => state.setDocs);
  const setLoading = likeDocsStore((state) => state.setLoading);
  const setError = likeDocsStore((state) => state.setError);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    setLoading(true);
    const fetchDocs = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const data = await likeDocsService.fetchDocs(userId);
          if (data.length > 0) {
            setDocs(data);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [token]);

  useEffect(() => {
    if (docs.length > 0) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, docs.length);
      const newTotalPages = Math.ceil(docs.length / itemsPerPage);
      setTotalPages(newTotalPages);
      setCurrentData(docs.slice(startIndex, endIndex));
    }
  }, [docs, currentPage, itemsPerPage]);

  const handleLikeClick = async (item) => {
    await handleLikeToggle("docs", item.docsId);
    setLikedItems((prev) => ({
      ...prev,
      [item.docsId]: !prev[item.docsId],
    }));
  };

  const renderDocs = (item) => (
    <div className="flex justify-between items-center text-sm sm:text-base md:text-lg px-3">
      <div className="flex-1 min-w-0 mr-3 font-semibold line-clamp-1 break-all break-words overflow-wrap text-sm sm:text-base md:text-lg">
        <Link
          to={`/translate/main/viewer/${item.docsId}`}
          className="text-[#7d7c77] hover:text-[#bc5b39]"
        >
          {item.documentName}
        </Link>
      </div>
      <div className="flex space-x-4 sm:space-x-6">
        <p className="whitespace-nowrap text-xs sm:text-sm md:text-base">
          {item.position}
        </p>
        <button onClick={() => handleLikeClick(item)}>
          <img
            src={likedItems[item.docsId] ? likeCancel : like}
            alt="좋아요 아이콘"
            className="w-6 h-6 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">관심 문서</h1>
      </div>
      <div className="bg-white rounded-tl-xl rounded-tr-xl border-t border-l border-r border-[#E1E1DF] pt-4 pl-6"></div>
      <div className="p-4 sm:p-6 lg:p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
        <ListRender
          data={currentData}
          renderItem={renderDocs}
          totalPages={docs.length > 0 ? totalPages : 0}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCategory="docs"
        />
      </div>
    </div>
  );
};

export default LikeDocsPage;
