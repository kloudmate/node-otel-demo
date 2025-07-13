import { X } from "lucide-react";
import { FC } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog: FC<DialogProps> = ({ open, onClose, children }) => {
  return (
    // backdrop
    <div
      onClick={onClose}
      className="modal-overlay"
      style={
        open
          ? { visibility: "visible", backgroundColor: "#00000033" }
          : { visibility: "hidden" }
      }
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content" 
        style={open ? { transform: `scale(1)`,
          opacity: 1} : {transform: "scale(1.25)",
            opacity: 0}}
      >
        <button
          onClick={onClose}
          className="modal-close-button"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
