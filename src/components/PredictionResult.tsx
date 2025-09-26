import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// The props now directly match the API's response keys for simplicity
interface PredictionResultProps {
  predictionClass: number; // 0 or 1 from the model
  confidence: number;
  onReset: () => void;
}

const PredictionResult = ({ predictionClass, confidence, onReset }: PredictionResultProps) => {
  // Determine if the result is positive (1) or negative (0)
  const isPositive = predictionClass === 1;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto fade-in card-3d float-3d">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Prediction Result
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl ${
            isPositive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {isPositive ? '⚠️' : '✅'}
          </div>

          <div className="space-y-2">
            <h3 className={`text-2xl font-bold ${
              isPositive ? 'text-red-600' : 'text-green-600'
            }`}>
              {isPositive ? 'High Risk of Diabetes' : 'Low Risk of Diabetes'}
            </h3>
            <p className="text-muted-foreground">
              Based on the provided health parameters
            </p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Confidence Level</div>
            <div className="text-2xl font-bold text-primary">
              {confidence.toFixed(1)}%
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isPositive ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm ${
              isPositive ? 'text-red-700' : 'text-green-700'
            }`}>
              {isPositive 
                ? 'Please consult with a healthcare professional for proper medical evaluation and advice.'
                : 'Your current health parameters suggest a lower risk, but regular health checkups are still recommended.'
              }
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onReset}
              className="w-full button-3d text-white"
            >
              Make Another Prediction
            </Button>
            
            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Disclaimer:</strong> This prediction is for educational purposes only 
                and should not replace professional medical diagnosis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResult;
