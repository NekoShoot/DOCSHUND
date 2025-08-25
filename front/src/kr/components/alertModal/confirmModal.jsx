import PropTypes from "prop-types";
import useAlertStore from "../../store/alertStore";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  const { isAlertOpen } = useAlertStore();

  return (
    <div>
      {isAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full backdrop-brightness-60">
          <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-sm">
            <button
              onClick={onCancel}
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center cursor-pointer"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>

            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <div className="mb-5 text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                  {message.title}
                </h3>
                {message.content &&
                  Array.isArray(message.content) &&
                  message.content.map((item, index) => (
                    <div key={index} className="text-gray-600 mb-3 text-sm">
                      {item}
                    </div>
                  ))}
              </div>

              <button
                onClick={onConfirm}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center cursor-pointer"
              >
                예
              </button>

              <button
                onClick={onCancel}
                className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100 cursor-pointer"
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ConfirmModal.propTypes = {
  message: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmModal;
