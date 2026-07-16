import PredictionCard from "@/components/PredictionCard";

export default function PredictionsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        AI Match Predictions
      </h1>

      <PredictionCard />
    </div>
  );
}