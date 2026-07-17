import PointsCard from "@/components/PointsCard";
import RewardCard from "@/components/RewardCard";

export default function RewardsPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-600">
          Fan Engagement System
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Fan Rewards
        </h1>

        <p className="mt-4 max-w-3xl text-slate-500">
          Earn points by participating in predictions and daily
          activities. Redeem rewards through our Injective-powered
          reward distribution system.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Reward Status
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            Active
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Reward Type
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            USDC
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Distribution
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            CCTP Demo
          </h3>
        </div>
      </section>

      {/* Main Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        <PointsCard />
        <RewardCard />
      </section>

      {/* How to Earn */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">
          How to Earn Points
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="font-semibold">
              Daily Check-In
            </h3>

            <p className="mt-2 text-slate-500">
              Earn 10 points every day.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="font-semibold">
              Submit Prediction
            </h3>

            <p className="mt-2 text-slate-500">
              Earn 5 points per prediction.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="font-semibold">
              Correct Prediction
            </h3>

            <p className="mt-2 text-slate-500">
              Earn 20 bonus points.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}