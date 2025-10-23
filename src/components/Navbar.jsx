import { Link, useLocation } from "react-router-dom";
import { MessageSquare, BarChart3 } from "lucide-react";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        <span className="text-xl font-semibold text-gray-900">
                            SMS Delivery System
                        </span>
                    </div>

                    <div className="flex space-x-4">
                        <Link
                            to="/"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                                isActive("/")
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>Generator</span>
                        </Link>

                        <Link
                            to="/comparison"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                                isActive("/comparison")
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span>Comparison</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;