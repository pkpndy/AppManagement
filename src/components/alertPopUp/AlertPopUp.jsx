import React from 'react';
import './alertPopUp.css';

export default function AlertPopUp({ popupText, onConfirm, onCancel }) {
    return (
        <div className="popUp">
            <div className="popUpContainer">
                <div className="popUpText">{popupText}</div>
                <div className="popUpActions">
                    <button onClick={onConfirm} className="confirmBtn">Yes</button>
                    <button onClick={onCancel} className="cancelBtn">No</button>
                </div>
            </div>
        </div>
    );
}
