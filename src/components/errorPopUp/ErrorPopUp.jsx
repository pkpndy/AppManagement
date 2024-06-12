import React, { useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import "./errorPopUp.css";

export default function ErrorPopUp({ errorMsg }) {
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="errorContainer">
            <div className="errorItemsContainer">
                <div className="errorTop">
                    <CancelIcon onClick={handleClose} className="closeIcon" />
                </div>
                <div className="errorBottom">
                    <div className="errorText">{errorMsg}</div>
                </div>
            </div>
        </div>
    );
}
