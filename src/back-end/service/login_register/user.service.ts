import { Profile, use } from "passport";
import { UserRepository } from "../../repository/UserRepository";
import { UserCreateDTO } from "../../models/DTO/user/UserCreateDTO";
import { UserEntity } from "../../models/Entity/user/UserEntity";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UserEntityAuth } from "../../models/Entity/user/UserEntityAuth";

export class UserService {
  userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  async saveTheUserOnRepository(user: UserCreateDTO) {
    const password: string = await this.hashPassword(user.password);
    const newUser: UserEntity = new UserEntity(
      user.username,
      password,
      user.email
    );
    this.userRepository.saveTheUserOnRepository(newUser, uuidv4());
    return { status: 201, message: "User created successfully completed" };
  }

  async loginToAccount(email: string, password: string) {
    try {
      const user = (await this.userRepository.findUserByEmail(email))[0];
      if (user)
        if (await this.verifyPassword(password, user.passwordhash))
          return { message: "ACESSO LIBERADO", status: 200, email: user.email };
      return { message: "ACESSO NEGADO", status: 400 };
    } catch (e) {
      console.error(e);
      return { errorMessage: "error", status: 500 };
    }
  }
  async AddUserOnRepositoryAuth(profile: Profile) {
    const userRepository = new UserRepository();
    const userAuth: UserEntityAuth = new UserEntityAuth(
      uuidv4(),
      profile.displayName,
      profile?.emails?.[0].value ?? "" // Use o valor do email se definido, caso contrário, string vazia
    );
    await userRepository.saveTheUserAUTH_OnRepository(userAuth);
    console.log(userAuth);

    return { status: 201, message: "User created successfully completed" };
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Custo computacional (ajuste conforme necessário)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, hashedPassword);

    return match;
  }

  async gettingAllUsersOfRepository() {
    return await this.userRepository.getAllUsers();
  }
}
