import React from "react";
import MultiSelectDropdown from "../../components/multiSelectDropdown/MultiSelectDropdown";
import "./addPackage.css";

export default function AddPackage() {
    return (
        <div className="addPackage">
            <div className="addPackageContainer">
                <div className="addPackageLeft">
                    <span className="packageNameText">Package Name :</span>
                    <input
                        type="text"
                        placeholder="Enter package name..."
                        className="packageNameInputArea"
                    />
                    <MultiSelectDropdown
                        headerText={"Add associated flags..."}
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
