/** Simulates network latency for mock calls */
export function delay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Randomly throws an error to simulate failure scenarios */
export function maybeFailWith(probability = 0, message = 'Simulated network error'): void {
  if (Math.random() < probability) {
    throw new Error(message);
  }
}
