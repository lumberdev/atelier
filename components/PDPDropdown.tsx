import React, { useRef, useEffect, FC } from "react";

const PDPDropdown: FC<{
    option: { name: string; values: string[] }
}> = ({ option }) => {
    const dropdownRef = useRef(null);

    useEffect(() => changeValue());

    const changeValue = () => {
        if(dropdownRef.current.value === "") {
            dropdownRef.current.classList.add("text-dropdown-empty", "opacity-50")
        } else dropdownRef.current.classList.remove("text-dropdown-empty", "opacity-50");
    }

    return (
        <select
            ref={dropdownRef}
            name={option.name}
            id={option.name}
            className="border border-stroke-1 px-3 py-2 bg-white"
            onChange={changeValue}
            defaultValue={""}
            >
            <option value="" disabled>{option.name}</option>
            {option.values.map((value, index) => (
                <option value={value} key={index}>
                {value}
                </option>
            ))}
        </select>
    )
}

export default PDPDropdown;