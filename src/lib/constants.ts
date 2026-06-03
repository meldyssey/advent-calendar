export const QUERY_KEYS = {
  project: {
    all: ["project"],
    list: (userId: string) => ["project", "list", userId],
    byId: (projectId: string) => ["project", "byId", projectId],
  },
};
