import { useEffect, useRef } from 'react';
import IconButton from './IconButton.jsx';
import './Modal.css';

function Modal({ isOpen, onClose, titleId, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={onClose}
      onClick={handleBackdropClick}
    >
      <div className="modal__panel">
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <IconButton icon="x" label="Close" variant="ghost" onClick={onClose} />
        </div>
        {/* Keying the body on isOpen at the call site remounts it each time the
            dialog opens, so its local form state resets without an
            effect-driven setState. */}
        {children}
      </div>
    </dialog>
  );
}

export default Modal;
