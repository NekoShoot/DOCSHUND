import propTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";
import ReplyItemService from "../services/replyItemService";
import RectBtn from "../../../components/button/rectBtn";
import ArticleItemService from "../services/articleItemService";

const ReplyTextarea = ({ reCommentFlag, commentId }) => {
  const { articleId } = useParams();
  const [replyContent, setReplyContent] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const commentCount = communityArticleStore((state) => state.commentCount);
  const setCommentCount = communityArticleStore(
    (state) => state.setCommentCount
  );
  const setIsReplied = communityArticleStore((state) => state.setIsReplied);

  const convertWhiteSpace = (content) => {
    return content.replace(/\n/g, "\r\n"); // 개행 문자 정규화
  };

  // Debounced submit handler
  const debouncedSubmit = useCallback(
    debounce(async (content, isReComment, commentId) => {
      setLoading(true);
      if (!content.trim()) {
        toast.warn("댓글을 입력해주세요.", {
          toastId: "emptyReply",
        });
        setLoading(false);
        return;
      }

      try {
        const formattedContent = convertWhiteSpace(content); // 개행 문자 정규화

        if (isReComment) {
          await ReplyItemService.postReReplyItem(
            articleId,
            commentId,
            formattedContent.trim()
          );
        } else {
          await ReplyItemService.postReplyItem(
            articleId,
            formattedContent.trim()
          );
        }

        const resData = await ArticleItemService.fetchArticleItem(articleId);
        if (resData) {
          setCommentCount(resData.commentCount);
        }

        setReplyContent("");
        setContentLength(0);
        setIsReplied((prev) => !prev);
        setLoading(false);
      } catch (error) {
        toast.error("댓글 작성에 실패했습니다.", {
          toastId: "failedReply",
        });
        setLoading(false);
        return error;
      }
    }, 300),
    [articleId, setIsReplied]
  );

  // 즉시 상태를 업데이트하는 함수
  const updateContent = (value) => {
    if (convertWhiteSpace(value).length > 500) {
      toast.warn("댓글은 500자 이내로 작성해주세요.", {
        toastId: "exceedReply",
      });
      return;
    }
    setReplyContent(value);
    setContentLength(convertWhiteSpace(value).length);
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, [debouncedSubmit]);

  const handleSubmit = () => {
    debouncedSubmit(replyContent, reCommentFlag, commentId);
  };

  const handleOnChange = (e) => {
    updateContent(e.target.value);
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col gap-3">
        <textarea
          value={replyContent}
          onChange={handleOnChange}
          placeholder="댓글을 입력해주세요."
          className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        ></textarea>
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              contentLength > 500 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {contentLength} / 500자
          </span>
          <button disabled={isLoading}>
            <RectBtn
              onClick={handleSubmit}
              text="댓글 작성"
              className="w-28 h-10 text-sm"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

ReplyTextarea.propTypes = {
  reCommentFlag: propTypes.bool,
  commentId: propTypes.number,
};

export default ReplyTextarea;
