import { NeonQueryFunction } from "@neondatabase/serverless";
import { sql } from "../config/DB.js";
import { UserEntity } from "../models/Entity/user/UserEntity.js";
import { UserEntityAuth } from "../models/Entity/user/UserEntityAuth.js";
export class UserRepository {
  async saveTheUserOnRepository(
    newUser: UserEntity,
    id: string
  ): Promise<void> {
    try {
      await sql`INSERT INTO "users" (id, username, passwordHash, email)
      VALUES (${id}, ${newUser.username}, ${newUser.passwordHash}, ${newUser.email})`;
    } catch (error) {
      console.error("Erro ao inserir usuário:", error);
      throw error; // Re-lança o erro para ser tratado na camada superior
    }
  }
  async saveTheUserAUTH_OnRepository(newUser: UserEntityAuth): Promise<void> {
    try {
      await sql`INSERT INTO "users_auth" (id, username, email)
      VALUES (${newUser.id}, ${newUser.username}, ${newUser.email})`;
    } catch (error) {
      console.error("Erro ao inserir usuário:", error);
      throw error; // Re-lança o erro para ser tratado na camada superior
    }
  }
  async getAllUsers(): Promise<Record<string, any>[]> {
    return await sql`SELECT * FROM users`;
  }
  async findUserByEmail(email: string) {
    return await sql`SELECT * FROM users WHERE email = ${email}`;
  }
}
