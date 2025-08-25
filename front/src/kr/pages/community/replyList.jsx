import { useState } from "react";
import PropTypes from "prop-types";

import communityArticleStore from "../../store/communityStore/communityArticleStore";
import ReplyHeader from "./components/replyHeader";
import ReplyItemArea from "./components/replyItemArea";
import ReplyTextarea from "./components/replyTextarea";
import { div } from "motion/react-client";
import { set } from "lodash";

/* INFO: 
  1. 대댓글 여부를 확인해 api 호출 시 다르게 처리
  2. 댓글 작성 시 댓글 리스트 리렌더링할 수 있게 하기
  3. textarea는 로그인한 회원만, 하나만 보여주기 <- 대댓글 달기를 하면 다른 곳에 textarea가 보이지 않게 하기 위함  
*/

const ReplyList = () => {
  const token = localStorage.getItem("token");
  const [reCommentFlag, setReCommentFlag] = useState(false); // 대댓글 작성 여부를 알기 위한 flag

  const replyId = communityArticleStore((state) => state.replyId);
  const setReplyId = communityArticleStore((state) => state.setReplyId);
  const setIsReplied = communityArticleStore((state) => state.setIsReplied);

  const handleRefreshClick = () => {
    setReplyId(0);
    setReCommentFlag(false);
    setIsReplied((prev) => !prev);
  };

  return (
    <div className="mt-6 bg-white rounded-lg border border-[#E1E1DF] p-6">
      {/* 댓글 헤더 */}
      <ReplyHeader />

      <div className="border-b border-[#E1E1DF]"></div>
      {/* 댓글 리스트는 여기에 구현 */}
      <ReplyItemArea
        reCommentFlag={reCommentFlag} // 대댓글 작성 여부를 알기 위한 flag
        setReCommentFlag={setReCommentFlag}
      />

      {/* 댓글 쓰기 창 */}
      {/* 로그인 한 회원만 보여주기 */}
      <div>
        {/* <button
          className="mt-4 text-[#7d7c77] flex justify-self-end items-center underline text-sm cursor-pointer"
          onClick={handleRefreshClick}
        >
          게시글에 댓글 달기
        </button> */}
        {token && (
          <ReplyTextarea
            reCommentFlag={reCommentFlag}
            commentId={0} // 대댓글 작성 시 대댓글을 작성하는 원댓글의 id. 원댓글 작성 시 사용X
          />
        )}
      </div>
    </div>
  );
};

ReplyList.propTypes = {
  replyCount: PropTypes.number,
};

export default ReplyList;
