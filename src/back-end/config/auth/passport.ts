import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  Profile,
} from "passport-google-oauth20";
import { UserService } from "../../service/login_register/user.service";
import envConfig from "../env.config";

envConfig;

const userService = new UserService();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:9090/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      // console.log("Google Profile ID:", profile.id);
      // console.log("Google Display Name:", profile.displayName);
      // console.log("Google Email:", profile.emails?.[0]?.value);
      await userService.AddUserOnRepositoryAuth(profile);

      return done(null, profile);
    }
  )
);

passport.serializeUser<Profile, string>((user, done) => {
  done(null, user.id);
});

passport.deserializeUser<string, Profile>((id, done) => {
  // Busca o usuário na simulação em memória pelo ID
  // const user = users.find((user) => user.id === id);

  // if (user) {
  done(null, id);
  // } else {
  //   done(null, null as any); // Ou done(null, false);
  // }
});

export default passport;
