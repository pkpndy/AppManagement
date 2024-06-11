import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../components/multiSelectDropdown/MultiSelectDropdown";
import "./addFlag.css";
import axios from "axios";

export default function AddFlag() {
    const location = useLocation();
    const navigate = useNavigate();
    const { packageName } = location.state || {};
    const [packages, setPackages] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(packageName ? [packageName] : []);
    const [flgName, setFlgName] = useState("");
    const [flgSummary, setFlgSummary] = useState("");
    const [flgValue, setFlgValue] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPackages() {
            try {
                const response = await axios.get("http://localhost:22000/api/admin/package/list");
                setPackages(response.data.results);
            } catch (err) {
                setError("An error occurred while fetching packages.");
            }
        }
        fetchPackages();
    }, []);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setSelectedOptions((prevSelectedOptions) =>
            checked
                ? [...prevSelectedOptions, value]
                : prevSelectedOptions.filter((option) => option !== value)
        );
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleBackBtnClick = () => {
        navigate("/dashboard/flags");
    }

    const handleSaveBtnClick = async () => {
        if (!flgName.trim() || !flgSummary.trim() || !flgValue.trim()) {
            setError("Flag name, flag summary, or flag value cannot be empty!");
            return;
        }

        let vt = document.getElementById('visibilityType').textContent.toLowerCase();

        const selectedPackageIds = selectedOptions.map(option => {
            const selectedPackage = packages.find(pkg => pkg.packageName === option);
            return selectedPackage ? selectedPackage._id : null;
        }).filter(id => id !== null);

        const newFlag = {
            flagName: flgName,
            summary: flgSummary,
            flagValue: flgValue,
            flagVisibility: vt === "public" ? 0 : 1,
            packagesAssociated: selectedPackageIds
        };
        console.log("newFlag");
        console.log(newFlag);

        try {
            await axios.post("http://localhost:22000/api/admin/flags/create", newFlag);
            setFlgName("");
            setFlgSummary("");
            setFlgValue("");
            setSelectedOptions([]);
            setError(null);
        } catch (err) {
            setError("Error occurred while adding flag.");
        }
    };

    return (
        <div className="addFlag">
            <div className="addFlagContainer">
                <div className="addPackageLeft">
                    <span className="flagFieldName">Flag Name :</span>
                    <input
                        type="text"
                        value={flgName}
                        onChange={handleInputChange(setFlgName)}
                        placeholder="Enter Flag name..."
                        className="flagFieldInputArea"
                    />
                    <span className="flagFieldName">Flag Summary :</span>
                    <input
                        type="text"
                        value={flgSummary}
                        onChange={handleInputChange(setFlgSummary)}
                        placeholder="Enter flag summary..."
                        className="flagFieldInputArea"
                    />
                    <span className="flagFieldName">Flag Value :</span>
                    <input
                        type="text"
                        value={flgValue}
                        onChange={handleInputChange(setFlgValue)}
                        placeholder="Enter flag value"
                        className="flagFieldInputArea"
                    />
                    
                    {packageName ? (
                        <div>
                            <span className="flagFieldName">Visibility Type :</span>
                            <span className="flagFieldName" id="visibilityType">Private</span>
                            <span className="flagFieldName">Selected Package :</span>
                            <span className="flagFieldName">{packageName}</span>
                        </div>
                    ) : (
                        <div>
                        <span className="flagFieldName">Visibility Type :</span>
                        <span className="flagFieldName" id="visibilityType">Public</span>
                        <MultiSelectDropdown
                            headerText={"Add associated packages..."}
                            selectedOptions={selectedOptions}
                            packages={packages}
                            handleCheckboxChange={handleCheckboxChange}
                            className="multiSelectDropdown"
                        />
                        </div>
                    )}
                </div>
                <div className="addPackageRight">
                    <button onClick={handleBackBtnClick} className="backBtn">Back</button>
                    <button onClick={handleSaveBtnClick} className="saveBtn">Save</button>
                    {error && <div className="error">{error}</div>}
                </div>
            </div>
        </div>
    );
}
