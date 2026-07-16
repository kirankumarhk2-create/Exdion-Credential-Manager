import { neon } from "@neondatabase/serverless";

let sql: any;

function initializeSQL() {
  if (sql) return sql;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  sql = neon(process.env.DATABASE_URL);
  return sql;
}

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
  status?: string;
};

// Fetch all users from database
export async function getAllUsers(): Promise<User[]> {
  try {
    const sqlFn = initializeSQL();
    const users = await sqlFn`SELECT id, username, email, password, name, role, status FROM users ORDER BY username`;
    return users as User[];
  } catch (error) {
    console.error("Error fetching users from database:", error);
    throw error;
  }
}

// Fetch user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const sqlFn = initializeSQL();
    const users = (await sqlFn`SELECT id, username, email, password, name, role, status FROM users WHERE username = ${username}`) as User[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// Fetch all usernames only
export async function getAllUsernames(): Promise<string[]> {
  try {
    const sqlFn = initializeSQL();
    const users = (await sqlFn`SELECT username FROM users ORDER BY username`) as { username: string }[];
    return users.map((user) => user.username);
  } catch (error) {
    console.error("Error fetching usernames:", error);
    throw error;
  }
}

// Create new user
export async function createUser(
  username: string,
  password: string,
  email: string,
  name: string,
  role: string = "user",
  status: string = "pending"
): Promise<User> {
  try {
    const sqlFn = initializeSQL();
    const user = (await sqlFn`
      INSERT INTO users (username, password, email, name, role, status) 
      VALUES (${username}, ${password}, ${email}, ${name}, ${role}, ${status})
      RETURNING id, username, email, password, name, role, status
    `) as User[];
    return user[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export type Credential = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  password: string;
  description: string;
  created_at?: string;
  updated_at?: string;
};

// Fetch all credentials
export async function getAllCredentials(): Promise<Credential[]> {
  try {
    const sqlFn = initializeSQL();
    const credentials = (await sqlFn`SELECT id, user_id, name, email, password, description, created_at, updated_at FROM credentials ORDER BY name`) as Credential[];
    return credentials;
  } catch (error) {
    console.error("Error fetching credentials:", error);
    throw error;
  }
}

// Fetch credentials by user ID
export async function getCredentialsByUserId(userId: number): Promise<Credential[]> {
  try {
    const sqlFn = initializeSQL();
    const credentials = (await sqlFn`SELECT id, user_id, name, email, password, description, created_at, updated_at FROM credentials WHERE user_id = ${userId} ORDER BY name`) as Credential[];
    return credentials;
  } catch (error) {
    console.error("Error fetching credentials for user:", error);
    throw error;
  }
}

// Create new credential
export async function createCredential(
  userId: number,
  name: string,
  email: string,
  password: string,
  description: string
): Promise<Credential> {
  try {
    const sqlFn = initializeSQL();
    const credential = (await sqlFn`
      INSERT INTO credentials (user_id, name, email, password, description, created_at, updated_at) 
      VALUES (${userId}, ${name}, ${email}, ${password}, ${description}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, user_id, name, email, password, description, created_at, updated_at
    `) as Credential[];
    return credential[0];
  } catch (error) {
    console.error("Error creating credential:", error);
    throw error;
  }
}

// Update credential
export async function updateCredential(
  id: number,
  name: string,
  email: string,
  password: string,
  description: string
): Promise<Credential> {
  try {
    const sqlFn = initializeSQL();
    const credential = (await sqlFn`
      UPDATE credentials 
      SET name = ${name}, email = ${email}, password = ${password}, description = ${description}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, user_id, name, email, password, description, created_at, updated_at
    `) as Credential[];
    return credential[0];
  } catch (error) {
    console.error("Error updating credential:", error);
    throw error;
  }
}

// Delete credential
export async function deleteCredential(id: number): Promise<boolean> {
  try {
    const sqlFn = initializeSQL();
    await sqlFn`DELETE FROM credentials WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error("Error deleting credential:", error);
    throw error;
  }
}