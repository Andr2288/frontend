import { useState } from "react";
import GenerateForm from "../components/GenerateForm";
import SendButtons from "../components/SendButtons";
import ProgressBar from "../components/ProgressBar";

const HomePage = () => {
    const [generatedCount, setGeneratedCount] = useState(0);
    const [currentRun, setCurrentRun] = useState(null);

    const handleGenerated = (data) => {
        setGeneratedCount(data.count);
        setCurrentRun(null); // Reset previous run
    };

    const handleSendStart = (data) => {
        setCurrentRun({
            runId: data.runId,
            channel: data.channel
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            SMS Generator
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Generate and send SMS messages through different channels
                        </p>
                    </div>

                    {/* Generate Form */}
                    <GenerateForm onGenerated={handleGenerated} />

                    {/* Info Card */}
                    {generatedCount > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800">
                                ✓ Generated <span className="font-semibold">{generatedCount}</span> SMS messages.
                                Choose a delivery channel below.
                            </p>
                        </div>
                    )}

                    {/* Send Buttons */}
                    <SendButtons
                        count={generatedCount}
                        onSendStart={handleSendStart}
                    />

                    {/* Progress Bar */}
                    {currentRun && (
                        <ProgressBar
                            runId={currentRun.runId}
                            channel={currentRun.channel}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;