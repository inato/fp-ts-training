export const unimplemented = (..._args: any) => undefined as any
export const unimplementedAsync = () => () => undefined as any

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
} 