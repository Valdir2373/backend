import envConfig from "../env.config";
import jwt from "jsonwebtoken";
envConfig;

console.log(process.env.JWT_KEY_SECRET);

const generateToken = (yourPayload: string, expiresIn: string) => {
  return jwt.sign({ payload: yourPayload }, process.env.JWT_KEY_SECRET, {
    expiresIn: expiresIn,
  });
};

export default generateToken;
