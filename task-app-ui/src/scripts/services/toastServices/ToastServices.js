import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SuccessToastMessage = (message) => {
  toast.success(message, {
    position: "top-right",
  });
};

export const ErrorToastMessage = (message) => {
  toast.error(message, {
    position: "top-right",
  });
};
