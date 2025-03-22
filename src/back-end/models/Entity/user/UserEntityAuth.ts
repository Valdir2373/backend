export class UserEntityAuth {
  username: string;
  email: string;
  id: string;
  constructor(id: string, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}
