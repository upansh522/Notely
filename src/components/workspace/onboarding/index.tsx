"use client";
import { useEffect, useState } from "react";
import { Keyboard, Sparkles } from "lucide-react";

const OnboardingSteps = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (hasSeenOnboarding) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Welcome to Notely.ai!</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded">
              <Keyboard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Quick Save</h3>
              <p className="text-sm text-muted-foreground">
                Press Ctrl + S to save your notes instantly
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Select text and click the sparkles icon to get AI-powered insights
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="mt-6 w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default OnboardingSteps;