// Usually during training, trainees import both their implementation and the solution
// but only use one at a time to check their results.
// The function `isTestingSolution()` allows testing to toggle between the two
// by using the environment variable `SOLUTION`.

export function isTestingSolution() {
  return process.env.SOLUTION === '1' || process.env.SOLUTION === 'true'
}

// For testing solution only
export function testSolution() {
  return true
}
