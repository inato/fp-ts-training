export const unimplemented = () => undefined as any;
export const unimplementedAsync = () => () => undefined as any;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
