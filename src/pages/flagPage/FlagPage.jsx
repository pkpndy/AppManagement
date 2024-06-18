import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertPopUp from "../../components/alertPopUp/AlertPopUp";
import ErrorPopUp from "../../components/errorPopUp/ErrorPopUp";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./flagPage.css";

export default function FlagPage() {
    const [flags, setFlags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pkgSelected, setPkgSelected] = useState("");
    const [packages, setPackages] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, flag: null, index: null });

    const [editIndex, setEditIndex] = useState(null);
    const [newFlagName, setNewFlagName] = useState("");
    const [newFlagValue, setNewFlagValue] = useState("");
    const [newFlagSummary, setNewFlagSummary] = useState("");

    const [visiblePackages, setVisiblePackages] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const { packageName } = location.state || {};

    useEffect(() => {
        async function fetchPackages() {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/admin/package/list`
                );
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
        if (packageName) {
            setPkgSelected(packageName);
            fetchFlags(packageName);
        } else {
            setPkgSelected("");
            fetchFlags();
        }
    }, [packageName]);

    const fetchFlags = async (pkgName = "") => {
        let res;
        try {
            setLoading(true);
            if (pkgName) {
                res = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/api/admin/package/listOne`,
                    {
                        packageName: pkgName,
                    }
                );
                if (res.data.isError) {
                    setError(res.data.message);
                    setFlags([]);
                } else {
                    setFlags(res.data.results.flagsAssociated);
                }
            } else {
                res = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/admin/flags/list`
                );
                if (res.data.isError) {
                    setError(res.data.message);
                    setFlags([]);
                } else {
                    let flagsToShow = res.data.results.filter((flg) => flg.flagVisibility !== 1);
                    setFlags(flagsToShow);
                }
            }
            setError(null);
        } catch (err) {
            setError("An error occurred while fetching flags.");
            setFlags([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFlgDelete = (flg, index) => {
        setDeleteConfirmation({ show: true, flag: flg, index: index });
    };

    const handleConfirmDelete = async () => {
        const { flag, index } = deleteConfirmation;
        try {
            if (flag.flagVisibility === 1 || (flag.flagVisibility === 0 && pkgSelected === "")) {
                await axios.delete(
                    `${process.env.REACT_APP_API_BASE_URL}/api/admin/flags/delete`,
                    {
                        data: { flagName: flag.flagName },
                    }
                );
                setFlags((prevItems) => prevItems.filter((_, i) => i !== index));
            } else if (pkgSelected !== "") {
                const pkgId = packages.find((pkg) => pkg.packageName === pkgSelected)._id;
                const packageUpdate = {
                    packageId: pkgId,
                    removeFlags: [flag._id]
                };
                await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/package/update`, packageUpdate);
                setFlags((prevItems) => prevItems.filter((_, i) => i !== index));
            }
            setError(null);
        } catch (err) {
            setError("Error occurred while deleting the flag.");
        } finally {
            setDeleteConfirmation({ show: false, flag: null, index: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation({ show: false, flag: null, index: null });
    };

    const handlePkgSelectionChange = (event) => {
        const selectedPackage = event.target.value;
        setPkgSelected(selectedPackage);
        if (selectedPackage) {
            fetchFlags(selectedPackage);
        } else {
            fetchFlags();
        }
    };

    const handleEditFlag = (index, flag) => {
        setEditIndex(index);
        setNewFlagName(flag.flagName);
        setNewFlagValue(flag.flagValue);
        setNewFlagSummary(flag.summary);
    };

    const handleFlagNameChange = (e) => {
        setNewFlagName(e.target.value);
    };

    const handleFlagValueChange = (e) => {
        setNewFlagValue(e.target.value);
    };

    const handleFlagSummaryChange = (e) => {
        setNewFlagSummary(e.target.value);
    };

    const handleSaveEditFlag = async (flg, index) => {
        const updatedFlag = {
            flagId: flg._id,
            newName: newFlagName || flg.flagName,
            newSummary: newFlagSummary || flg.summary,
            newValue: newFlagValue || flg.flagValue,
        };
    
        try {
            const res = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/flags/update`, updatedFlag);
            if (res.data.isError) {
                setError(res.data.message);
                return;
            }
            
            setFlags((prevFlags) => {
                const updatedFlags = [...prevFlags];
                updatedFlags[index] = {
                    ...updatedFlags[index],
                    flagName: updatedFlag.newName,
                    flagValue: updatedFlag.newValue,
                    summary: updatedFlag.newSummary,
                };
                return updatedFlags;
            });
    
            setEditIndex(null);
            setNewFlagName("");
            setNewFlagValue("");
            setNewFlagSummary("");
            setError(null);
        } catch (err) {
            setError("Error occurred while updating the flag.");
        }
    };    

    const handleShowPackages = (index) => {
        setVisiblePackages((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (loading) {
        return <div className="loadingContainer">Loading...</div>;
    }

    return (
        <div className="flgs">
            {error && <ErrorPopUp errorMsg={error} />}
            {flags.length === 0 && !error ? (
                <div className="flgsWrapper">
                    <div className="flgsTop">
                        <span className="flagListing">No flags available</span>
                        <select
                            name="package"
                            id="package"
                            className="form-select"
                            value={pkgSelected}
                            onChange={handlePkgSelectionChange}>
                            <option value="">Choose Package...</option>
                            {packages.map((pkg) => (
                                <option key={pkg._id} value={pkg.packageName}>
                                    {pkg.packageName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() =>
                                navigate("/dashboard/addFlag", {
                                    state: {
                                        packageName: pkgSelected,
                                    },
                                })
                            }
                            className="addFlagBtn">
                            Add Flag
                        </button>
                    </div>
                </div>
            ) : flags.length === 0 && error != null ? (
                <div className="flgsWrapper">
                    <div>{error}</div>
                </div>
            ) : (
                <div className="flgsWrapper">
                    <div className="flgsTop">
                        <span className="flagListing">Flag Listing</span>
                        <select
                            name="package"
                            id="package"
                            className="form-select"
                            value={pkgSelected}
                            onChange={handlePkgSelectionChange}>
                            <option value="">Choose Package...</option>
                            {packages.map((pkg) => (
                                <option key={pkg._id} value={pkg.packageName}>
                                    {pkg.packageName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() =>
                                navigate("/dashboard/addFlag", {
                                    state: {
                                        packageName: pkgSelected,
                                    },
                                })
                            }
                            className="addFlagBtn">
                            Add Flag
                        </button>
                    </div>
                    <div className="flgsBottom">
                        <ul className="flgsList">
                            <li className="flagListItem">
                                <div className="flagListingActionTab">Flag Name</div>
                                <div className="flagListingActionTab">Flag Value</div>
                                <div className="flagListingActionTab">Summary</div>
                                <div className="flagListingActionTab">Packages Associated</div>
                                <div className="flagListingActionTab">Actions</div>
                            </li>
                            {flags.map((flg, index) => (
                                <li key={index} className="flagListItem">
                                    {editIndex === index ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newFlagName}
                                                onChange={handleFlagNameChange}
                                                className="editFlagInput"
                                                placeholder={flg.flagName}
                                            />
                                            <input
                                                type="text"
                                                value={newFlagValue}
                                                onChange={handleFlagValueChange}
                                                className="editFlagInput"
                                                placeholder={flg.flagValue}
                                            />
                                            <input 
                                                type="text" 
                                                value={newFlagSummary}
                                                onChange={handleFlagSummaryChange} 
                                                className="editFlagInput" 
                                                placeholder={flg.summary}
                                            />
                                            <button onClick={() => handleSaveEditFlag(flg, index)} className="flgEditBtns">
                                                Save
                                            </button>
                                            <button onClick={() => setEditIndex(null)} className="flgEditBtns">
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flagName">
                                                {flg.flagName}
                                            </div>
                                            <div className="flagVisibility">{flg.flagValue}</div>
                                            <div className="flagVisibility">
                                                {flg.summary}
                                            </div>
                                            <div>
                                                {flg.packagesAssociated.length}
                                            </div>
                                            <div className="flagListItemRight">
                                                <EditIcon
                                                    onClick={() => handleEditFlag(index, flg)}
                                                    htmlColor="DodgerBlue"
                                                />
                                                <DeleteForeverIcon
                                                    onClick={() => handleFlgDelete(flg, index)}
                                                    htmlColor="FireBrick"
                                                />
                                                <VisibilityIcon
                                                    onClick={() => handleShowPackages(index)}
                                                    htmlColor="ForestGreen"
                                                />
                                            </div>
                                        </>
                                    )}
                                    {visiblePackages[index] && (
                                        <div className="associatedPackages">
                                            {flg.packagesAssociated.map((pkg, pkgIndex) => (
                                                <div key={pkgIndex} className="associatedPackageItem">
                                                    {pkg.packageName}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {deleteConfirmation.show && 
                <AlertPopUp 
                    popupText="Are you sure you want to delete this item?" 
                    onConfirm={handleConfirmDelete} 
                    onCancel={handleCancelDelete} 
                />
            }
        </div>
    );
}
