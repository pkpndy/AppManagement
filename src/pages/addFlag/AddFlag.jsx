import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../components/multiSelectDropdown/MultiSelectDropdown";
import AlertPopUp from "../../components/alertPopUp/AlertPopUp";
import ErrorPopUp from "../../components/errorPopUp/ErrorPopUp";
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

    const flgNameInputRef = useRef(null);
    const flgSummaryInputRef = useRef(null);
    const flgValueInputRef = useRef(null);

    useEffect(() => {
        async function fetchPackages() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/package/list`);
                if (response.data.isError) {
                    setError(response.data.message);
                } else {
                    setPackages(response.data.results);
                }
            } catch (err) {
                setError("An error occurred while fetching packages.");
            }
        }
        fetchPackages();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleSaveBtnClick();
            } else if (event.key === 'Escape') {
                handleBackBtnClick();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [flgName, flgSummary, flgValue, selectedOptions]);

    useEffect(() => {
        if (flgNameInputRef.current) {
            flgNameInputRef.current.focus();
        }
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
        navigate("/dashboard/flags", {
            state: {
                packageName: packageName,
            },
        });
    };

    const handleSaveBtnClick = () => {
        if (!flgName.trim() || !flgSummary.trim() || !flgValue.trim()) {
            setError("Flag name, flag summary, or flag value cannot be empty!");
            return;
        }
        handleConfirmSave();
    };

    const handleConfirmSave = async () => {
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

        try {
            console.log("newFlag");
            console.log(newFlag);
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/flags/create`, newFlag);
            if (response.data.isError) {
                setError(response.data.message);
            } else {
                setFlgName("");
                setFlgSummary("");
                setFlgValue("");
                setSelectedOptions([]);
                setError(null);
                navigate("/dashboard/flags", {
                    state: {
                        packageName: packageName,
                    },
                });
            }
        } catch (err) {
            setError("Error occurred while adding flag.");
        }
    };

    const handleKeyDown = (event, nextRef) => {
        if (event.key === 'Tab' && nextRef && nextRef.current) {
            event.preventDefault();
            nextRef.current.focus();
        }
    };

    return (
        <div className="addFlag">
            <div className="addFlagContainer">
                <div className="addPackageLeft">
                    <span className="flagFieldName">Flag Name :</span>
                    <input
                        ref={flgNameInputRef}
                        type="text"
                        value={flgName}
                        onChange={handleInputChange(setFlgName)}
                        onKeyDown={(e) => handleKeyDown(e, flgSummaryInputRef)}
                        placeholder="Enter Flag name..."
                        className="flagFieldInputArea"
                    />
                    <span className="flagFieldName">Flag Summary :</span>
                    <input
                        ref={flgSummaryInputRef}
                        type="text"
                        value={flgSummary}
                        onChange={handleInputChange(setFlgSummary)}
                        onKeyDown={(e) => handleKeyDown(e, flgValueInputRef)}
                        placeholder="Enter flag summary..."
                        className="flagFieldInputArea"
                    />
                    <span className="flagFieldName">Flag Value :</span>
                    <input
                        ref={flgValueInputRef}
                        type="text"
                        value={flgValue}
                        onChange={handleInputChange(setFlgValue)}
                        onKeyDown={(e) => handleKeyDown(e, flgNameInputRef)} // Loop back to the first input
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
                    {error && <ErrorPopUp errorMsg={error} />}
                </div>
            </div>
        </div>
    );
}
