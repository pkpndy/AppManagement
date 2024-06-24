import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import TourIcon from "@mui/icons-material/Tour";
import "./packagePage.css";
import ErrorPopUp from "../../components/errorPopUp/ErrorPopUp";
import AlertPopUp from "../../components/alertPopUp/AlertPopUp";

export default function PackagePage() {
    const [packages, setPackages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingPackageIndex, setEditingPackageIndex] = useState(null);
    const [newPkgName, setNewPkgName] = useState("");
    const [newAppName, setNewAppName] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, pkg: null, index: null });

    const navigate = useNavigate();
    const pkgNameRef = useRef(null);
    const appNameRef = useRef(null);

    const addPackageBtnClick = () => {
        navigate("/dashboard/add-package");
    };

    const handleNewPkgNameChange = (e) => {
        setNewPkgName(e.target.value);
        autoResizeTextarea(e);
    };

    const handleNewAppNameChange = (e) => {
        setNewAppName(e.target.value);
        autoResizeTextarea(e);
    };

    const handleEditPkg = (pkg, index) => {
        setEditingPackageIndex(index);
        setNewPkgName(pkg.packageName);
        setNewAppName(pkg.appName);

        setTimeout(() => {
            if (pkgNameRef.current) {
                pkgNameRef.current.style.height = 'auto';
                pkgNameRef.current.style.height = pkgNameRef.current.scrollHeight + 'px';
                pkgNameRef.current.focus();
            }
            if (appNameRef.current) {
                appNameRef.current.style.height = 'auto';
                appNameRef.current.style.height = appNameRef.current.scrollHeight + 'px';
            }
        }, 100);
    };

    const handlePkgUpdate = async (pkg, index) => {
        if (newPkgName.trim() === "" || newAppName.trim() === "") {
            setError("Package name and App name cannot be empty");
            return;
        }

        try {
            const res = await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL}/api/admin/package/update`,
                {
                    packageId: pkg._id,
                    newName: newPkgName,
                    newAppName: newAppName,
                }
            );

            if (res.data.isError) {
                setError(res.data.message);
                return;
            }

            // Update the package name and app name locally if the update is successful
            const updatedPackages = packages.map((p, i) =>
                i === index ? { ...p, packageName: newPkgName, appName: newAppName } : p
            );

            setPackages(updatedPackages);
            setEditingPackageIndex(null);
            setNewPkgName("");
            setNewAppName("");
            setError(null);
        } catch (err) {
            setError("An error occurred while updating the package.");
        }
    };

    const handlePkgDelete = (pkg, index) => {
        setDeleteConfirmation({ show: true, pkg, index });
    };

    const handleConfirmDelete = async () => {
        const { pkg, index } = deleteConfirmation;
        try {
            const res = await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/api/admin/package/delete`,
                {
                    data: { packageName: pkg.packageName },
                }
            );

            if (res.data.isError) {
                setError(res.data.message);
                return;
            }

            setPackages((prevItems) => prevItems.filter((_, i) => i !== index));
            setError(null);
        } catch (err) {
            setError("An error occurred while deleting the package.");
        } finally {
            setDeleteConfirmation({ show: false, pkg: null, index: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation({ show: false, pkg: null, index: null });
    };

    const autoResizeTextarea = (event) => {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    };

    useEffect(() => {
        async function fetchPackages() {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/admin/package/list`
                );

                if (response.data.isError) {
                    setError(response.data.message);
                    setPackages([]);
                } else {
                    setPackages(response.data.results);
                    setError(null);
                }
            } catch (err) {
                setError("An error occurred while fetching packages.");
            } finally {
                setLoading(false);
            }
        }
        fetchPackages();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (editingPackageIndex !== null) {
                if (event.key === 'Enter') {
                    handlePkgUpdate(packages[editingPackageIndex], editingPackageIndex);
                } else if (event.key === 'Escape') {
                    setEditingPackageIndex(null);
                } else if (event.key === 'Tab') {
                    event.preventDefault();
                    if (document.activeElement === pkgNameRef.current) {
                        if (appNameRef.current) appNameRef.current.focus();
                    } else if (document.activeElement === appNameRef.current) {
                        if (pkgNameRef.current) pkgNameRef.current.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [editingPackageIndex, newPkgName, newAppName]);

    useEffect(() => {
        if (editingPackageIndex !== null && pkgNameRef.current) {
            pkgNameRef.current.focus();
        }
    }, [editingPackageIndex]);

    if (loading) {
        return <div className="loadingContainer">Loading...</div>;
    }

    return (
        <div className="pkgs">
            {error && <ErrorPopUp errorMsg={error} />}
            {packages.length === 0 && !error ? (
                <div className="pkgsWrapper">
                    <div className="pkgsTop">
                        <span className="packageListing">
                            No packages available
                        </span>
                        <button
                            className="addPackageBtn"
                            onClick={addPackageBtnClick}>
                            Add Package
                        </button>
                    </div>
                </div>
            ) : (
                <div className="pkgsWrapper">
                    <div className="pkgsTop">
                        <span className="packageListing">Package Listing</span>
                        <button
                            className="addPackageBtn"
                            onClick={addPackageBtnClick}>
                            Add Package
                        </button>
                    </div>
                    <div className="pkgsBottom">
                        <table className="pkgsTable">
                            <thead>
                                <tr>
                                    <th>Package Name</th>
                                    <th>App Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {packages.map((pkg, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            {editingPackageIndex === index ? (
                                                <>
                                                    <td>
                                                        <textarea
                                                            ref={pkgNameRef}
                                                            value={newPkgName}
                                                            onChange={handleNewPkgNameChange}
                                                            className="editPkgTextarea"
                                                            placeholder={pkg.packageName}
                                                            onInput={autoResizeTextarea}
                                                        />
                                                    </td>
                                                    <td>
                                                        <textarea
                                                            ref={appNameRef}
                                                            value={newAppName}
                                                            onChange={handleNewAppNameChange}
                                                            className="editPkgTextarea"
                                                            placeholder={pkg.appName}
                                                            onInput={autoResizeTextarea}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button onClick={() => handlePkgUpdate(pkg, index)} className="pkgSaveBtns">
                                                            Save
                                                        </button>
                                                        <button onClick={() => setEditingPackageIndex(null)} className="pkgCancelBtns">
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td
                                                        onClick={() =>
                                                            navigate("/dashboard/flags", {
                                                                state: {
                                                                    packageName: pkg.packageName,
                                                                },
                                                            })
                                                        }
                                                        className="clickable"
                                                    >
                                                        {pkg.packageName}
                                                    </td>
                                                    <td>{pkg.appName}</td>
                                                    <td className="pkgListItemRight">
                                                        <EditIcon
                                                            onClick={() => handleEditPkg(pkg, index)}
                                                            htmlColor="DodgerBlue"
                                                        />
                                                        <DeleteForeverIcon
                                                            onClick={() => handlePkgDelete(pkg, index)}
                                                            htmlColor="FireBrick"
                                                        />
                                                        <TourIcon
                                                            htmlColor="ForestGreen"
                                                            onClick={() =>
                                                                navigate("/dashboard/flags", {
                                                                    state: {
                                                                        packageName: pkg.packageName,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {deleteConfirmation.show && 
                <AlertPopUp 
                    popupText="Are you sure you want to delete this package?" 
                    onConfirm={handleConfirmDelete} 
                    onCancel={handleCancelDelete} 
                />
            }
        </div>
    );
}
