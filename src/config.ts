export const JWT_CONFIGS = {
  SECRET: process.env.JWT_SECRET || "secret",
  EXP: process.env.JWT_EXPIRES_IN || "1d",
};

export const CookieProps = {
  Key: "ExpressGeneratorTs",
  Secret: process.env.COOKIE_SECRET || "",
  Options: {
    httpOnly: true,
    signed: true,
    path: process.env.COOKIE_PATH ?? "",
    maxAge: Number(process.env.COOKIE_EXP ?? 0),
    domain: process.env.COOKIE_DOMAIN ?? "",
    secure: process.env.SECURE_COOKIE === "true",
  },
};

export const NODE_ENV=process.env.NODE_ENV || "development";