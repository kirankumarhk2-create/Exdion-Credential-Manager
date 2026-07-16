import { promises as fs } from "fs";
import path from "path";

export type VaultUser = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  status?: string;
};

export type VaultCredential = {
  id: number;
  name: string;
  email: string;
  password: string;
  description: string;
};

export type VaultData = {
  users: VaultUser[];
  credentials: VaultCredential[];
  theme: string;
};

const dataFilePath = path.join(process.cwd(), "public", "data", "vault-data.json");

const defaultData: VaultData = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      name: "Kiran Kumar HK",
      email: "kiran@exdion.com",
      role: "admin",
      status: "approved",
    },
  ],
  credentials: [],
  theme: "ocean",
};

export async function readVaultData(): Promise<VaultData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, "utf8");
    const parsed = JSON.parse(fileContent) as Partial<VaultData>;

    return {
      users: parsed.users ?? defaultData.users,
      credentials: parsed.credentials ?? defaultData.credentials,
      theme: parsed.theme ?? defaultData.theme,
    };
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function writeVaultData(data: VaultData): Promise<VaultData> {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  const nextData = {
    users: data.users ?? defaultData.users,
    credentials: data.credentials ?? defaultData.credentials,
    theme: data.theme ?? defaultData.theme,
  };

  await fs.writeFile(dataFilePath, JSON.stringify(nextData, null, 2));
  return nextData;
}
