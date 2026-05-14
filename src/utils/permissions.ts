/**
 * Operation-based permission helpers.
 *
 * The server's access-control layer sends the complete list of permitted
 * operation keys in `access.operations` on login / whoami. The UI stores
 * that list and calls `hasOperation()` to gate controls — no client-side
 * copy of C++ tier constants needed.
 *
 * Operation key catalogue lives in:
 *   coderoast-security/access_control/api/coderoast/access_control/policy_keys.hpp
 */

/**
 * Returns true if `operationKey` is included in the provided operations list.
 * Safely returns false for null/empty lists.
 */
export function hasOperation(operations: string[], operationKey: string): boolean {
    return operations.includes(operationKey)
}

/**
 * Returns the quota limit for `quotaKey` from an operations context,
 * or null if no quota is set for that key.
 */
export function getQuotaFromList(
    quotas: Array<{ key: string; limit: number }>,
    quotaKey: string,
): number | null {
    const q = quotas.find((x) => x.key === quotaKey)
    return q?.limit ?? null
}


