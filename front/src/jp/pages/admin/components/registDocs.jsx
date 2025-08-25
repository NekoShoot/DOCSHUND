import { useState } from "react";
import PropTypes from "prop-types";
import { registDocument } from "../services/adminPostService";
import { fetchDocsList } from "../../translate/services/translateGetService";
import { toast } from "react-toastify";

const RegistDocs = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    documentName: "",
    documentCategory: "",
    documentVersion: "",
    documentLink: "",
    documentLogo: "",
    license: "",
    createdAt: new Date().toISOString(),
    likeCount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.position === "" ||
      formData.position === null ||
      formData.position === undefined
    ) {
      toast.warn("포지션을 선택해주세요.", {
        toastId: "selectPosition",
      });
      return;
    }
    const documentData = {
      documentCategory: formData.documentCategory,
      documentName: formData.documentName,
      documentVersion: formData.documentVersion,
      documentLink: formData.documentLink,
      documentLogo: formData.documentLogo,
      license: formData.license,
      position: formData.position,
    };
    const status = await registDocument(documentData);
    if (status === 200) {
      toast.success("문서 등록 성공", {
        toastId: "registDocs",
      });

      // await fetchDocsList();
      window.location.reload();
      onClose();
    } else {
      toast.error("문서 등록 실패", {
        toastId: "registDocs",
      });
      formData.documentCategory = "";
      formData.documentName = "";
      formData.documentVersion = "";
      formData.documentLink = "";
      formData.documentLogo = "";
      formData.license = "";
      formData.position = "";
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">문서 등록</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대분류
              </label>
              <input
                type="text"
                name="documentCategory"
                value={formData.documentCategory}
                onChange={handleChange}
                maxLength={30}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                문서명
              </label>
              <input
                type="text"
                name="documentName"
                value={formData.documentName}
                onChange={handleChange}
                maxLength={30}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                버전
              </label>
              <input
                type="text"
                name="documentVersion"
                value={formData.documentVersion}
                onChange={handleChange}
                maxLength={20}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                라이센스
              </label>
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
                maxLength={20}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                포지션
              </label>
              {/* <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              /> */}
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">포지션을 선택해주세요</option>
                <option value="FRONTEND">FRONTEND</option>
                <option value="BACKEND">BACKEND</option>
                <option value="DEVOPS">DEVOPS</option>
                <option value="DBSQL">DBSQL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              로고 이미지 링크
            </label>
            <input
              type="text"
              name="documentLogo"
              value={formData.documentLogo}
              onChange={handleChange}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공식 문서 주소
            </label>
            <input
              type="text"
              name="documentLink"
              value={formData.documentLink}
              onChange={handleChange}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              onClick={async (e) => {
                e.stopPropagation();
                await handleSubmit();

                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-[#bc5b39] rounded-md hover:bg-[#a34e31] cursor-pointer"
            >
              등록
            </button>
          </div>
        </form>
      </div>
      <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
    </div>
  );
};

RegistDocs.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default RegistDocs;
