import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // X 아이콘 임포트
import MDEditor from "@uiw/react-md-editor";

const TranslationModal = ({ isOpen, closeModal, item, docsPart }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-brightness-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal} // 백드롭 클릭 시 모달 닫힘
        >
          <motion.div
            className="bg-white w-full max-w-3xl mx-auto rounded-lg border border-[#E1E1DF] shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
          >
            <div className="flex justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {item.documentName} {item.pOrder}번째 문단 번역본
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="cursor-pointer"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
            <div className="mt-2 p-3 bg-[#F9F8F2] flex justify-between gap-2 text-sm font-light">
              <div className="w-1/2">
                <h4 className="text-[#7D7C77] mb-2">[원문]</h4>
                <div
                  className="mb-2 p-4 bg-white rounded-xl border border-[#E1E1DF] break-all break-words overflow-wrap"
                  style={{ height: "400px", overflowY: "auto" }}
                >
                  <MDEditor.Markdown
                    source={docsPart}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <h4 className="text-[#7D7C77] mb-2">[나의 번역]</h4>
                <div
                  className="mb-2 p-4 bg-white rounded-xl border border-[#E1E1DF] break-all break-words overflow-wrap"
                  style={{ height: "400px", overflowY: "auto" }}
                >
                  <MDEditor.Markdown
                    source={item.content}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

TranslationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  item: PropTypes.shape({
    content: PropTypes.string.isRequired,
    documentName: PropTypes.string,
    pOrder: PropTypes.number,
    answered: PropTypes.bool,
    answerContent: PropTypes.string,
  }).isRequired,
  docsPart: PropTypes.string.isRequired,
};

export default TranslationModal;
