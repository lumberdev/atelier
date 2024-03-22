import React from "react";

const NavigationMenu = ({
    width = "20",
    height = "20",
    stroke = "#ffffff"
}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 10H15M1 4H19M1 16H19" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export {
    NavigationMenu
}