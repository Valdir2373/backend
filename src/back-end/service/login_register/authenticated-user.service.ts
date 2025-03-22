// Serviço AuthenticatedUser (authenticated-user.service.ts)

import { UserRepository } from "../../repository/UserRepository";

export class AuthenticatedUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserDataByEmail(email: string) {
    const user = (await this.userRepository.findUserByEmail(email))[0];

    if (user) {
      return {
        username: user.username,
        email: user.email,
      };
    }
    return null;
  }
}
