import { ToastContainer } from "react-toastify";
import { useNotificationCenter } from "react-toastify/addons/use-notification-center";

const ToastModal = () => {
  const { notifications, clear } = useNotificationCenter();

  return (
    <ToastContainer
      position="top-center"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      // limit={3}
      theme="light"
    />
  );
};

export default ToastModal;
