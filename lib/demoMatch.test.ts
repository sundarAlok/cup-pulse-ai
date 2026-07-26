import test from "node:test";
import assert from "node:assert/strict";
import { registerDemoPrediction, startDemoCountdown, resolveDemoMatch, resetDemoMatchState } from "./demoMatch";

function installLocalStorageStub() {
  const storage = new Map<string, string>();

  const localStorage = {
    getItem(key: string) {
      return storage.has(key) ? storage.get(key)! : null;
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    clear() {
      storage.clear();
    },
  };

  Object.defineProperty(globalThis, "window", {
    value: { localStorage },
    configurable: true,
  });
}

test("locks the demo prediction after the first selection", () => {
  installLocalStorageStub();
  resetDemoMatchState();

  const first = registerDemoPrediction("Team A");
  const second = registerDemoPrediction("Team X");

  assert.equal(first.userPrediction, "Team A");
  assert.equal(second.userPrediction, "Team A");
  assert.equal(second.message, "Your demo prediction is already locked for this match.");
  assert.equal(second.points, -7);
});

test("starts the countdown only after a locked prediction exists", () => {
  installLocalStorageStub();
  resetDemoMatchState();

  const missingPrediction = startDemoCountdown();
  assert.equal(missingPrediction.message, "Make a prediction on the predictions page before starting the demo countdown.");

  registerDemoPrediction("Team X");
  const started = startDemoCountdown();

  assert.equal(started.started, true);
  assert.equal(started.countdown, 10);
  assert.equal(started.message, "Countdown started. Your prediction is locked until the match resolves.");
});

test("resolves a demo match and rewards or penalizes points", () => {
  installLocalStorageStub();
  resetDemoMatchState();

  registerDemoPrediction("Team A");
  const resolved = resolveDemoMatch("Team A");

  assert.equal(resolved.resolved, true);
  assert.equal(resolved.result, "Team A");
  assert.equal(resolved.points, 43);
});
