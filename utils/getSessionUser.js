import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export const getSessionUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    return session;
  } catch (error) {
    console.error("Error in getSessionUser:", error);
    return null;
  }
};
