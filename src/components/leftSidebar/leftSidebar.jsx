import "./leftSidebar.css";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FolderIcon from "@mui/icons-material/Folder";
import FlagIcon from "@mui/icons-material/Flag";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";

export default function Leftbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleFlagPageClick = (path) => {
        if(location.state != null)  location.state = null;
        handleNavigation(path);
    }

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="leftbar">
            <div className="leftbarWrapper">
                <ul className="leftbarList">
                    <li
                        className="leftbarListItem"
                        onClick={handleDropdownToggle}
                    >
                        <FolderCopyIcon className="leftbarIcon" />
                        <span className="leftbarListIemText">Packages</span>
                        <ArrowDropDownIcon style={{ marginLeft: "5px" }} />
                    </li>
                    <ul
                        className={`subcategoryList ${
                            isDropdownOpen ? "visible" : "hidden"
                        }`}
                    >
                        <li
                            className="leftbarListItem"
                            onClick={() =>
                                handleNavigation("/dashboard/packages")
                            }
                        >
                            <FolderIcon className="leftbarIcon" />
                            <span className="leftbarListIemText">Package</span>
                        </li>
                        {/* <li
                            className="leftbarListItem"
                            onClick={() =>
                                handleNavigation("/dashboard/add-package")
                            }
                        >
                            <CreateNewFolderIcon className="leftbarIcon" />
                            <span className="leftbarListIemText">
                                NewPackage
                            </span>
                        </li> */}
                        <li
                            className="leftbarListItem"
                            onClick={() => handleFlagPageClick("/dashboard/flags")}
                        >
                            <FlagIcon className="leftbarIcon" />
                            <span className="leftbarListIemText">Flag</span>
                        </li>
                        {/* <li
                            className="leftbarListItem"
                            onClick={() =>
                                handleNavigation("/dashboard/add-flag")
                            }
                        >
                            <FlagCircleIcon className="leftbarIcon" />
                            <span className="leftbarListIemText">New Flag</span>
                        </li> */}
                    </ul>
                </ul>
            </div>
        </div>
    );
}
