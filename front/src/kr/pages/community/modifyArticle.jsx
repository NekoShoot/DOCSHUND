import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import _, { set } from "lodash";

// store
import communityArticleStore from "../../store/communityStore/communityArticleStore";
import docsCategoryStore from "../../store/docsCategoryStore";
import useEditorStore from "../../store/translateStore/editorStore";

// components
import CommunityHeader from "./components/communityHeader";
import EditorContent from "../translate/components/godEditorContent";
import ArticleItemService from "./services/articleItemService";
import UseFileTypeCheck from "../../hooks/useFileTypeCheck";

const ModifyArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { validateImageFile, isValidating, error } = UseFileTypeCheck();
  const fileInputRef = useRef(null);
  const MAX_TITLE_LENGTH = 50;

  // store에서 기존 게시글 데이터 및 메소드 불러오기
  const articleItems = communityArticleStore((state) => state.articleItems);
  const setArticleItems = communityArticleStore(
    (state) => state.setArticleItems
  );

  // 수정 시 로컬 상태 (기존 데이터가 들어감)
  const [title, setTitle] = useState(""); // 제목 상태
  const [mainCategory, setMainCategory] = useState(articleItems.position); // 대분류 선택 상태
  const [subCategory, setSubCategory] = useState(articleItems.documentName); // 소분류 선택 상태
  const [file, setFile] = useState(null); // 첨부 파일 상태
  const [tmpFile, setTmpFile] = useState(null); // 임시 파일 상태
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태
  const [content, setContent] = useState(articleItems.content); // 내용 상태
  const [isLoading, setLoading] = useState(false); // 로딩 상태

  const documentNames = docsCategoryStore((state) => state.documentNames);
  const setFileUrl = communityArticleStore((state) => state.setFileUrl);
  const currentUserText = useEditorStore((state) => state.currentUserText);
  const setCurrentUserText = useEditorStore(
    (state) => state.setCurrentUserText
  );

  // 게시글 데이터를 불러와서 로컬 상태 업데이트
  useEffect(() => {
    const loadArticleData = async () => {
      // console.log("articleItems", articleItems);

      try {
        // articleItems가 비어있거나 현재 articleId와 다른 경우에만 데이터를 새로 불러옵니다
        if (!articleItems?.articleId && articleItems.articleId !== articleId) {
          const data = await ArticleItemService.fetchArticleItem(articleId);
          setArticleItems(data); // store에 데이터 저장

          // console.log("data", data);

          if (data) {
            // 로컬 상태 업데이트
            setTitle(data.title);
            setMainCategory(data.position);
            setSubCategory(data.documentName);
            setContent(data.content);
            setCurrentUserText(data.content);
          }
        } else {
          // store에 있는 데이터 사용
          setTitle(articleItems.title);
          setMainCategory(articleItems.position);
          setSubCategory(articleItems.documentName);
          setContent(articleItems.content);
          setCurrentUserText(articleItems.content);
        }
      } catch (error) {
        // console.error("Failed to load article:", error);
        toast.error("게시글을 불러오는데 실패했습니다.", {
          toastId: "error",
        });
      }
    };

    loadArticleData();
  }, [articleId]);

  const convertWhiteSpace = (content) => {
    return content.replace(/\n/g, "\r\n"); // 개행 문자 정규화
  };

  // 제목 입력 핸들러
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // 대분류 선택 핸들러
  const handleMainCategoryChange = (e) => {
    const selectedMain = e.target.value;
    setMainCategory(selectedMain);
    setSubCategory(""); // 대분류 변경 시 소분류 초기화
  };

  // 소분류 선택 핸들러
  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
  };

  // 파일 첨부 핸들러 (debounce)
  const handleFileChange = _.debounce(async (e) => {
    const selectedFile = e.target.files[0];

    const isValid = await validateImageFile(selectedFile);

    if (!isValid) {
      toast.warn("이미지 파일만 업로드 가능합니다.", {
        toastId: "invalid",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (selectedFile) {
      if (selectedFile.size > 10 * 1000 * 1000) {
        toast.info("사진 크기는 최대 10MB까지 업로드 가능합니다.", {
          toastId: "size",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const response = await ArticleItemService.uploadImageFile(selectedFile);

      if (
        convertWhiteSpace(response.data.imageUrl).length +
          convertWhiteSpace(currentUserText).length >
        15000
      ) {
        toast.info("글 내용은 15000자 이하로 작성해주세요.", {
          toastId: "contentLength",
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

      setFile(selectedFile);
      setTmpFile(selectedFile);
      setImageUrl(response.data.imageUrl);
    }
  }, 300);

  // 파일 첨부 취소
  const handleFileCancel = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
  };

  // 실제 제출 로직을 별도 함수로 분리
  const submitArticle = useCallback(
    _.debounce(async () => {
      try {
        const content = currentUserText;
        setLoading(true);
        // 제목, 대분류, 소분류, 내용, 파일이 모두 입력되었는지 확인
        if (!title.trim() || !mainCategory || !subCategory || !content.trim()) {
          toast.warn("모든 항목을 입력해주세요.", {
            toastId: "required",
          });
          setLoading(false);
          return;
        } else {
          const formattedContent = convertWhiteSpace(content); // 개행 문자 정규화

          if (formattedContent.length > 15000) {
            toast.info("글 내용은 15000자 이하로 작성해주세요.", {
              toastId: "contentLength",
            });
            setLoading(false);
            return;
          }

          const response = await ArticleItemService.patchArticleItem(
            articleId,
            title.trim(),
            subCategory,
            formattedContent.trim()
          );

          if (response.status === 204) {
            setArticleItems({
              ...articleItems,
              title,
              position: mainCategory,
              documentName: subCategory,
              currentUserText,
            });
            toast.info("글 수정이 완료되었습니다.", {
              toastId: "success",
            });
            navigate(`/community/article/${articleId}`);
          }

          setLoading(false);
        }
      } catch (error) {
        // console.error("Failed to modify article:", error);
        toast.error("게시글 수정에 실패했습니다.", {
          toastId: "error",
        });
        setLoading(false);
      }
    }, 500),
    [title, mainCategory, subCategory, currentUserText, articleId, articleItems]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    submitArticle();
  };

  return (
    <div className="flex justify-center w-full">
      <main className="w-full max-w-[1280px]">
        {/* header */}
        <CommunityHeader />

        {/* main content */}
        <div className="bg-white rounded-xl border border-[#E1E1DF] my-4">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* 제목 및 분류 영역 */}
              <div className="border-b border-[#E1E1DF] pb-4 mb-4">
                <div className="mb-2">
                  <div className="flex items-center">
                    <label className="block text-lg font-medium text-black min-w-[100px] mb-2">
                      제목 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      className="flex-1 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-sm"
                      placeholder="제목을 입력하세요"
                      onChange={(e) =>
                        convertWhiteSpace(e.target.value).length <=
                          MAX_TITLE_LENGTH && setTitle(e.target.value)
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {convertWhiteSpace(title).length} / {MAX_TITLE_LENGTH}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <label className="block text-lg font-medium text-black min-w-[100px] mb-2 md:mb-0">
                    분류 <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full flex flex-col md:flex-row flex-1 gap-4">
                    <select
                      className="w-full md:flex-1 py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-sm"
                      onChange={handleMainCategoryChange}
                      value={mainCategory}
                    >
                      <option value="">대분류를 선택하세요</option>
                      {Object.keys(documentNames).map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-full md:flex-1 py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-sm"
                      onChange={handleSubCategoryChange}
                      value={subCategory}
                    >
                      <option value="">문서를 선택하세요</option>
                      {mainCategory &&
                        documentNames[mainCategory]?.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 에디터 영역 */}
              <div className="border-b border-[#E1E1DF] pb-4 mb-4">
                <div className="mb-6 mt-4">
                  <label className="block text-lg font-medium text-black mb-2">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 block w-full h-100">
                    <EditorContent
                      initialTextContent={content}
                      maxLength={15000}
                    />
                  </div>
                </div>

                {/* 파일 첨부 영역 */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2">
                    <label className="block text-lg font-medium text-black">
                      사진 첨부
                    </label>
                    {file && (
                      <p className="text-sm text-gray-800 ml-0 sm:ml-6 mt-2 sm:mt-0">
                        파일 제목 혹은 사진을 선택해 본문에 첨부할 수 있습니다.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm text-center cursor-pointer hover:bg-[#C96442] text-sm">
                        사진 선택
                      </div>
                    </div>
                    {!file && (
                      <p className="ml-0 sm:ml-4 mt-2 text-sm text-gray-500">
                        첨부할 사진을 선택하세요 (1개만 가능)
                      </p>
                    )}
                    {file && (
                      <div className="ml-0 sm:ml-4 mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                          src={imageUrl}
                          alt="이미지 파일 미리보기"
                          className="h-24 w-24 object-cover rounded-md border border-gray-300 cursor-pointer"
                          onClick={() => setFileUrl(imageUrl)}
                        />
                        <p
                          className="text-sm text-black mr-2 truncate max-w-md cursor-pointer hover:underline border border-gray-300 rounded-md px-2 py-1"
                          onClick={() => setFileUrl(imageUrl)}
                        >
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={handleFileCancel}
                          className="py-1 px-2 text-sm underline hover:text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 수정 완료 버튼 */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2 px-8 bg-[#bc5b39] text-white rounded-md shadow-sm hover:bg-[#C96442] cursor-pointer text-sm"
                >
                  수정완료
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModifyArticle;
