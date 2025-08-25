import PropTypes from "prop-types";
import { Download } from "lucide-react";

const InquiryModal = ({ item }) => {
  return (
    <div className="mt-2 p-3 bg-[#F9F8F2] flex flex-col gap-4 text-sm font-light">
      <div>
        <h4 className="text-[#7D7C77] mb-2">[사용자 문의]</h4>
        <p
          className="mb-2 p-4 bg-white rounded-xl border border-[#E1E1DF] break-all break-words overflow-wrap"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.inquiryContent}
        </p>
        {item.inquiryImageUrl && (
          <a
            href={item.inquiryImageUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 px-3 py-1 underline text-gray-500 cursor-pointer"
          >
            첨부파일 보기 <Download className="ml-1" size={16} />
          </a>
        )}
      </div>
      <div>
        <h4 className="text-[#7D7C77] mb-2">[관리자 답변]</h4>
        <p
          className="mb-2 p-4 bg-white rounded-xl border border-[#E1E1DF] break-all break-words overflow-wrap"
          style={{ overflowWrap: "anywhere" }}
        >
          {item.answered ? item.answerContent : "답변 대기 중..."}
        </p>
      </div>
    </div>
  );
};

InquiryModal.propTypes = {
  item: PropTypes.shape({
    inquiryContent: PropTypes.string.isRequired,
    answered: PropTypes.bool.isRequired,
    answerContent: PropTypes.string,
    inquiryImageUrl: PropTypes.string,
  }).isRequired,
};

export default InquiryModal;
