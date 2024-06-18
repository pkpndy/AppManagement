import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorPopUp from "../../components/errorPopUp/ErrorPopUp";
import axios from "axios";
import Table from "../../components/table/Table";
import "./addPackage.css";

export default function AddPackage() {
    const navigate = useNavigate();
    const [pkgName, setPkgName] = useState("");
    const [flags, setFlags] = useState([]);
    const [error, setError] = useState(null);
    const [selectedFlags, setSelectedFlags] = useState([]);

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (!checked) {
            setSelectedFlags(selectedFlags.filter((flag) => flag !== name));
        } else {
            setSelectedFlags([...selectedFlags, name]);
        }
    };

    const handlePackageNameInput = (e) => {
        setPkgName(e.target.value);
    };

    useEffect(() => {
        async function fetchFlags() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/flags/list`);
                let flagsToShow = res.data.results.filter((flg) => flg.flagVisibility !== 1);
                setFlags(flagsToShow);
            } catch (err) {
                setError("Error occurred while fetching flags.");
                console.log(err);
            }
        }
        fetchFlags();
    }, []);

    const handleBackBtnClick = () => {
        navigate("/dashboard/packages");
    };

    const handleSaveBtnClick = async () => {
        if (pkgName === "") {
            setError("Package name cannot be empty!");
            return;
        }

        const selectedFlagsIds = selectedFlags.map(option => {
            const selectedFlag = flags.find(flg => flg.flagName === option);
            return selectedFlag ? selectedFlag._id : null;
        }).filter(id => id !== null);

        const newPackage = {
            packageName: pkgName,
            flagsAssociated: selectedFlagsIds
        };

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/package/create`, newPackage);
            if (res.data.isError) {
                setError(res.data.message);
                console.log(res.data.message);
            } else {
                setPkgName("");
                setSelectedFlags([]);
                navigate("/dashboard/packages");
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
                console.log(err.response.data.message);
            } else {
                setError("An error occurred while adding the package.");
                console.log(err);
            }
        }
    };

    return (
        <div className="addPackage">
            {error && <ErrorPopUp errorMsg={error} />}
            <div className="addPackageContainer">
                <div className="addPackageLeft">
                    <span className="packageNameText">Package Name :</span>
                    <input
                        type="text"
                        value={pkgName}
                        onChange={handlePackageNameInput}
                        placeholder="Enter package name..."
                        className="packageNameInputArea"
                    />
                    <div className="packageNameText">Choose Public Flags not to add :</div>
                    <Table 
                        selectedFlags={selectedFlags}
                        setSelectedFlags={setSelectedFlags} 
                        handleCheckboxChange={handleCheckboxChange} 
                        Flags={flags} 
                        className="tableComponent" 
                    />
                </div>
                <div className="addPackageRight">
                    <button onClick={handleBackBtnClick} className="backBtn">Back</button>
                    <button onClick={handleSaveBtnClick} className="saveBtn">Save</button>
                </div>
            </div>
        </div>
    );
}
