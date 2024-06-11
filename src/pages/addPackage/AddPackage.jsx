import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MultiSelectDropdown from "../../components/multiSelectDropdown/MultiSelectDropdown";
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
    }

    useEffect(() => {
        async function fetchFlags() {
            try {
                const res = await axios.get("http://localhost:22000/api/admin/flags/list");
                let flagsToShow = res.data.results.filter((flg) => flg.flagVisibility !== 1);
                setFlags(flagsToShow);
            } catch (err) {
                setError("Error occurred while fetching flags.");
            }
        }
        fetchFlags();
    }, []);

    const handleBackBtnClick = () => {
        navigate("/dashboard/packages");
    }

    const handleSaveBtnClick = async () => {
        if(pkgName == "") {
            setError("package name can not be empty!");
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
            await axios.post("http://localhost:22000/api/admin/package/create", newPackage);
            setPkgName("");
            setSelectedFlags([]);
        } catch (err) {
            setError("Error occured while adding package.");
        }
    };


    return (
        <div className="addPackage">
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
                    {/* <MultiSelectDropdown
                        headerText={"Add associated flags..."}
                        className="multiSelectDropdown"
                    /> */}
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
