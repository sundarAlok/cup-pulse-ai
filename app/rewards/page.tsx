import PointsCard from "@/components/PointsCard";
import RewardCard from "@/components/RewardCard";

export default function RewardsPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-8 shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-medium text-blue-600">
            Fan Engagement System
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Fan Rewards
          </h1>

          <p className="mt-4 max-w-3xl text-slate-600">
            Earn points through daily participation and match
            predictions. Redeem rewards through the Injective
            ecosystem reward system.
          </p>
        </div>
      </section>

      {/* Rewards Rules Row */}
      <section className="grid gap-4 md:grid-cols-4">
        {/* Daily Check-In */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">
            Daily Check-In
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Earn 10 points every day.
          </p>

          <button className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700">
            Claim +10 Points
          </button>
        </div>

        {/* Prediction */}
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Prediction Submission
          </p>

          <h3 className="mt-4 text-4xl font-bold text-blue-600">
            +5
          </h3>
        </div>

        {/* Correct */}
        <div className="rounded-3xl border border-green-100 bg-green-50 p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Correct Prediction
          </p>

          <h3 className="mt-4 text-4xl font-bold text-green-600">
            +50
          </h3>
        </div>

        {/* Wrong */}
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Wrong Prediction
          </p>

          <h3 className="mt-4 text-4xl font-bold text-red-600">
            -20
          </h3>
        </div>
      </section>

      {/* Main Cards */}
      <section className="grid gap-6 lg:grid-cols-2">
        <PointsCard />
        <RewardCard />
      </section>

      {/* Injective Reward Flow */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Injective Reward Flow
        </h2>

        <p className="mt-2 text-slate-500">
          Fans earn points from participation and predictions.
          Every 100 points can be redeemed for 1 USDT reward on
          Injective Testnet.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="font-semibold">
              Daily Activity
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Earn points through check-ins.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="font-semibold">
              Predictions
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Submit predictions and earn rewards.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="font-semibold">
              Claim Reward
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Redeem once you reach 100 points.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="font-semibold">
              Injective Testnet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Receive USDT through the reward flow.
            </p>
          </div>
        </div>
      </section>

      {/* Reward History */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Reward History
        </h2>

        <div className="rounded-2xl bg-slate-50 p-5 text-slate-500">
          No rewards claimed yet.
        </div>
      </section>
    </div>
  );
}