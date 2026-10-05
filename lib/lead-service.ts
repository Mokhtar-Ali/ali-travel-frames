import "server-only";

export function isLeadServiceAvailable() {
  // No persistence or delivery adapter is implemented. Future availability
  // must depend on that adapter and its configuration, not an unused env var.
  return false;
}
