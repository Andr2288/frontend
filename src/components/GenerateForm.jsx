import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const GenerateForm = ({ onGenerated }) => {
    const [count, setCount] = useState(100);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (count < 1 || count > 100000) {
            alert("Count must be between 1 and 100,000");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post("/sms/generate", { count });
            onGenerated(response.data);
        } catch (error) {
            console.error("Error generating SMS:", error);
            alert("Failed to generate SMS");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Generate SMS Messages
            </h2>

            <div className="flex items-end space-x-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of SMS (1 - 100,000)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="100000"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            <span>Generate</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default GenerateForm;