import { Request, Response, NextFunction, Router } from "express";
import session from "express-session";
import passport from "../config/auth/passport";
import { Profile } from "passport-google-oauth20";
import envConfig from "../config/env.config";
import jwt from "jsonwebtoken";
import { AuthenticatedUserService } from "../service/login_register/authenticated-user.service";
import generateToken from "../config/auth/jwt";
envConfig;

const routerAuth = Router();
const userServiceAuth = new AuthenticatedUserService();
routerAuth.use(
  session({
    secret: "aqui e grande rapá",
    resave: false,
    saveUninitialized: false,
  })
);
routerAuth.use(passport.initialize());
routerAuth.use(passport.session());

interface LogOutOptions {
  keepSessionInfo?: boolean;
}

interface CustomRequest extends Request {
  user?: Profile;
  logout(callback: (err: any) => void): void;
  logout(options: LogOutOptions, callback: (err: any) => void): void;
  session: any;
}

function isLogged(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  const token = req.cookies.token;
  console.log("aqui   ");
  console.log("aqui   " + token);

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_KEY_SECRET, (err: any, decoded: any) => {
    if (err) {
      console.log("aqui: " + token);

      return res.sendStatus(403);
    }
    req.user = decoded;
    next();
  });
}

routerAuth.get(
  "/protected",
  isLogged,
  async (req: CustomRequest, res: Response) => {
    if (req.user) {
      const user = await userServiceAuth.getUserDataByEmail(req.user.payload);

      res.json(user);
    } else {
      res.send("Usuario não autenticado");
    }
  }
);

routerAuth.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

routerAuth.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/acess/Success",
    failureRedirect: "/failed/Failure",
  }),
  (req: CustomRequest, res: Response) => {
    // adicionado callback
    console.log("req.user in /auth/google/callback:", req.user);
  }
);

routerAuth.get("/acess/Success", (req: CustomRequest, res: Response) => {
  console.log("req.user in /acess/Success:", req.user);
  res.send("HOME BEM VINDO AO ACESSO");
  res.end();
});

routerAuth.get("/failed/Failure", (req: Request, res: Response) => {
  res.send("ACESSO NEGADO");
  res.end();
});

routerAuth.get("/loggout", (req: CustomRequest, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Erro ao fazer logout:", err);
      return res.status(500).send("Erro ao fazer logout");
    }
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Erro ao destruir a sessão:", err);
        return res.status(500).send("Erro ao destruir a sessão");
      }
      res.send("goodbye");
    });
  });
});

routerAuth.get("/a", (req: Request, res: Response) => {
  const token = req.cookies.token;
  console.log(token);
  res.json({ mensagem: "Rota protegida acessada com sucesso!", user: "user" });

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_KEY_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.json({ mensagem: "Rota protegida acessada com sucesso!", user: user });
  });
});

routerAuth.get("/login", (req: Request, res: Response) => {
  const token = generateToken("vava@gmail.com", "123"); // Substitua por dados reais do usuário
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use true em produção com HTTPS
    sameSite: "strict",
    maxAge: 60 * 1000 * 15, // 1 hora
  });
  res.json({ token: "Enviado" });
});

routerAuth.post("/login", (req: Request, res: Response) => {
  // Simulação de autenticação (substitua pela sua lógica real)
  const { email, password } = req.body;
  if (email === "vava@gmail.com" && password === "123") {
    const token = generateToken(email, "123");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Login realizado com sucesso!" });
  } else {
    res.status(401).json({ message: "Credenciais inválidas." });
  }
});

export default routerAuth;
