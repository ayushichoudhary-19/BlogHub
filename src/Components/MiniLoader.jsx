import React from 'react';

function MiniLoader() {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-4 h-4 border-2 border-customPink border-t-customGray rounded-full animate-spin"></div>
        </div>
    );
}

export default MiniLoader;
