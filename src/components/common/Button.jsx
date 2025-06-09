import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
}) => {
    const getVariantClass = (btnVariant) => {
        switch (btnVariant) {
            case 'primary': return 'btn-primary';
            case 'secondary': return 'btn-secondary';
            case 'success': return 'btn-success';
            case 'danger': return 'btn-danger';
            case 'warning': return 'btn-warning';
            case 'outline': return 'btn-outline';
            case 'ghost': return 'btn-ghost';
            default: return '';
        }
    };

    const getSizeClass = (btnSize) => {
        switch (btnSize) {
            case 'sm': return 'btn-sm';
            case 'md': return 'btn-md';
            case 'lg': return 'btn-lg';
            default: return '';
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                btn
                ${getVariantClass(variant)}
                ${getSizeClass(size)}
                ${fullWidth ? 'btn-full-width' : ''}
                ${disabled ? 'btn-disabled' : ''}
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default Button;
