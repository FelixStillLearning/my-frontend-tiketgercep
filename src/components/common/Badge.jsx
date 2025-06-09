import React from 'react';

const Badge = ({
    type = 'default',
    children,
    className = '',
}) => {
    return (
        <span className={`badge badge-${type} ${className}`}>
            {children}
        </span>
    );
};

export default Badge; 