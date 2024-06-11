import React, { useState, useEffect } from 'react';
import './table.css';

export default function Table({ selectedFlags, setSelectedFlags, handleCheckboxChange, Flags }) {

    useEffect(() => {
        setSelectedFlags(Flags.map(flag => flag.flagName));
    }, [Flags]);

    return (
        <div className="table">
            <div className="tableContainer">
                <ul className="tableList">
                    <li className="tableListItem">
                        <div>Choose</div>
                        <div>Flag Name</div>
                        <div>Visibility</div>
                        <div>Packages Associated</div>
                    </li>
                    {Flags.map((flg) => (
                        <li className="tableListItem"  key={flg._id}>
                            <div>
                                <input
                                    type="checkbox"
                                    name={flg.flagName}
                                    onChange={handleCheckboxChange}
                                    checked={selectedFlags.includes(flg.flagName)}
                                />
                            </div>
                            <div>{flg.flagName}</div>
                            <div>{flg.flagVisibility === 1 ? "private" : "public"}</div>
                            <div>{flg.packagesAssociated.length}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
