// src/components/common/Loading.jsx
// TODO: Implement loading indicator component

import React from 'react';

const Loading = ({
    size = 'md',
    variant = 'primary',
    fullScreen = false,
    className = '',
}) => {
    const getSizeClass = (loadingSize) => {
        switch (loadingSize) {
            case 'sm': return 'loading-sm';
            case 'md': return 'loading-md';
            case 'lg': return 'loading-lg';
            default: return '';
        }
    };

    const getVariantClass = (loadingVariant) => {
        switch (loadingVariant) {
            case 'primary': return 'loading-primary';
            case 'secondary': return 'loading-secondary';
            case 'white': return 'loading-white';
            default: return '';
        }
    };

    const spinner = (
        <div
            className={`
                loading-spinner
                ${getSizeClass(size)}
                ${getVariantClass(variant)}
                ${className}
            `}
        />
    );

    if (fullScreen) {
        return (
            <div className="loading-fullscreen-overlay">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loading;
