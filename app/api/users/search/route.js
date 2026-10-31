import { connectToDB } from "@utils/database";
import User from "@models/user";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const GET = async (request) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return Response.json([], { status: 200 });
    }

    const users = await User.find({
      username: {
        $regex: escapeRegex(query.replace(/^@/, "")),
        $options: "i",
      },
    })
      .select("_id username image")
      .limit(20);

    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to search users:", error);
    return Response.json(
      { message: "Failed to search users" },
      { status: 500 }
    );
  }
};