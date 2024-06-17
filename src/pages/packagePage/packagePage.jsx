import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import TourIcon from "@mui/icons-material/Tour";
import "./packagePage.css";
import ErrorPopUp from "../../components/errorPopUp/ErrorPopUp";

export default function PackagePage() {
    const [packages, setPackages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pkgName, setPkgName] = useState("");
    const [editingPackageIndex, setEditingPackageIndex] = useState(null);
    const [newPkgName, setNewPkgName] = useState("");

    const navigate = useNavigate();

    const addPackageBtnClick = () => {
        navigate("/dashboard/add-package")
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
                `${process.env.REACT_APP_API_BASE_URL}/api/admin/package/update`,
                {
                    packageId: pkg._id,
                    newName: newPkgName,
                }
            );

            if (res.data.isError) {
                setError(res.data.message);
                return;
            }

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
        }
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
                        <ul className="pkgsList">
                            <li className="packageListItem">
                                <div className="packageListingActionTab">Package Name</div>
                                <div className="packageListingActionTab ">Actions</div>
                            </li>
                            {packages.map((pkg, index) => (
                                <li className="packageListItem" key={index}>
                                    <div className="packageListItemLeft">
                                        {editingPackageIndex === index ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={newPkgName}
                                                    onChange={handleNewPkgNameChange}
                                                    placeholder="Enter new package name..."
                                                />
                                                <button
                                                    onClick={() => handlePkgUpdate(pkg, index)}
                                                    className="editPackageBtns">
                                                    Submit
                                                </button>
                                                <button
                                                    onClick={() => setEditingPackageIndex(null)}
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
                                            onClick={() => setEditingPackageIndex(index)}
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
