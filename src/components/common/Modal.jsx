import React, { useEffect } from 'react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    className = '',
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getSizeClass = (modalSize) => {
        switch (modalSize) {
            case 'sm': return 'modal-sm';
            case 'md': return 'modal-md';
            case 'lg': return 'modal-lg';
            case 'xl': return 'modal-xl';
            case '2xl': return 'modal-2xl';
            case 'full': return 'modal-full';
            default: return '';
        }
    };

    return (
        <div className="modal-overlay">
            {/* Backdrop */}
            <div
                className="modal-backdrop"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="modal-wrapper">
                <div
                    className={`modal ${getSizeClass(size)} ${className}`}
                >
                    {/* Header */}
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="modal-close-button"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="modal-close-icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="modal-content">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
