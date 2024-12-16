import { type NextRequest } from "next/server";

export const getToken = (req: NextRequest): string | null => {
  const authHeader = req.headers?.get("Authorization");
  return authHeader ? authHeader.split("Bearer ")[1] : null;
};