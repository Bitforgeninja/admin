import React from 'react';

function Content({ content }) {
    return (
        <div className="flex-1 p-10 text-2xl font-bold">
            {content}
        </div>
    );
}

export default Content;
