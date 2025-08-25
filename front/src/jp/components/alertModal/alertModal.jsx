import PropTypes from "prop-types";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import useAlertStore from "../../store/alertStore";
const AlertModal = ({ imgSrc, alertTitle, alertText }) => {
  const { isAlertOpen, toggleAlert } = useAlertStore();
  return (
    <AnimatePresence>
      {isAlertOpen ? (
        <motion.div
          key="alert-modal"
          initial={{ opacity: 0, y: 1000 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 1000 }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }}
          className="fixed inset-0 flex items-center justify-center z-[2200]"
        >
          {/* <div className="fixed inset-0 z-10 w-screen overflow-hidden"> */}
          <div className="relative w-[700px] min-w-[200px] h-fit min-h-[200px] transform overflow-hidden rounded-lg bg-[#E4DCD4] text-left shadow-xl">
            <div className="bg-[#E4DCD4] px-4 pt-5 pb-4">
              <div className="flex justify-center">
                <div className="mt-3 text-center">
                  <h3
                    className="text-base font-semibold text-[#424242] flex justify-center flex-col items-center gap-2"
                    id="modal-title"
                  >
                    <img
                      className="w-[100px] h-[100px]"
                      src={imgSrc}
                      alt="alert 이미지"
                    />
                    {alertTitle}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 whitespace-pre-wrap">
                      {alertText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#E4DCD4] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center">
              <button
                onClick={toggleAlert}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#BC5B39",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                확인
              </button>
            </div>
          </div>
          {/* </div> */}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

AlertModal.propTypes = {
  imgSrc: PropTypes.string,
  alertTitle: PropTypes.string,
  alertText: PropTypes.string,
  isButton: PropTypes.bool,
  isVisible: PropTypes.bool.isRequired,
};

export default AlertModal;
