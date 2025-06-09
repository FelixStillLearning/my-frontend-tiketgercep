import React from 'react';

const AdminCard = ({
    title,
    value,
    icon,
    color = 'indigo',
    trend,
    trendValue,
    className = '',
}) => {
    const getColorClass = (baseColor) => {
        switch (baseColor) {
            case 'indigo': return 'admin-card-icon-indigo';
            case 'green': return 'admin-card-icon-green';
            case 'red': return 'admin-card-icon-red';
            case 'amber': return 'admin-card-icon-amber';
            case 'purple': return 'admin-card-icon-purple';
            default: return '';
        }
    };

    const getTrendColorClass = (trendStatus) => {
        switch (trendStatus) {
            case 'up': return 'text-success';
            case 'down': return 'text-danger';
            case 'neutral': return 'text-muted';
            default: return '';
        }
    };

    const getTrendIconClass = (trendStatus) => {
        switch (trendStatus) {
            case 'up': return 'fas fa-arrow-up';
            case 'down': return 'fas fa-arrow-down';
            case 'neutral': return 'fas fa-minus';
            default: return '';
        }
    };

    return (
        <div className={`card admin-card ${className}`}>
            <div className="admin-card-content">
                <div className="admin-card-header">
                    <div className={`admin-card-icon ${getColorClass(color)}`}>
                        <i className={`${icon}`}></i>
                    </div>
                    <div className="admin-card-info">
                        <p className="admin-card-title-text">{title}</p>
                        <h3 className="admin-card-value-text">{value}</h3>
                    </div>
                </div>

                {trend && (
                    <div className="admin-card-trend">
                        <i className={`${getTrendIconClass(trend)} ${getTrendColorClass(trend)}`}></i>
                        <span className={`${getTrendColorClass(trend)}`}>
                            {trendValue}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCard;
