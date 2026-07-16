export async function simulateRewardClaim(
  points: number
) {
  if (points < 100) {
    return {
      success: false,
      message:
        "Minimum 100 points required.",
    };
  }

  return {
    success: true,
    reward: "10 USDC",
    txHash:
      "injective-demo-" +
      Math.random().toString(36).substring(2, 10),
  };
}