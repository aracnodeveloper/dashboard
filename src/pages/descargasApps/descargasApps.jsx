import React from 'react';

const DescargasApps = ({url}) => {
    return (
        <div>
            <iframe
                src={url}
                title="iframe"
                width="1000px"
                height="100%"
                frameBorder="0"
            />
        </div>
    );
};

export default DescargasApps;