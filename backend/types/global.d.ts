declare namespace Express {
  export interface Request {
    user: {
      userId?: string | number;
      role?: "user" | "admin";
    };
  }
}
