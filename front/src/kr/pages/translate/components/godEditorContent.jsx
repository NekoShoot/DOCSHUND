import { useState, useEffect, useRef } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import propTypes from "prop-types";
import _ from "lodash";

import useEditorStore from "../../../store/translateStore/editorStore";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";
import ArticleItemService from "../../community/services/articleItemService";
import { toast } from "react-toastify";

const GodEditorContent = ({ initialTextContent, maxLength = 15000 }) => {
  const { docsPart, currentUserText, setCurrentUserText } = useEditorStore();
  const [value, setValue] = useState(initialTextContent);
  const fileUrl = communityArticleStore((state) => state.fileUrl);
  const setFileUrl = communityArticleStore((state) => state.setFileUrl);
  const isPossibleInsertImage = communityArticleStore(
    (state) => state.isPossibleInsertImage
  );
  const setIsPossibleInsertImage = communityArticleStore(
    (state) => state.setIsPossibleInsertImage
  );

  const convertWhiteSpace = (content) => {
    return content.replace(/\n/g, "\r\n"); // 개행 문자 정규화
  };

  const handleChange = (newText) => {
    if (convertWhiteSpace(newText).length > 15000) {
      toast.info("글 내용은 15000자 이하로 작성해주세요.", {
        toastId: "contentLength",
      });
      return;
    }

    setValue(newText);
    setCurrentUserText(newText);
    // console.log("현재 에디터에 입력되는 값입니다.", value);
    // console.log("제출될 내용입니다.", currentUserText);
  };

  const imageUploadCommand = {
    name: "custom-image",
    keyCommand: "image",
    buttonProps: { "aria-label": "Insert image" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: _.debounce(async (state, api) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const response = await ArticleItemService.uploadImageFile(
            e.target.files[0]
          );

          const imageUrl = response.data.imageUrl;
          if (imageUrl) {
            const imageMarkdown = `![${file.name}](${imageUrl})`;
            if (
              convertWhiteSpace(imageMarkdown).length +
                convertWhiteSpace(value).length >
              maxLength
            ) {
              setIsPossibleInsertImage(false);
              toast.info("글 내용은 15000자 이하로 작성해주세요.", {
                toastId: "imageUpload",
              });
              return;
            }

            api.replaceSelection(imageMarkdown);
          }
        }
      };

      input.click();
    }, 300),
  };

  const handleInsertImage = _.debounce(() => {
    if (fileUrl) {
      const imageMarkdown = `\r\n![image](${fileUrl})\r\n`;

      if (
        convertWhiteSpace(imageMarkdown).length +
          convertWhiteSpace(value).length >
        maxLength
      ) {
        setIsPossibleInsertImage(false);
        toast.info("글 내용은 15000자 이하로 작성해주세요.", {
          toastId: "imageUpload",
        });
        setFileUrl("");
        return;
      }

      setIsPossibleInsertImage(true);
      setValue(value + imageMarkdown);
      setCurrentUserText(value + imageMarkdown);
      setFileUrl("");
    }
  }, 300);

  useEffect(() => {
    handleInsertImage();
  }, [fileUrl]);

  return (
    <div className="h-full">
      {/* Markdown 에디터 */}
      <MDEditor
        value={value}
        onChange={handleChange}
        data-color-mode="light"
        height="96%"
        textareaProps={{
          placeholder: "최대 15000자까지 입력 가능합니다.",
          maxLength: maxLength, // 최대 입력 글자 수 설정
        }}
        visibleDragbar={false}
        commands={[
          ...commands.getCommands().filter((cmd) => cmd.name != "image"),
          imageUploadCommand,
        ]}
      />

      {/* Markdown 미리보기 */}
      {/* <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} /> */}
      <div
        style={{
          marginTop: "10px",
          color:
            convertWhiteSpace(value)?.length >= maxLength ? "red" : "black",
        }}
        className="flex justify-end mx-5 pr-3"
      >
        {maxLength - convertWhiteSpace(value)?.length} 글자 남음
      </div>
    </div>
  );
};

GodEditorContent.propTypes = {
  initialTextContent: propTypes.string,
  maxLength: propTypes.number,
};

export default GodEditorContent;
