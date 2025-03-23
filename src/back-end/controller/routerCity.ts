import { Router } from "express";
import { ClimateService } from "../service/climateCity/climateService.js";
const routerCity = Router();

routerCity.post("/Climate/City/", async (req, res) => {
  const clima = new ClimateService();
  const requis = req.body.city;
  const dados = await clima.GetClimateByCity(requis);
  res.send(dados);
});

export default routerCity;
