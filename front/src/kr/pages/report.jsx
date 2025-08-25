import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { toast } from "react-toastify";
import ReportStore from "../store/reportStore";
import ReportService from "../services/reportService";
import { X } from "lucide-react";
import UseFileTypeCheck from "../hooks/useFileTypeCheck";
import _ from "lodash";

const ReportModal = () => {
  const {
    originContent,
    reportedUser,
    commentId,
    articleId,
    transId,
    chatId,
    isReportOpen,
    closeReport,
    toggleReport,
  } = ReportStore();

  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [tmpFile, setTmpFile] = useState(null); // 임시 파일 상태
  const [isSelected, setIsSelected] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { validateImageFile, isValidating, error } = UseFileTypeCheck();

  const MAX_CONTENT_LENGTH = 500;
  const MAX_FILE_SIZE = 10 * 1000 * 1000; // 10MB

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isReportOpen) {
      setCategory("");
      setContent("");
      setFile(null);
      setIsSelected(true);
      setIsSubmitting(false);
    }
  }, [isReportOpen]);

  const convertWhiteSpace = (content) => {
    return content.replace(/\n/g, "\r\n"); // 개행 문자 정규화
  };

  // 신고 제출 처리 (debounce 제거)
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(category, content);

    // 필수 필드 확인
    if (!category || !content.trim()) {
      toast.warn("신고 카테고리, 내용을 모두 입력해주세요.", {
        toastId: "report-warning",
      });
      setIsSubmitting(false);
      return;
    }

    // 토큰에서 userId 추출
    let userId = null;
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    }

    // 신고 객체 구성
    const formattedContent = convertWhiteSpace(content);

    if (formattedContent.length > MAX_CONTENT_LENGTH) {
      toast.info(`글 내용은 ${MAX_CONTENT_LENGTH}자 이하로 작성해주세요.`, {
        toastId: "contentLength",
      });
      return;
    }

    const report = {
      category,
      content: formattedContent,
      originContent,
      reportedUser,
      commentId,
      articleId,
      transId,
      chatId,
    };

    if (userId) {
      report.userId = userId;
    }

    // FormData 구성
    const formData = new FormData();
    formData.append(
      "report",
      new Blob([JSON.stringify(report)], { type: "application/json" })
    );
    if (file) {
      formData.append("file", file);
    }

    const response = await ReportService.submitReport(formData);
    if (response) {
      toast.success("신고가 성공적으로 제출되었습니다.", {
        toastId: "report-success",
      });
      // 신고 성공 시 상태 초기화
      setCategory("");
      setContent("");
      setFile(null);
      // 모달 닫기
      toggleReport();
      closeReport();
    }
    setIsSubmitting(false);
  };

  const handleFileChange = _.debounce(async (e) => {
    const selectedFile = e.target.files[0];

    const isValid = await validateImageFile(selectedFile);

    if (!isValid) {
      toast.warn("이미지 파일만 업로드 가능합니다.", {
        toastId: "file-warning",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.warn("파일 크기는 최대 10MB까지 업로드 가능합니다.", {
        toastId: "file-warning",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (selectedFile === tmpFile) {
      setFile(selectedFile);
      return;
    }

    setTmpFile(selectedFile);
    setFile(selectedFile);
  }, 300);

  const handleFileCancel = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AnimatePresence>
      {isReportOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[2200] w-full h-full backdrop-brightness-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <motion.div
            key="editor-modal"
            className="fixed inset-0 flex items-center justify-center min-w-full min-h-full"
          >
            <div className="p-6 bg-white h-fit rounded-xl border border-[#E1E1DF] text-[#7D7C77] mb-5 min-w-[400px]">
              <div className="w-full flex justify-end items-center">
                <button
                  onClick={() => {
                    closeReport();
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-800" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-lg font-medium text-black mb-2">
                    신고 카테고리 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                  >
                    {isSelected && (
                      <option value="">카테고리를 선택하세요</option>
                    )}
                    <option
                      onClick={() => setIsSelected(false)}
                      value="ABUSIVE_LANGUAGE_OR_VIOLENCE"
                    >
                      욕설 및 폭력성
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="EXPLICIT_OR_ILLEGAL_CONTENT"
                    >
                      음란물 및 불법 콘텐츠
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="PROMOTING_GAMBLING"
                    >
                      사행성 조장
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="SPAM_OR_ADVERTISING"
                    >
                      스팸 및 광고
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="FLOODING"
                    >
                      도배
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="PERSONAL_INFORMATION_EXPOSURE"
                    >
                      개인정보 노출
                    </option>
                    <option value="COPYRIGHT_INFRINGEMENT">저작권 침해</option>
                    <option value="OTHER">기타</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium text-black mb-2">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) =>
                      convertWhiteSpace(e.target.value).length <=
                        MAX_CONTENT_LENGTH && setContent(e.target.value)
                    }
                    className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                    placeholder="내용을 입력하세요"
                    style={{ height: "250px", resize: "none" }}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
                    {convertWhiteSpace(content).length} / {MAX_CONTENT_LENGTH}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm text-center cursor-pointer hover:bg-[#C96442] text-sm whitespace-nowrap">
                        사진 선택
                      </div>
                    </div>
                    {!file && (
                      <p className="ml-4 flex-1 text-sm text-gray-500 w-[8vw]">
                        첨부할 사진을 선택하세요
                      </p>
                    )}
                    {file && (
                      <div className="ml-4 flex-1 flex items-center w-[8vw]">
                        <p className="text-sm line-clamp-1 text-gray-500 mr-2">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={handleFileCancel}
                          className="py-1 px-2 hover:text-red-600 shrink-0 text-sm underline"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm hover:bg-[#C96442] cursor-pointer ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    신고하기
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
