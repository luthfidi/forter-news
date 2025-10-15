// Admin wallet addresses for MVP resolution system
// These wallets have permission to resolve news outcomes

export const ADMIN_WALLETS = [
  // Primary admin wallet (replace with actual address)
  '0x580B01f8CDf7606723c3BE0dD2AaD058F5aECa3d',

  // Backup admin wallet (replace with actual address)
  '0x0987654321098765432109876543210987654321',
];

/**
 * Check if a given wallet address is an admin
 * @param address - Wallet address to check
 * @returns boolean - True if address is admin
 */
export function isAdmin(address: string | undefined): boolean {
  if (!address) return false;

  // Normalize addresses to lowercase for comparison
  const normalizedAddress = address.toLowerCase();
  return ADMIN_WALLETS.some(admin => admin.toLowerCase() === normalizedAddress);
}

/**
 * Admin permissions and capabilities
 */
export const ADMIN_PERMISSIONS = {
  canResolveNews: true,
  canModerateContent: true, // Future: content moderation
  canManageDisputes: true,  // Future: dispute resolution
} as const;
