export type DemoMatchState = {
  started: boolean;
  countdown: number | null;
  resolved: boolean;
  result: string | null;
  userPrediction: string | null;
  points: number;
  message: string | null;
};

const DEMO_MATCH_STORAGE_KEY = "cuppulse-demo-match-state";

const emptyState: DemoMatchState = {
  started: false,
  countdown: null,
  resolved: false,
  result: null,
  userPrediction: null,
  points: 0,
  message: null,
};

export function readDemoMatchState(): DemoMatchState {
  if (typeof window === "undefined") {
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(DEMO_MATCH_STORAGE_KEY);

    if (!raw) {
      return emptyState;
    }

    const parsed = JSON.parse(raw) as Partial<DemoMatchState>;

    return {
      ...emptyState,
      ...parsed,
    };
  } catch {
    return emptyState;
  }
}

export function writeDemoMatchState(state: Partial<DemoMatchState>) {
  if (typeof window === "undefined") {
    return emptyState;
  }

  const current = readDemoMatchState();
  const nextState = {
    ...current,
    ...state,
  };

  window.localStorage.setItem(DEMO_MATCH_STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
}

export function startDemoCountdown() {
  const current = readDemoMatchState();

  if (!current.userPrediction) {
    return writeDemoMatchState({
      message: "Make a prediction on the predictions page before starting the demo countdown.",
    });
  }

  return writeDemoMatchState({
    started: true,
    countdown: 10,
    resolved: false,
    result: null,
    message: "Countdown started. Your prediction is locked until the match resolves.",
  });
}

export function registerDemoPrediction(prediction: string) {
  const current = readDemoMatchState();

  if (current.resolved) {
    return {
      ...current,
      message: "The demo match has already been resolved.",
    };
  }

  if (current.userPrediction) {
    return {
      ...current,
      message: "Your demo prediction is already locked for this match.",
    };
  }

  const nextState = {
    ...current,
    userPrediction: prediction,
    points: current.points - 7,
    message: `Prediction locked for ${prediction}.`,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(DEMO_MATCH_STORAGE_KEY, JSON.stringify(nextState));
  }

  return nextState;
}

export function resolveDemoMatch(winner: string) {
  const current = readDemoMatchState();
  const prediction = current.userPrediction;
  let nextPoints = current.points;

  if (prediction) {
    nextPoints = prediction === winner ? nextPoints + 50 : nextPoints - 50;
  }

  const nextState = {
    ...current,
    resolved: true,
    countdown: 0,
    result: winner,
    points: nextPoints,
    message: `${winner} won the demo match.`,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(DEMO_MATCH_STORAGE_KEY, JSON.stringify(nextState));
  }

  return nextState;
}

export function resetDemoMatchState() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DEMO_MATCH_STORAGE_KEY);
  }

  return emptyState;
}
