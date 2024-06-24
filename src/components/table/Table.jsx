import React, { useState, useEffect } from 'react';
import './table.css';

export default function Table({ selectedFlags, setSelectedFlags, handleCheckboxChange, Flags }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [newFlagName, setNewFlagName] = useState("");

    const autoResizeTextarea = (event) => {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    };

    const handleEditFlag = (index, flagName) => {
        setEditingIndex(index);
        setNewFlagName(flagName);
    };

    const handleFlagNameChange = (e) => {
        setNewFlagName(e.target.value);
        autoResizeTextarea(e);
    };

    useEffect(() => {
        if (editingIndex !== null) {
            const textarea = document.querySelector('.editFlagTextarea');
            if (textarea) {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
                textarea.focus();
            }
        }
    }, [editingIndex]);

    return (
        <div className="table">
            <div className="tableContainer">
                <ul className="tableList">
                    <li className="tableListItem header">
                        <div>Choose</div>
                        <div>Flag Name</div>
                        <div>Visibility</div>
                        <div>Packages Associated</div>
                    </li>
                    {Flags.map((flg, index) => (
                        <li className="tableListItem" key={flg._id} onClick={() => handleCheckboxChange({ target: { name: flg.flagName, checked: !selectedFlags.includes(flg.flagName) } })}>
                            <div>
                                <input
                                    type="checkbox"
                                    name={flg.flagName}
                                    onChange={handleCheckboxChange}
                                    checked={selectedFlags.includes(flg.flagName)}
                                    onClick={e => e.stopPropagation()}
                                />
                            </div>
                            {editingIndex === index ? (
                                <div>
                                    <textarea
                                        className="editFlagTextarea"
                                        value={newFlagName}
                                        onChange={handleFlagNameChange}
                                        onInput={autoResizeTextarea}
                                    />
                                </div>
                            ) : (
                                <div onDoubleClick={() => handleEditFlag(index, flg.flagName)}>
                                    {flg.flagName}
                                </div>
                            )}
                            <div>{flg.flagVisibility === 1 ? "private" : "public"}</div>
                            <div>{flg.packagesAssociated.length}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
