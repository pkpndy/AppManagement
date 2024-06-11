import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertPopUp from '../../components/alertPopUp/AlertPopUp';
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

    const navigate = useNavigate();
    const location = useLocation();
    const { packageName } = location.state || {};

    useEffect(() => {
        async function fetchPackages() {
            try {
                const response = await axios.get(
                    "http://localhost:22000/api/admin/package/list"
                );
                setPackages(response.data.results);
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
        try {
            setLoading(true);
            let res;
            if (pkgName) {
                res = await axios.post(
                    `http://localhost:22000/api/admin/package/listOne`,
                    {
                        packageName: pkgName,
                    }
                );
                setFlags(res.data.results.flagsAssociated);
            } else {
                res = await axios.get(
                    "http://localhost:22000/api/admin/flags/list"
                );
                let flagsToShow = res.data.results.filter((flg) => flg.flagVisibility !== 1);
                setFlags(flagsToShow);
            }
            setError(null);
        } catch (err) {
            setFlags([]);
            setError("An error occurred while fetching flags.");
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
                    "http://localhost:22000/api/admin/flags/delete",
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
                await axios.patch("http://localhost:22000/api/admin/package/update", packageUpdate);
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

    if (loading) {
        return <div className="loadingContainer">Loading...</div>;
    }

    return (
        <div className="flgs">
            {flags.length === 0 && error === null ? (
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
                            onClick={() => navigate("/dashboard/addFlag",
                                {
                                    state: {
                                        packageName: pkgSelected,
                                    },
                                }
                            )}
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
                    <div className="pkgsBottom">
                        <ul className="pkgsList">
                            <li className="flagListItem">
                                <div className="flagName">Flag Name</div>
                                <div className="flagName">Packages Associated</div>
                                <div className="flagName">Actions</div>
                            </li>
                            {flags.map((flg, index) => (
                                <li key={index} className="flagListItem">
                                    <div className="flagListItemLeft">
                                        <span className="flagName">
                                            {flg.flagName}
                                        </span>
                                    </div>
                                    <div className="flagListItemCenter">
                                        Total Packages Associated:{" "}
                                        {flg.packagesAssociated.length}
                                    </div>
                                    <div className="flagListItemRight">
                                        <EditIcon htmlColor="DodgerBlue" />
                                        <DeleteForeverIcon 
                                            onClick={() => handleFlgDelete(flg, index)} 
                                            htmlColor="FireBrick" 
                                        />
                                        <VisibilityIcon htmlColor="ForestGreen" />
                                    </div>
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
