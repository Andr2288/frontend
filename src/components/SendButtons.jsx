import { useState } from "react";
import { Send, Zap, Radio } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const SendButtons = ({ count, onSendStart }) => {
    const [loading, setLoading] = useState(null);

    const getChannelName = (channel) => {
        switch (channel) {
            case "SYNC_HTTP": return "Sync HTTP";
            case "ASYNC_HTTP": return "Async HTTP";
            case "KAFKA": return "Kafka";
            default: return channel;
        }
    };

    const handleSend = async (channel) => {
        if (count === 0) {
            toast.error("Please generate SMS messages first!");
            return;
        }

        setLoading(channel);
        const loadingToast = toast.loading(`Sending via ${getChannelName(channel)}...`);

        try {
            const response = await axiosInstance.post("/sms/send", {
                count,
                channel
            });

            toast.success(`Started sending ${count} messages via ${getChannelName(channel)}!`, {
                id: loadingToast,
            });

            onSendStart(response.data);
        } catch (error) {
            console.error(`Error sending via ${channel}:`, error);

            if (error.code === "ERR_NETWORK") {
                toast.error("Cannot connect to server. Please check if Service A is running.", {
                    id: loadingToast,
                    duration: 6000,
                });
            } else if (error.response?.status === 500) {
                toast.error("Server error. Please check Service B connection.", {
                    id: loadingToast,
                });
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error, {
                    id: loadingToast,
                });
            } else {
                toast.error(`Failed to send via ${getChannelName(channel)}`, {
                    id: loadingToast,
                });
            }
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Send Messages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sync HTTP */}
                <button
                    onClick={() => handleSend("SYNC_HTTP")}
                    disabled={loading !== null || count === 0}
                    className="flex flex-col items-center space-y-2 p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Send className={`w-8 h-8 ${loading === "SYNC_HTTP" ? "animate-pulse text-blue-600" : "text-gray-700"}`} />
                    <span className="font-medium text-gray-900">Sync HTTP</span>
                    <span className="text-sm text-gray-500">Sequential requests</span>
                </button>

                {/* Async HTTP */}
                <button
                    onClick={() => handleSend("ASYNC_HTTP")}
                    disabled={loading !== null || count === 0}
                    className="flex flex-col items-center space-y-2 p-6 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Zap className={`w-8 h-8 ${loading === "ASYNC_HTTP" ? "animate-pulse text-green-600" : "text-gray-700"}`} />
                    <span className="font-medium text-gray-900">Async HTTP</span>
                    <span className="text-sm text-gray-500">Parallel requests</span>
                </button>

                {/* Kafka */}
                <button
                    onClick={() => handleSend("KAFKA")}
                    disabled={loading !== null || count === 0}
                    className="flex flex-col items-center space-y-2 p-6 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Radio className={`w-8 h-8 ${loading === "KAFKA" ? "animate-pulse text-purple-600" : "text-gray-700"}`} />
                    <span className="font-medium text-gray-900">Kafka</span>
                    <span className="text-sm text-gray-500">Message queue</span>
                </button>
            </div>
        </div>
    );
};

export default SendButtons;