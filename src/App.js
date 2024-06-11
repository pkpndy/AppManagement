import { Route, Routes } from "react-router-dom";
import "./App.css";
import LobbyScreen from "./screens/Lobby/lobby";
import Dashboard from "./screens/Dashboard/dashboard";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<LobbyScreen />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
        </div>
    );
}

export default App;
