import express, { NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routerAI from "../controller/RouterAI.js";
import routerCity from "../controller/routerCity.js";
import RouterAuth from "../controller/RouterAuth.js";
import RouterUser from "../controller/RouterUser.js";
import "reflect-metadata";

export default class App_Express {
  private app: any;
  private port: number = 9090;
  constructor() {
    this.app = express();
    this.app.use(cookieParser());

    this.app.use(
      cors({
        origin: "https://dev-valdir-port.netlify.app",
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.createRouter();
  }
  get listen() {
    return this.app.listen(this.port, () =>
      console.log(`\x1b[32m estou rodando em: http://localhost:9090/ \x1b[0m`)
    );
  }
  createRouter() {
    console.log("\x1b[35m   \x1d📌 Subindo Rotas\x1b[0m");
    this.app.use(routerAI);
    this.app.use(routerCity);
    this.app.use(RouterAuth);
    this.app.use(RouterUser);
  }
}
