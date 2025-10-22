import {Routes, Route, Navigate} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import HomePage from "./pages/HomePage.jsx";
import {useEffect} from "react";

import {Loader} from "lucide-react";

const App = () => {

    return (
        <div>

            <Navbar />

            <Routes>
                <Route path="/" element={ <HomePage /> } />
            </Routes>
        </div>
    )
}

export default App