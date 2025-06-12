import React from 'react';

const LoadingSpinner = ({ 
    size = 'md', 
    color = 'blue',
    text = 'Loading...',
    fullScreen = false 
}) => {
    const getSizeClass = () => {
        switch (size) {
            case 'sm': return 'h-4 w-4';
            case 'md': return 'h-8 w-8';
            case 'lg': return 'h-12 w-12';
            case 'xl': return 'h-16 w-16';
            default: return 'h-8 w-8';
        }
    };

    const getColorClass = () => {
        switch (color) {
            case 'blue': return 'border-blue-600';
            case 'gray': return 'border-gray-600';
            case 'green': return 'border-green-600';
            case 'red': return 'border-red-600';
            default: return 'border-blue-600';
        }
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center">
            <div className={`animate-spin rounded-full border-2 border-t-2 border-gray-200 ${getSizeClass()} ${getColorClass()}`}></div>
            {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
