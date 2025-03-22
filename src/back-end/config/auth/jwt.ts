import envConfig from "../env.config.ts";
import jwt from "jsonwebtoken";
envConfig;

const generateToken = (yourPayload: string, expiresIn: string) => {
  return jwt.sign({ payload: yourPayload }, "process.env.JWT_KEY_SECRET", {
    expiresIn: expiresIn,
  });
};

export default generateToken;
