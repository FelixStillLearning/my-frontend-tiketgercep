// src/components/admin/AdminCard.jsx (Bulma)
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Props: icon, title (string), value (string/number), change (string)
const AdminCard = ({ icon, title, value, change }) => {
  const isPositive = change && change.startsWith('+');

  return (
    <div className="card has-background-dark" style={{ borderLeft: '4px solid #e50914' }}>
      <div className="card-content">
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <div>
                <p className="heading has-text-grey">{title}</p>
                <p className="title is-3 has-text-white">{value}</p>
              </div>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <FontAwesomeIcon icon={icon} className="has-text-danger is-size-2" />
            </div>
          </div>
        </div>
         {change && (
            <p className={`is-size-7 ${isPositive ? 'has-text-success' : 'has-text-danger'}`}>
              {change}
            </p>
         )}
      </div>
    </div>
  );
};

export default AdminCard;