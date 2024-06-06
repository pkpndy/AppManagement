import React from "react";
import MultiSelectDropdown from "../../components/multiSelectDropdown/MultiSelectDropdown";
import "./addFlag.css";

export default function AddFlag() {
    
    return (
        <div className="addFlag">
            <div className="addFlagContainer">
                <div className="addPackageLeft">
                    <span className="flagFieldName">Flag Name :</span>
                    <input
                        type="text"
                        placeholder="Enter Flag name..."
                        className="flagFieldInputArea"
                    />
                    <span className="flagFieldName">Flag Summary :</span>
                    <input
                        type="text"
                        placeholder="Enter flag summary..."
                        className="flagFieldInputArea"
                    />
                    <span className="flagFieldName">Flag Value :</span>
                    <input
                        type="text"
                        placeholder="Enter flag value"
                        className="flagFieldInputArea"
                    />
                    <MultiSelectDropdown
                        headerText={"Add associated packages..."}
                        className="multiSelectDropdown"
                    />
                </div>
                <div className="addPackageRight">
                    <button className="backBtn">Back</button>
                    <button className="saveBtn">Save</button>
                </div>
            </div>
        </div>
    );
}
