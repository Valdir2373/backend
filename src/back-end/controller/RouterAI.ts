import { Router } from "express";
import { RespondUser } from "../service/AI/RespondUser.js";
const routerAI = Router();
routerAI.get("/AI", (req, res) => {
  res.send("<h1>ROTA DE IA</h2>");
});
routerAI.post("/AI/request", async (req, res) => {
  const respondUser = new RespondUser();
  const response = await respondUser.respondToUserRequest(req.body.reqUser);
  res.send(response);
});

export default routerAI;
