export async function toErrorable<P, R>(fn: (...args: P[]) => Promise<R>): Promise<R | undefined> {
  try {
    return await fn()
  }
  catch {
    return undefined
  }
}
