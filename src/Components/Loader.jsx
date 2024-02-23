import React from 'react'

function Loader() {
    return (
        <div class="flex flex-row gap-2">
            <div class="w-4 h-4 rounded-full bg-customPink animate-bounce"></div>
            <div class="w-4 h-4 rounded-full bg-customPink animate-bounce [animation-delay:-.1s]"></div>
            <div class="w-4 h-4 rounded-full bg-customPink animate-bounce [animation-delay:-.2s]"></div>
        </div>
    )
}

export default Loader