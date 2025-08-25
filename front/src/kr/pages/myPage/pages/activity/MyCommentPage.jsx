import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import useKoreanTime from "../../../../hooks/useKoreanTime";

import MyCommentService from "../../services/myCommentService";
import myCommentStore from "../../../../store/myPageStore/myCommentStore";
import ListRender from "../../../../components/pagination/listRender";
import { div } from "motion/react-client";

const MyCommentPage = () => {
  const token = localStorage.getItem("token");
  const { convertToKoreanTime } = useKoreanTime();

  const comments = myCommentStore((state) => state.comments);
  const setComments = myCommentStore((state) => state.setComments);
  const setLoading = myCommentStore((state) => state.setLoading);
  const setError = myCommentStore((state) => state.setError);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchComments = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const data = await MyCommentService.fetchComments(userId);
          if (data.length > 0) {
            setComments(data);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [token]);

  useEffect(() => {
    if (comments.length > 0) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, comments.length);
      const newTotalPages = Math.ceil(comments.length / itemsPerPage);
      setTotalPages(newTotalPages);
      setCurrentData(comments.slice(startIndex, endIndex));
    }
  }, [comments, currentPage, itemsPerPage]);

  const renderComment = (item) => (
    <div className="flex justify-between text-sm sm:text-base md:text-lg px-3">
      <div className="flex-1 min-w-0 mr-3 font-semibold line-clamp-1 break-all break-words overflow-wrap text-xs sm:text-sm md:text-base">
        <Link
          to={`/community/article/${item.articleId}`}
          className="text-[#7d7c77] hover:text-[#bc5b39] break-all break-words overflow-wrap"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.content}
        </Link>
      </div>
      <p className="whitespace-nowrap text-xs sm:text-sm md:text-base">
        {convertToKoreanTime(item.createdAt)}
      </p>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">나의 댓글</h1>
      </div>
      <div className="bg-white rounded-tl-xl rounded-tr-xl border-t border-l border-r border-[#E1E1DF] pt-4 pl-6"></div>
      <div className="p-4 sm:p-6 lg:p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
        <ListRender
          data={currentData}
          renderItem={renderComment}
          totalPages={comments.length > 0 ? totalPages : 0}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCategory="comment"
        />
      </div>
    </div>
  );
};

export default MyCommentPage;
