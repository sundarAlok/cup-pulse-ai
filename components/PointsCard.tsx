export default function PointsCard() {
  const points = 120;

  const nextReward = 200;
  const progress = (points / nextReward) * 100;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Fan Points
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            {points}
          </h2>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
          <span className="text-xl">🏆</span>
        </div>
      </div>

      <p className="mt-3 text-slate-500">
        Total points earned from participation and predictions.
      </p>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">
            Next Reward
          </span>

          <span className="font-medium text-slate-700">
            {points}/{nextReward}
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${Math.min(progress, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Earning Rules */}
      <div className="mt-8 space-y-3">
        <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-slate-600">
            Daily Check-In
          </span>

          <span className="font-semibold text-green-600">
            +10
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-slate-600">
            Prediction Submission
          </span>

          <span className="font-semibold text-blue-600">
            +5
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-slate-600">
            Correct Prediction
          </span>

          <span className="font-semibold text-purple-600">
            +20
          </span>
        </div>
      </div>
    </div>
  );
}