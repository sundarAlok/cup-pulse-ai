import assert from "node:assert/strict";
import test from "node:test";

import { resolveDemoPredictionSubmission } from "../app/api/predictions/submit/route";

test("uses the authenticated user id when the request body omits one", () => {
  const result = resolveDemoPredictionSubmission(
    { predictedWinner: "Team A" },
    42
  );

  assert.deepEqual(result, {
    userId: 42,
    predictedWinner: "Team A",
  });
});

test("rejects unsupported team names", () => {
  const result = resolveDemoPredictionSubmission(
    { predictedWinner: "Team Z" },
    42
  );

  assert.equal(result.error, "Invalid prediction data");
});
