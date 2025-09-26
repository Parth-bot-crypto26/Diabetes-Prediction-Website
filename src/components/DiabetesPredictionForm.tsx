import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PredictionResult from "./PredictionResult";

const DiabetesPredictionForm = () => {
    // --- State Management ---
    
    const [formData, setFormData] = useState({
        pregnancies: "",
        glucose: "",
        bloodPressure: "",
        skinThickness: "",
        insulin: "",
        bmi: "",
        diabetesPedigree: "",
        age: ""
    });

    const [prediction, setPrediction] = useState<{
        result: boolean;
        confidence: number;
    } | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Helper Functions ---

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const isFormValid = Object.values(formData).every(value => value.trim() !== "");

    // --- 2. API Integration Logic ---
    const handlePredict = async () => {
        setIsLoading(true);
        setError(null);
        setPrediction(null);

        // Map frontend keys to the EXACT feature names expected by the Python model
        const payload = {
            Pregnancies: parseFloat(formData.pregnancies),
            Glucose: parseFloat(formData.glucose),
            BloodPressure: parseFloat(formData.bloodPressure),
            SkinThickness: parseFloat(formData.skinThickness),
            Insulin: parseFloat(formData.insulin),
            BMI: parseFloat(formData.bmi),
            // Correct mapping for DiabetesPedigreeFunction
            DiabetesPedigreeFunction: parseFloat(formData.diabetesPedigree), 
            Age: parseFloat(formData.age)
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorDetail = await response.json().catch(() => ({}));
                throw new Error(errorDetail.details || `Server returned status ${response.status}`);
            }

            const data = await response.json();
            
            // Assuming your Flask API returns:
            // {'prediction_class': 0 or 1, 'outcome_text': '...'}
            
            const isDiabetic = data.prediction_class === 1;
            
            // NOTE: Your model doesn't return confidence directly. 
            // The confidence value here is a mock.
            // For a real confidence score, you would need to modify your main.py
            // to call model.predict_proba() and return the result.
            const confidenceScore = isDiabetic ? 85 + Math.random() * 10 : 90 - Math.random() * 10;
            
            setPrediction({
                result: isDiabetic,
                confidence: confidenceScore
            });

        } catch (err) {
            console.error("Prediction API Call Failed:", err);
            setError(`Prediction failed. Ensure the Python API is running: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Conditional Render: Show Result or Form ---

    if (prediction) {
        return (
            <PredictionResult 
                predictionClass={prediction.result ? 1 : 0} // Pass 0 or 1 to the child component
                confidence={prediction.confidence}
                onReset={() => {
                    setPrediction(null);
                    setError(null);
                    setFormData({
                        pregnancies: "",
                        glucose: "",
                        bloodPressure: "",
                        skinThickness: "",
                        insulin: "",
                        bmi: "",
                        diabetesPedigree: "",
                        age: ""
                    });
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto fade-in card-3d float-3d">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">
                        Diabetes Prediction Model
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Enter the following features to predict Diabetes:
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="text-red-600 bg-red-100 p-3 rounded border border-red-300">
                            <strong>Connection Error:</strong> {error}
                        </div>
                    )}
                    
                    {/* --- Input Fields --- */}
                    <div className="space-y-2">
                        <Label htmlFor="pregnancies" className="text-primary font-medium">
                            Pregnancies
                        </Label>
                        <Input
                            id="pregnancies"
                            type="number"
                            placeholder="0 to 17"
                            value={formData.pregnancies}
                            onChange={(e) => handleInputChange("pregnancies", e.target.value)}
                            className="input-3d"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="glucose" className="text-primary font-medium">
                            Glucose
                        </Label>
                        <Input
                            id="glucose"
                            type="number"
                            placeholder="0 to 199 mg/dL"
                            value={formData.glucose}
                            onChange={(e) => handleInputChange("glucose", e.target.value)}
                            className="input-3d"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bloodPressure" className="text-primary font-medium">
                            Blood Pressure
                        </Label>
                        <Input
                            id="bloodPressure"
                            type="number"
                            placeholder="0 to 122 mm Hg"
                            value={formData.bloodPressure}
                            onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                            className="input-3d"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="skinThickness" className="text-primary font-medium">
                            Skin Thickness
                        </Label>
                        <Input
                            id="skinThickness"
                            type="number"
                            placeholder="0 to 99 mm"
                            value={formData.skinThickness}
                            onChange={(e) => handleInputChange("skinThickness", e.target.value)}
                            className="input-3d"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="insulin" className="text-primary font-medium">
                            Insulin
                        </Label>
                        <Input
                            id="insulin"
                            type="number"
                            placeholder="0 to 846 μU/mL"
                            value={formData.insulin}
                            onChange={(e) => handleInputChange("insulin", e.target.value)}
                            className="input-3d"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bmi" className="text-primary font-medium">
                            BMI
                        </Label>
                        <Input
                            id="bmi"
                            type="number"
                            step="0.1"
                            placeholder="0 to 67.1 kg/m²"
                            value={formData.bmi}
                            onChange={(e) => handleInputChange("bmi", e.target.value)}
                            className="input-3d"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="diabetesPedigree" className="text-primary font-medium">
                            Diabetes Pedigree Function
                        </Label>
                        <Input
                            id="diabetesPedigree"
                            type="number"
                            step="0.001"
                            placeholder="0.078 to 2.42"
                            value={formData.diabetesPedigree}
                            onChange={(e) => handleInputChange("diabetesPedigree", e.target.value)}
                            className="input-3d"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="age" className="text-primary font-medium">
                            Age
                        </Label>
                        <Input
                            id="age"
                            type="number"
                            placeholder="21 to 81 years"
                            value={formData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            className="input-3d"
                        />
                    </div>

                    {/* --- Predict Button --- */}
                    <Button 
                        onClick={handlePredict}
                        disabled={!isFormValid || isLoading}
                        className="w-full button-3d font-semibold py-3 mt-6 text-white"
                    >
                        {isLoading ? "Predicting..." : "Predict"}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center mt-4">
                        This model uses <span className="text-primary font-medium">machine learning</span> to predict diabetes.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DiabetesPredictionForm;
