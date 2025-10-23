import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, Award } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ComparisonPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/sms/results");
            setResults(response.data);
            toast.success("Results refreshed!", { duration: 2000 });
        } catch (error) {
            console.error("Error fetching results:", error);

            if (error.code === "ERR_NETWORK") {
                toast.error("Cannot connect to server. Please check if Service A is running.", {
                    duration: 6000,
                });
            } else if (error.response?.status === 500) {
                toast.error("Server error. Please check Service B connection.", {
                    duration: 5000,
                });
            } else {
                toast.error("Failed to fetch results. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const getChannelColor = (channel) => {
        switch (channel) {
            case "SYNC_HTTP": return "bg-blue-100 text-blue-800";
            case "ASYNC_HTTP": return "bg-green-100 text-green-800";
            case "KAFKA": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getAnalysis = () => {
        if (results.length === 0) return null;

        const fastest = results.reduce((min, r) =>
            r.totalTimeMs < min.totalTimeMs ? r : min
        );

        const mostReliable = results.reduce((min, r) =>
            r.failed < min.failed ? r : min
        );

        const bestAvgTime = results.reduce((min, r) =>
            r.averageProcessingMs < min.averageProcessingMs ? r : min
        );

        return { fastest, mostReliable, bestAvgTime };
    };

    const analysis = getAnalysis();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Channel Comparison
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Compare performance across different delivery channels
                            </p>
                        </div>
                        <button
                            onClick={fetchResults}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {/* Analysis Cards */}
                    {analysis && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-gray-900">Fastest</h3>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">{analysis.fastest.channel}</p>
                                <p className="text-sm text-gray-500">
                                    {(analysis.fastest.totalTimeMs / 1000).toFixed(2)}s total time
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Award className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Most Reliable</h3>
                                </div>
                                <p className="text-2xl font-bold text-green-600">{analysis.mostReliable.channel}</p>
                                <p className="text-sm text-gray-500">
                                    {analysis.mostReliable.failed} failed messages
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-gray-900">Best Avg Time</h3>
                                </div>
                                <p className="text-2xl font-bold text-purple-600">{analysis.bestAvgTime.channel}</p>
                                <p className="text-sm text-gray-500">
                                    {analysis.bestAvgTime.averageProcessingMs.toFixed(2)}ms per message
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Results Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {results.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-gray-500">No results yet. Generate and send some SMS first!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Channel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Processed
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Failed
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Avg Time (ms)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Total Time
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {results.map((result) => (
                                        <tr key={result.runId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getChannelColor(result.channel)}`}>
                                                        {result.channel}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {result.total}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-green-600 font-medium">
                                                {result.processed}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-red-600 font-medium">
                                                {result.failed}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {result.averageProcessingMs.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {(result.totalTimeMs / 1000).toFixed(2)}s
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Conclusion */}
                    {analysis && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Conclusion
                            </h3>
                            <div className="space-y-2 text-gray-700">
                                <p>
                                    • <strong>{analysis.fastest.channel}</strong> is the fastest channel with a total time of {(analysis.fastest.totalTimeMs / 1000).toFixed(2)} seconds.
                                </p>
                                <p>
                                    • <strong>{analysis.mostReliable.channel}</strong> is the most reliable with only {analysis.mostReliable.failed} failed messages.
                                </p>
                                <p>
                                    • <strong>{analysis.bestAvgTime.channel}</strong> has the best average processing time at {analysis.bestAvgTime.averageProcessingMs.toFixed(2)}ms per message.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonPage;