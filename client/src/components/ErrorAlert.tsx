import type React from "react";
import type { ErrorAlertProps } from "../types";

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-9999 
                    bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg 
                    animate-fadeIn flex items-center gap-3">
      <span>{message}</span>
      <button onClick={onClose} className="text-white text-lg font-bold">×</button>
    </div>
  );
};

export default ErrorAlert;
