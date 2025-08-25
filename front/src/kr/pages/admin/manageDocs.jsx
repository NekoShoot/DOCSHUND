import { useState, useEffect } from "react";
import { fetchDocsList } from "../translate/services/translateGetService";
import {
  registDocument,
  registDocumentContent,
} from "./services/adminPostService";
import RegistDocs from "./components/registDocs";
import useModalStore from "../../store/modalStore";
import { toast } from "react-toastify";
import LodingImage from "../../assets/loading.gif";

const ManageDocs = () => {
  const [loading, setLoading] = useState(false);

  const [adminDocsList, setAdminDocsList] = useState([]);

  //등록 관련 모달 상태관리
  const [openRegistDocs, setOpenRegistDocs] = useState(false);

  const fetchAdminDocs = async () => {
    try {
      const response = await fetchDocsList();
      response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAdminDocsList(response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAdminDocs();
  }, []);

  const handleFileChange = async (e, docsId) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setLoading(true);
      if (selectedFile.size > 10 * 1000 * 1000) {
        setLoading(false);
        toast.warn("파일 크기는 최대 10MB까지 업로드 가능합니다.", {
          toastId: "file-warning",
        });
        return;
      } else if (selectedFile.size === 0) {
        toast.warn("파일이 비어있습니다.", {
          toastId: "file-warning",
        });
        setLoading(false);
        return;
      }

      if (selectedFile.type !== "text/plain") {
        setLoading(false);
        toast.warn("파일 형식은 .txt만 가능합니다.", {
          toastId: "file-warning",
        });
        return;
      }

      // FormData 생성 및 파일 추가
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        // 파일 업로드
        const result = await registDocumentContent(docsId, formData);

        if (result === 200) {
          setLoading(false);
          toast.success("파일이 성공적으로 업로드되었습니다.", {
            toastId: "file-success",
          });
          await fetchAdminDocs();
        } else {
          setLoading(false);
          // toast.error("파일 업로드에 실패했습니다.", {
          //   toastId: "file-error",
          // });
          await fetchAdminDocs();
        }
      } catch (error) {
        setLoading(false);
        // toast.error("파일 업로드에 실패했습니다.", {
        //   toastId: "file-error",
        // });
        await fetchAdminDocs();
      }
    }
  };

  const handleUTC = (time) => {
    const date = new Date(time);
    const kor = date.getHours() + 9;
    date.setHours(kor);
    return date;
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <RegistDocs
        open={openRegistDocs}
        onClose={() => setOpenRegistDocs(false)}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">문서관리</h1>
        <div className="flex gap-2">
          {/* <button className="cursor-pointer px-2 py-2 bg-[#ff2121] text-white rounded-lg hover:bg-[#a34e31] transition-colors duration-200">
            - 문서삭제
          </button> */}

          <button
            onClick={() => setOpenRegistDocs(true)}
            className="cursor-pointer px-2 py-2 bg-[#bc5b39] text-white rounded-lg hover:bg-[#a34e31] transition-colors duration-200"
          >
            + 문서생성
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  문서명
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  버전
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  라이선스명
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  문서등록일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  조회수
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  좋아요수
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  업로드
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {adminDocsList.map((adminDocs, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adminDocs.documentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adminDocs.documentVersion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adminDocs.license}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {handleUTC(adminDocs.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adminDocs.viewCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adminDocs.likeCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="relative">
                      <input
                        type="file"
                        accept=".txt"
                        id="file"
                        name="file"
                        onChange={async (e) => {
                          handleFileChange(e, adminDocs.docsId);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm text-center cursor-pointer hover:bg-[#C96442] text-sm">
                        파일 선택
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-opacity-50 flex flex-col justify-center items-center z-50 backdrop-brightness-80">
          <img src={LodingImage} alt="로딩중" />
        </div>
      )}
    </div>
  );
};

export default ManageDocs;
