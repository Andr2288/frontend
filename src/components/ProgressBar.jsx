import { useEffect, useState } from "react";
import { Activity, CheckCircle, XCircle } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const ProgressBar = ({ runId, channel }) => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        if (!runId) return;

        const fetchMetrics = async () => {
            try {
                const response = await axiosInstance.get(`/sms/metrics/${runId}`);
                setMetrics(response.data);

                // Stop polling when completed
                if (response.data.isCompleted) {
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        };

        // Initial fetch
        fetchMetrics();

        // Poll every second
        const interval = setInterval(fetchMetrics, 1000);

        return () => clearInterval(interval);
    }, [runId]);

    if (!metrics) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center space-x-2 text-gray-500">
                    <Activity className="w-5 h-5 animate-pulse" />
                    <span>Waiting for metrics...</span>
                </div>
            </div>
        );
    }

    const percentage = metrics.total > 0
        ? Math.round(((metrics.processed + metrics.failed) / metrics.total) * 100)
        : 0;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Progress - {channel}
                </h3>
                {metrics.isCompleted ? (
                    <span className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Completed</span>
                    </span>
                ) : (
                    <span className="flex items-center space-x-1 text-blue-600">
                        <Activity className="w-5 h-5 animate-pulse" />
                        <span>Processing...</span>
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{metrics.processed + metrics.failed} / {metrics.total}</span>
                    <span>{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{metrics.total}</div>
                    <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{metrics.processed}</div>
                    <div className="text-sm text-gray-500">Processed</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{metrics.failed}</div>
                    <div className="text-sm text-gray-500">Failed</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {metrics.averageProcessingMs?.toFixed(2) || 0}ms
                    </div>
                    <div className="text-sm text-gray-500">Avg Time</div>
                </div>
            </div>

            {metrics.isCompleted && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                        <span className="text-sm text-gray-600">Total Time: </span>
                        <span className="text-lg font-semibold text-gray-900">
                            {(metrics.totalTimeMs / 1000).toFixed(2)}s
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressBar;