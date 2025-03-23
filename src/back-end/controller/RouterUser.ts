import { Router, Request, Response } from "express";
import { UserCreateDTO } from "../models/DTO/user/UserCreateDTO.js";
import { UserService } from "../service/login_register/user.service.js";
import generateTokenJWT from "../config/auth/jwt.js";

const routerUser = Router();
const userService = new UserService();

routerUser.post("/User", registerUser);
routerUser.get("/User/all", getAllUsers);
routerUser.post("/User/Login", loginUser);

async function registerUser(req: Request, res: Response) {
  try {
    const userDTO: UserCreateDTO = req.body;
    const register = await userService.saveTheUserOnRepository(userDTO);
    res.status(register.status).json({ message: `${register.message}` });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await userService.gettingAllUsersOfRepository();

    res.send(users);
  } catch (error) {
    // Lidar com erros adequadamente
    console.error("Err the request users:", error);
    res.status(500).send("Err the internal server");
  }
}

async function loginUser(req: Request, res: Response) {
  const response = await userService.loginToAccount(
    req.body.email,
    req.body.password
  );
  if (!(response.status === 200))
    res.status(response.status).send({ message: response.message });
  const token = generateTokenJWT(response.email, 15);
  console.log("chegou aqui");

  // res.cookie("token", "ac", {
  //   httpOnly: true,
  //   secure: true, // Alterado para false
  //   sameSite: "none",
  //   path: "/",
  //   maxAge: 94894375894357,
  // });

  res.json({ token: "Enviado" });
}

export default routerUser;
