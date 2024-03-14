import React from 'react'

function Button({
    children,
    type = "button",
    bgColor = "",
    textColor = "",
    className = "",
    ...props
}) {
  return (
    <button className={`px-2 md:py-5 py-3 ${bgColor} ${textColor} ${className} `} type={type} {...props}>
        {children}
    </button>
  )
}

export default Button