import envConfig from "../env.config";
import jwt from "jsonwebtoken";
import ms from "ms";
envConfig;

const generateToken = (yourPayload: string, expiresIn: number) => {
  if (typeof process.env.JWT_KEY_SECRET === "string") {
    const options: jwt.SignOptions = {
      expiresIn: expiresIn,
    };
    return jwt.sign(
      { payload: yourPayload },
      process.env.JWT_KEY_SECRET as string,
      options
    );
  }
};

export default generateToken;
