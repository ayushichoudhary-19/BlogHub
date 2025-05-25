import React, { useId } from 'react'

function Select({
    options,
    label,
    className = '',
    ...props
}, ref) {

    const Id = useId()
    return (
        <div className="w-full">
            {label && <label htmlFor={Id} className=''> </label>}
            <select
            {...props}
            name=""
            id={Id}
            ref={ref}
            className={`px-3 py-2 rounded-lg bg-transparent text-white outline-none focus:bg-transparent duration-200 border border-gray-600 w-full ${className}`}
            >
                { options?.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                )) }

            </select>
        </div>
  )
}

export default React.forwardRef(Select)