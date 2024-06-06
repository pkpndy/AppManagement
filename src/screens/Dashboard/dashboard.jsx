import "./dashboard.css";
import { Route, Routes } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftSidebar/leftSidebar";
import PackagePage from "../../pages/packagePage/packagePage";
import FlagPage from "../../pages/flagPage/FlagPage";
import AddPackage from "../../pages/addPackage/AddPackage";
import AddFlag from "../../pages/addFlag/AddFlag";

function Dashboard() {
    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <Leftbar />
                <Routes>
                    <Route path="packages" element={<PackagePage />} />
                    {/* <Route path="add-package" element={<AddPackage />} /> */}
                    <Route path="flags" element={<FlagPage />} />
                    <Route path="addFlag" element={<AddFlag />} />
                </Routes>
            </div>
        </>
    );
}

export default Dashboard;
