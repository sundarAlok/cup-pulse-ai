export default function PointsCard() {
  const points = 120;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Fan Points
      </h2>

      <div className="text-6xl font-bold text-cyan-400">
        {points}
      </div>

      <p className="text-zinc-400 mt-3">
        Total earned points
      </p>

      <div className="mt-6 space-y-2 text-sm text-zinc-400">
        <p>Daily Check-in → +10</p>
        <p>Prediction Submission → +5</p>
        <p>Correct Prediction → +20</p>
      </div>
    </div>
  );
}