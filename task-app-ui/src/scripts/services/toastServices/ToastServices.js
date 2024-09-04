import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ErrorToastMessage = (message) => {
  toast.error(message, {
    position: "top-right",
  });
};

export default ErrorToastMessage;
