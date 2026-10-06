type IndexingEnvironment = Partial<Record<
  "VERCEL" | "VERCEL_ENV" | "NODE_ENV" | "ATF_LOCAL_INDEXING_TEST",
  string
>>;

// Used only by server configuration; unknown deployments retain their route policies.
export function getIndexingPolicy(env: IndexingEnvironment = process.env) {
  if (env.VERCEL === "1") {
    if (env.VERCEL_ENV === "production") {
      return { environment: "production", noIndex: false } as const;
    }
    if (env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "development") {
      return { environment: env.VERCEL_ENV, noIndex: true } as const;
    }
    return { environment: "unknown", noIndex: false } as const;
  }

  if (env.VERCEL || env.VERCEL_ENV) {
    return { environment: "unknown", noIndex: false } as const;
  }
  if (env.NODE_ENV === "development" || env.ATF_LOCAL_INDEXING_TEST === "1") {
    return { environment: "local", noIndex: true } as const;
  }
  return { environment: "unknown", noIndex: false } as const;
}
