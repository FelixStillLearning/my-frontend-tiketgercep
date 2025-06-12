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
    const getColorClasses = (baseColor) => {
        switch (baseColor) {
            case 'blue':
                return 'bg-blue-600 text-blue-100';
            case 'green':
                return 'bg-green-600 text-green-100';
            case 'red':
                return 'bg-red-600 text-red-100';
            case 'purple':
                return 'bg-purple-600 text-purple-100';
            case 'orange':
                return 'bg-orange-600 text-orange-100';
            default:
                return 'bg-indigo-600 text-indigo-100';
        }
    };

    const getTrendColor = (trendStatus) => {
        switch (trendStatus) {
            case 'up':
                return 'text-green-500';
            case 'down':
                return 'text-red-500';
            default:
                return 'text-gray-400';
        }
    };

    const getTrendIcon = (trendStatus) => {
        switch (trendStatus) {
            case 'up':
                return 'fas fa-arrow-up';
            case 'down':
                return 'fas fa-arrow-down';
            default:
                return 'fas fa-minus';
        }
    };

    const getIconClass = (iconName) => {
        switch (iconName) {
            case 'movie':
                return 'fas fa-film';
            case 'ticket':
                return 'fas fa-ticket-alt';
            case 'money':
                return 'fas fa-dollar-sign';
            case 'users':
                return 'fas fa-users';
            default:
                return iconName;
        }
    };

    return (
        <div className={`bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
                        <i className={`${getIconClass(icon)} text-lg`}></i>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">{title}</p>
                        <h3 className="text-2xl font-bold text-white">{value}</h3>
                    </div>
                </div>                {trend && trendValue && (
                    <div className={`flex items-center space-x-1 ${getTrendColor(trend)}`}>
                        <i className={`${getTrendIcon(trend)} text-sm`}></i>
                        <span className="text-sm font-medium">{trendValue}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCard;
