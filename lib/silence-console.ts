/** In production, mute console output except `console.error`. */
export function silenceConsoleExceptError(): void {
  if (process.env.NODE_ENV !== "production") return;

  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
  console.trace = noop;
}
