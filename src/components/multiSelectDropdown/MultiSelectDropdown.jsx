import React, { useState } from "react";
import "./multiSelectDropdown.css";

const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option4", label: "Option 4" },
    { value: "option5", label: "Option 5" },
    { value: "option6", label: "Option 6" },
    { value: "option7", label: "Option 7" },
    { value: "option8", label: "Option 8" },
    { value: "option9", label: "Option 9" },
];

export default function MultiSelectDropdown({ headerText }) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setSelectedOptions((prevSelectedOptions) =>
            checked
                ? [...prevSelectedOptions, value]
                : prevSelectedOptions.filter((option) => option !== value)
        );
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="multiSelectDropdown">
            <div className="dropdownHeader" onClick={toggleDropdown}>
                {headerText}
                <span className="dropdownArrow">&#9660;</span>
            </div>
            {dropdownOpen && (
                <div className="dropdownMenu">
                    {options.map((option) => (
                        <label key={option.value} className="checkboxLabel">
                            <input
                                type="checkbox"
                                value={option.value}
                                checked={selectedOptions.includes(option.value)}
                                onChange={handleCheckboxChange}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
