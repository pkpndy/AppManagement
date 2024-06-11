import React, { useState } from "react";
import "./multiSelectDropdown.css";

export default function MultiSelectDropdown({ headerText, selectedOptions, packages, handleCheckboxChange }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
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
                    {packages.map((pkg) => (
                        <label key={pkg._id} className="checkboxLabel">
                            <input
                                type="checkbox"
                                value={pkg.packageName}
                                checked={selectedOptions.includes(pkg.packageName)}
                                onChange={handleCheckboxChange}
                            />
                            {pkg.packageName}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
