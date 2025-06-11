import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faCircle } from '@fortawesome/free-solid-svg-icons';

const ProgressBar = ({ label, value, colorClass }) => (
    <div>
        <label className="label is-small has-text-grey-light">{label}</label>
        <progress className={`progress is-small ${colorClass}`} value={value} max="100">{value}%</progress>
    </div>
);

const SystemStatus = () => {
    return (
        <div className="box has-background-dark">
             <h4 className="title is-5 has-text-white mb-5">
                <span className="icon-text">
                    <span className="icon has-text-danger">
                        <FontAwesomeIcon icon={faServer} />
                    </span>
                    <span>System Status</span>
                </span>
            </h4>
            <div className="content">
                <ProgressBar label="Server Load" value="32" colorClass="is-success" />
                <ProgressBar label="Database Usage" value="45" colorClass="is-info" />
                <ProgressBar label="API Requests" value="78" colorClass="is-warning" />

                <div className="mt-4">
                    <p className="is-size-7 has-text-grey-light">
                        <span className="icon-text">
                            <span className="icon has-text-success">
                                <FontAwesomeIcon icon={faCircle} size="xs" />
                            </span>
                            <span>All systems operational</span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;