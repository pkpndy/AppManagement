import "./leftSidebar.css";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import FlagIcon from "@mui/icons-material/Flag";

export default function Leftbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleFlagPageClick = (path) => {
        if (location.state != null) location.state = null;
        handleNavigation(path);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="leftbar">
            <div className="leftbarWrapper">
                <ul className="leftbarList">
                    <li
                        className="leftbarListItem"
                        onClick={() => handleNavigation("/dashboard/packages")}
                    >
                        <FolderIcon className="leftbarIcon" />
                        <span className="leftbarListIemText">Package</span>
                    </li>
                    <li
                        className="leftbarListItem"
                        onClick={() => handleFlagPageClick("/dashboard/flags")}
                    >
                        <FlagIcon className="leftbarIcon" />
                        <span className="leftbarListIemText">Flag</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
