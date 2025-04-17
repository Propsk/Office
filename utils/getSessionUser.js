import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export const getSessionUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    console.log("🔍 SESSION:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      console.warn("⚠️ Session missing user ID");
      return null;
    }

    return session;
  } catch (error) {
    console.error("❌ Error in getSessionUser:", error);
    return null;
  }
};
