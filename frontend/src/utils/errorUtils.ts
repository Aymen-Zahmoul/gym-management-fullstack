/**
 * Safe error message extractor to eliminate 'any' types in catch clauses
 */
export function getErrorMessage(err: unknown, fallback = 'Une erreur inattendue est survenue.'): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return fallback;
}
