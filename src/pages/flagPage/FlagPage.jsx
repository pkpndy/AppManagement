import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
                setFlags(res.data.results);
            }
            setError(null);
        } catch (err) {
            setFlags([]);
            setError("An error occurred while fetching flags.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
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
                            onChange={handleChange}>
                            <option value="">Choose Package...</option>
                            {packages.map((pkg) => (
                                <option key={pkg._id} value={pkg.packageName}>
                                    {pkg.packageName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => navigate("/dashboard/addFlag")}
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
                            onChange={handleChange}>
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
                                        <DeleteForeverIcon htmlColor="FireBrick" />
                                        <VisibilityIcon htmlColor="ForestGreen" />
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
