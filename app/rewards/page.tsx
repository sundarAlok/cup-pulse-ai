import PointsCard from "@/components/PointsCard";
import RewardCard from "@/components/RewardCard";

export default function RewardsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Fan Rewards
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <PointsCard />
        <RewardCard />
      </div>
    </div>
  );
}