import React from 'react';

const Alert = ({
    type = 'info',
    message,
    onClose,
    className = '',
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            default:
                return 'fas fa-info-circle';
        }
    };

    return (
        <div className={`alert alert-${type} ${className}`}>
            <div className="alert-content">
                <i className={`alert-icon ${getIcon()}`}></i>
                <p className="alert-message">{message}</p>
            </div>
            {onClose && (
                <button className="alert-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            )}
        </div>
    );
};

export default Alert; 