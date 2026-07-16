import { getAllUsers } from "./db";
import { readVaultData, writeVaultData, type VaultUser } from "./vaultStore";

export async function syncUsersFromDatabase(): Promise<VaultUser[]> {
  try {
    // Fetch users from database
    const dbUsers = await getAllUsers();

    // Read current vault data
    const vaultData = await readVaultData();

    // Convert database users to vault users (keeping password from vault for existing users)
    const syncedUsers: VaultUser[] = dbUsers.map((dbUser) => {
      const existingUser = vaultData.users.find(
        (u) => u.username === dbUser.username
      );
      return {
        id: dbUser.id,
        username: dbUser.username,
        password: existingUser?.password || "",
        name: dbUser.name || "",
        email: dbUser.email,
        role: dbUser.role || "user",
        status: dbUser.status || "pending",
      };
    });

    // Update vault data with synced users
    await writeVaultData({
      ...vaultData,
      users: syncedUsers,
    });

    console.log(`Successfully synced ${syncedUsers.length} users from database`);
    return syncedUsers;
  } catch (error) {
    console.error("Error syncing users from database:", error);
    throw error;
  }
}

export async function getStoredUsernames(): Promise<string[]> {
  try {
    const vaultData = await readVaultData();
    return vaultData.users.map((user) => user.username);
  } catch (error) {
    console.error("Error getting stored usernames:", error);
    throw error;
  }
}
