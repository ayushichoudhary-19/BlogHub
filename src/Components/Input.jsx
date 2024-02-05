import React, { useId } from 'react'
const Input = React.forwardRef(
    function Input({
        label,
        type = "text",
        className = "",
        ...props
    }, ref) {
        const id = useId()
        return (
            <div className='w-full'>
                {label && <label className='mb-1 pl-1 inline-block' htmlFor={id}> {label} </label>}
                <input
                type={type}
                className={`${className} px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full  `}
                id={id}
                ref={ref}
                {...props}
                />
            </div>
        )
    }
)

export default Input