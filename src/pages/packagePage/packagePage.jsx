import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import TourIcon from "@mui/icons-material/Tour";
import "./packagePage.css";

export default function PackagePage() {
    const [packages, setPackages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pkgName, setPkgName] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [editingPackageIndex, setEditingPackageIndex] = useState(null);
    const [newPkgName, setNewPkgName] = useState("");

    const navigate = useNavigate();

    const handleAddPkgCancel = () => {
        setShowInput(false);
        setPkgName(""); // Reset package name on cancel
    };

    const handleAddPackage = () => {
        setShowInput(true);
    };

    const handlePkgNameChange = (e) => {
        setPkgName(e.target.value);
    };

    const handleNewPkgNameChange = (e) => {
        setNewPkgName(e.target.value);
    };

    const handlePkgUpdate = async (pkg, index) => {
        if (newPkgName.trim() === "") {
            setError("Package name cannot be empty");
            return;
        }

        try {
            const res = await axios.patch(
                "http://localhost:22000/api/admin/package/update",
                {
                    packageId: pkg._id,
                    newName: newPkgName,
                }
            );

            // Update the package name locally if the update is successful
            const updatedPackages = packages.map((p, i) =>
                i === index ? { ...p, packageName: newPkgName } : p
            );

            setPackages(updatedPackages);
            setEditingPackageIndex(null);
            setNewPkgName("");
            setError(null);
        } catch (err) {
            setError("An error occurred while updating the package.");
        }
    };

    const handlePkgDelete = async (pkg, index) => {
        try {
            await axios.delete(
                "http://localhost:22000/api/admin/package/delete",
                {
                    data: { packageName: pkg.packageName },
                }
            );
            setPackages((prevItems) => prevItems.filter((_, i) => i !== index));
            setError(null);
        } catch (err) {
            setError("An error occurred while deleting the package.");
        }
    };

    const handlePkgNameSubmit = async () => {
        if (pkgName.trim() === "") {
            setError("Package name cannot be empty");
            return;
        }

        const newPackage = { packageName: pkgName };
        try {
            await axios.post(
                "http://localhost:22000/api/admin/package/create",
                newPackage
            );
            setPackages([...packages, newPackage]);
            setPkgName("");
            setShowInput(false);
            setError(null);
        } catch (error) {
            setError("An error occurred while adding the package.");
        }
    };

    useEffect(() => {
        async function fetchPackages() {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://localhost:22000/api/admin/package/list"
                );
                setPackages(response.data.results);
                setError(null);
            } catch (err) {
                setError("An error occurred while fetching packages.");
            } finally {
                setLoading(false);
            }
        }
        fetchPackages();
    }, []);

    if (loading) {
        return <div className="loadingContainer">Loading...</div>;
    }

    return (
        <div className="pkgs">
            {packages.length === 0 && error === null ? (
                <div className="pkgsWrapper">
                    <div className="pkgsTop">
                        <span className="packageListing">
                            No packages available
                        </span>
                        {showInput ? (
                            <div className="inputDropdown">
                                <input
                                    type="text"
                                    value={pkgName}
                                    onChange={handlePkgNameChange}
                                    placeholder="Enter package name..."
                                />
                                <button
                                    onClick={handlePkgNameSubmit}
                                    className="submitBtn">
                                    Submit
                                </button>
                                <button
                                    onClick={handleAddPkgCancel}
                                    className="cancelBtn">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className="addPackageBtn"
                                onClick={handleAddPackage}>
                                Add Package
                            </button>
                        )}
                    </div>
                </div>
            ) : packages.length === 0 && error != null ? (
                <div className="pkgsWrapper">
                    <div>{error}</div>
                </div>
            ) : (
                <div className="pkgsWrapper">
                    <div className="pkgsTop">
                        <span className="packageListing">Package Listing</span>
                        {showInput ? (
                            <div className="inputDropdown">
                                <input
                                    type="text"
                                    value={pkgName}
                                    onChange={handlePkgNameChange}
                                    placeholder="Enter package name..."
                                />
                                <button
                                    onClick={handlePkgNameSubmit}
                                    className="submitBtn">
                                    Submit
                                </button>
                                <button
                                    onClick={handleAddPkgCancel}
                                    className="cancelBtn">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className="addPackageBtn"
                                onClick={handleAddPackage}>
                                Add Package
                            </button>
                        )}
                    </div>
                    <div className="pkgsBottom">
                        <ul className="pkgsList">
                            {packages.map((pkg, index) => (
                                <li className="packageListItem" key={index}>
                                    <div className="packageListItemLeft">
                                        {editingPackageIndex === index ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={newPkgName}
                                                    onChange={
                                                        handleNewPkgNameChange
                                                    }
                                                    placeholder="Enter new package name..."
                                                />
                                                <button
                                                    onClick={() =>
                                                        handlePkgUpdate(
                                                            pkg,
                                                            index
                                                        )
                                                    }
                                                    className="editPackageBtns">
                                                    Submit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditingPackageIndex(
                                                            null
                                                        )
                                                    }
                                                    className="editPackageBtns">
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="packageName">
                                                {pkg.packageName}
                                            </span>
                                        )}
                                    </div>
                                    <div className="packageListItemRight">
                                        <EditIcon
                                            onClick={() =>
                                                setEditingPackageIndex(index)
                                            }
                                            htmlColor="DodgerBlue"
                                        />
                                        <DeleteForeverIcon
                                            onClick={() =>
                                                handlePkgDelete(pkg, index)
                                            }
                                            htmlColor="FireBrick"
                                        />
                                        <TourIcon
                                            htmlColor="ForestGreen"
                                            onClick={() =>
                                                navigate("/dashboard/flags", {
                                                    state: {
                                                        packageName:
                                                            pkg.packageName,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
