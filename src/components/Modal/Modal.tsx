import React, { useRef } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, onClose);

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      data-testid="modal"
    >
      <div
        className="bg-white rounded-lg overflow-hidden shadow-xl w-1/3 modal-content"
        ref={modalRef}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
