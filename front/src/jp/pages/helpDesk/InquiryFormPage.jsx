import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useUserProfileStore from "../../../store/myPageStore/userProfileStore";
import useAuthStore from "../../../store/authStore";
import InquiryService from "../../../services/helpDeskServices/inquiryService";
import LodingImage from "../../../assets/loading.gif";
import UseFileTypeCheck from "../../../hooks/useFileTypeCheck";
import _ from "lodash";

const InquiryFormPage = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [tmpFile, setTmpFile] = useState(null); // 임시 파일 상태
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { profile } = useUserProfileStore();
  const { token } = useAuthStore();
  const fileInputRef = useRef(null);
  const { validateImageFile, isValidating, error } = UseFileTypeCheck();

  useEffect(() => {
    if (profile && profile.email) {
      setEmail(profile.email);
    }
  }, [profile]);

  useEffect(() => {
    if (!token) {
      setEmail("");
    }
  }, [token]);

  const convertWhiteSpace = (content) => {
    return content.replace(/\n/g, "\r\n"); // 개행 문자 정규화
  };

  const MAX_TITLE_LENGTH = 50;
  const MAX_CONTENT_LENGTH = 2000;

  // 폼 제출 (debounce 제거)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!category || !title.trim() || !email || !content.trim()) {
      toast.info("お問い合わせのカテゴリ, タイトル, メールアドレス, 内容をすべて入力してください。", {
        toastId: "required",
      });
      setLoading(false);
      return;
    }

    // 이메일 도메인에 "github"가 포함된 경우 제출 차단
    const emailParts = email.split("@");
    if (
      emailParts.length > 1 &&
      emailParts[1].toLowerCase().includes("github")
    ) {
      toast.info("無効なメールアドレスです。", {
        toastId: "invalidEmail",
      });
      setLoading(false);
      return;
    }

    let userId = null;
    const tokenFromLocal = localStorage.getItem("token");
    if (tokenFromLocal) {
      const decodedToken = jwtDecode(tokenFromLocal);
      userId = decodedToken.userId;
    }

    const formattedContent = convertWhiteSpace(content);

    if (formattedContent.length > MAX_CONTENT_LENGTH) {
      toast.info(`内容は${MAX_CONTENT_LENGTH}文字以内で入力してください。`, {
        toastId: "contentLength",
      });
      setLoading(false);
      return;
    }

    const inquiry = {
      title: title.trim(),
      category,
      content: formattedContent.trim(),
      email,
    };

    if (userId) {
      inquiry.userId = userId;
    }

    const formData = new FormData();
    formData.append(
      "inquiry",
      new Blob([JSON.stringify(inquiry)], { type: "application/json" })
    );
    if (file) {
      formData.append("file", file);
    }

    const response = await InquiryService.submitInquiry(formData);
    setCategory("");
    setTitle("");
    if (profile && profile.email) {
      setEmail(profile.email);
    } else {
      setEmail("");
    }
    setContent("");
    setFile(null);
    if (response) {
      toast.success("お問い合わせが成功裏に提出されました。", {
        toastId: "submitSuccess",
      });
    }
    setLoading(false);
  };

  // 파일 용량 제한 및 형식 체크
  const MAX_FILE_SIZE = 10 * 1000 * 1000;
  const handleFileChange = _.debounce(async (e) => {
    const selectedFile = e.target.files[0];

    const isValid = await validateImageFile(selectedFile);

    if (!isValid) {
      toast.warn("画像ファイルのみアップロードできます。", {
        toastId: "invalidFileType",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.warn("ファイルサイズは最大10MBまでアップロード可能です。", {
          toastId: "fileSizeLimit",
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
    }
  }, 300);

  const handleFileCancel = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 md:p-10 bg-white rounded-bl-xl rounded-br-xl border border-[#E1E1DF] text-[#7D7C77] mb-5">
      <form onSubmit={handleSubmit}>
        {/* 문의 카테고리 */}
        <div className="mb-6">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            お問い合わせのカテゴリ <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
          >
            <option value="">カテゴリを選択してください</option>
            <option value="DOCUMENT_REQUEST">文書登録リクエスト</option>
            <option value="MEMBER">会員関連</option>
            <option value="REPORT">報告関連</option>
          </select>
        </div>
        {/* 제목 */}
        <div className="mb-4">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) =>
              e.target.value.length <= MAX_TITLE_LENGTH &&
              setTitle(e.target.value)
            }
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
            placeholder="タイトルを入力してください"
          />
          <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
            {title.length} / {MAX_TITLE_LENGTH}
          </p>
        </div>
        {/* 이메일 */}
        <div className="mb-6">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            メールアドレス <span className="text-red-500">*</span>{" "}
            <span className="text-xs text-gray-500 mt-1 mr-2">
              メールアドレスを誤って入力した場合、メールが送信されない可能性があります。
            </span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                setEmail(e.target.value);
              }
            }}
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
            placeholder="メールアドレスを入力してください"
          />
        </div>
        {/* 内容 */}
        <div className="mb-4">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) =>
              convertWhiteSpace(e.target.value).length <= MAX_CONTENT_LENGTH &&
              setContent(e.target.value)
            }
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
            placeholder="内容を入力してください"
            style={{ height: "200px", resize: "none" }}
          ></textarea>
          <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
            {convertWhiteSpace(content).length} / {MAX_CONTENT_LENGTH}
          </p>
        </div>
        {/* 사진 첨부 */}
        <div className="mb-6">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            写真添付 (1つのみ可能)
          </label>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm text-center hover:bg-[#C96442] text-xs md:text-sm cursor-pointer">
                写真を選択
              </div>
            </div>
            {!file && (
              <p className="ml-4 text-xs md:text-sm text-gray-500">
                添付する写真を選択してください
              </p>
            )}
            {file && (
              <div className="ml-4 flex items-center">
                <p className="text-xs md:text-sm text-gray-500 mr-2 truncate max-w-md">
                  {file.name}
                </p>
                <button
                  type="button"
                  onClick={handleFileCancel}
                  className="py-1 px-2 hover:text-red-600 text-xs md:text-sm underline cursor-pointer"
                >
                  削除
                </button>
              </div>
            )}
          </div>
        </div>
        {/* 제출 버튼 */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm hover:bg-[#C96442] cursor-pointer text-xs md:text-sm"
          >
            送信
          </button>
        </div>
      </form>

      {loading && (
        <div className="fixed inset-0 bg-opacity-50 flex flex-col justify-center items-center z-50 backdrop-brightness-80">
          <img src={LodingImage} alt="ローディング中" />
        </div>
      )}
    </div>
  );
};

export default InquiryFormPage;
