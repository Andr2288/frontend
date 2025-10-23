import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import ComparisonPage from "./pages/ComparisonPage.jsx";

const App = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/comparison" element={<ComparisonPage />} />
            </Routes>
        </div>
    );
};

export default App;