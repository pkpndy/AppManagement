import React, { useEffect, useState, useRef } from "react";
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

    const flagNameRef = useRef(null);
    const flagValueRef = useRef(null);
    const flagSummaryRef = useRef(null);

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

    const sortFlags = (flagsToSort) => {
        return flagsToSort.sort((a, b) => {
            if (a.flagName.toLowerCase() < b.flagName.toLowerCase()) {
                return -1;
            }
            if (a.flagName.toLowerCase() > b.flagName.toLowerCase()) {
                return 1;
            }
            return 0;
        });
    };

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
                    setFlags(sortFlags(res.data.results.flagsAssociated));
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
                    setFlags(sortFlags(flagsToShow));
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
        console.log("flag Delte request", flag, index);
        try {
            if (flag.flagVisibility === 1 || (flag.flagVisibility === 0 && pkgSelected === "")) {
                await axios.delete(
                    `${process.env.REACT_APP_API_BASE_URL}/api/admin/flags/delete`,
                    {
                        data: { flagId: flag._id },
                    }
                );
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

        setTimeout(() => {
            if (flagNameRef.current) {
                flagNameRef.current.style.height = 'auto';
                flagNameRef.current.style.height = flagNameRef.current.scrollHeight + 'px';
                flagNameRef.current.focus();
            }
            if (flagValueRef.current) {
                flagValueRef.current.style.height = 'auto';
                flagValueRef.current.style.height = flagValueRef.current.scrollHeight + 'px';
            }
            if (flagSummaryRef.current) {
                flagSummaryRef.current.style.height = 'auto';
                flagSummaryRef.current.style.height = flagSummaryRef.current.scrollHeight + 'px';
            }
        }, 100); // Add a small delay to ensure the ref is set
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

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (editIndex !== null) {
                if (event.key === 'Enter') {
                    handleSaveEditFlag(flags[editIndex], editIndex);
                } else if (event.key === 'Escape') {
                    setEditIndex(null);
                } else if (event.key === 'Tab') {
                    event.preventDefault();
                    if (document.activeElement === flagNameRef.current) {
                        if (flagValueRef.current) flagValueRef.current.focus();
                    } else if (document.activeElement === flagValueRef.current) {
                        if (flagSummaryRef.current) flagSummaryRef.current.focus();
                    } else if (document.activeElement === flagSummaryRef.current) {
                        if (flagNameRef.current) flagNameRef.current.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [editIndex, newFlagName, newFlagValue, newFlagSummary, flags]);

    const autoResizeTextarea = (event) => {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
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
                        <table className="flgsTable">
                            <thead>
                                <tr>
                                    <th>Flag Name</th>
                                    <th>Flag Value</th>
                                    <th>Summary</th>
                                    <th>Packages Associated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flags.map((flg, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            {editIndex === index ? (
                                                <>
                                                    <td>
                                                        <textarea
                                                            ref={flagNameRef}
                                                            value={newFlagName}
                                                            onChange={handleFlagNameChange}
                                                            className="editFlagTextarea"
                                                            placeholder={flg.flagName}
                                                            onInput={autoResizeTextarea}
                                                        />
                                                    </td>
                                                    <td>
                                                        <textarea
                                                            ref={flagValueRef}
                                                            value={newFlagValue}
                                                            onChange={handleFlagValueChange}
                                                            className="editFlagTextarea"
                                                            placeholder={flg.flagValue}
                                                            onInput={autoResizeTextarea}
                                                        />
                                                    </td>
                                                    <td>
                                                        <textarea
                                                            ref={flagSummaryRef}
                                                            value={newFlagSummary}
                                                            onChange={handleFlagSummaryChange}
                                                            className="editFlagTextarea"
                                                            placeholder={flg.summary}
                                                            onInput={autoResizeTextarea}
                                                        />
                                                    </td>
                                                    <td>{flg.packagesAssociated.length}</td>
                                                    <td>
                                                        <button onClick={() => handleSaveEditFlag(flg, index)} className="flgSaveBtns">
                                                            Save
                                                        </button>
                                                        <button onClick={() => setEditIndex(null)} className="flgCancelBtns">
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{flg.flagName}</td>
                                                    <td style={{ textAlign: 'center' }}>{flg.flagValue}</td>
                                                    <td>{flg.summary}</td>
                                                    <td>{flg.packagesAssociated.length}</td>
                                                    <td className="flagListItemRight">
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
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        {visiblePackages[index] && (
                                            <tr>
                                                <td colSpan="5">
                                                    <div className="associatedPackages">
                                                        {flg.packagesAssociated.map((pkg, pkgIndex) => (
                                                            <div key={pkgIndex} className="associatedPackageItem">
                                                                {pkg.packageName}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
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
