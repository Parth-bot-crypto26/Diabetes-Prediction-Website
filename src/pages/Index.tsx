import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import DiabetesPredictionForm from "@/components/DiabetesPredictionForm";

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div>
      {showLoading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <DiabetesPredictionForm />
      )}
    </div>
  );
};

export default Index;
