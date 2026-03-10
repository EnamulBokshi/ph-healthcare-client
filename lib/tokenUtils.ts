"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!jwtAccessSecret) {
  throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
}

const getTokenRemainingTime = (token: string): number => {
  if (!token) return 0;

  try {
    const tokenPayload = jwtAccessSecret
      ? (jwt.verify(token, jwtAccessSecret) as JwtPayload)
      : (jwt.decode(token) as JwtPayload);

    if (tokenPayload && !tokenPayload.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = (tokenPayload.exp as number) - currentTime;
    return remainingTime > 0 ? remainingTime : 0;
  } catch (error) {
    console.error("Error decoding token:", error);
    return 0;
  }
};

export const setTokenInCookies = async (name: string, token: string) => {
  const maxAgeInSeconds = getTokenRemainingTime(token);

  if (maxAgeInSeconds > 0) {
    await setCookie(name, token, maxAgeInSeconds);
  }
};
