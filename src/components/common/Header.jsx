import React from 'react';

const Header = ({
    title,
    subtitle,
    glowText,
    actions,
    className = '',
}) => {
    return (
        <div className={`header ${className}`}>
            <h2 className="header-title">
                {glowText ? (
                    <>
                        <span className="header-glow-text">{glowText}</span>{' '}
                        {title}
                    </>
                ) : (
                    title
                )}
            </h2>
            {subtitle && (
                <p className="header-subtitle">
                    {subtitle}
                </p>
            )}
            {actions && (
                <div className="header-actions">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default Header;
