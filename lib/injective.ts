export async function simulateRewardClaim(
  points: number
) {
  if (points < 100) {
    return {
      success: false,
      reward: null,
      txHash: null,
      pointsRequired: 100,
      currentPoints: points,
      message:
        "You need at least 100 points to claim rewards.",
    };
  }

  const rewardAmount = Math.floor(points / 100) * 10;

  return {
    success: true,
    reward: `${rewardAmount} USDC`,
    txHash: `inj_${Math.random()
      .toString(36)
      .substring(2, 14)}`,
    network: "Injective",
    protocol: "CCTP Demo",
    message:
      "Reward successfully distributed through Injective CCTP simulation.",
  };
}