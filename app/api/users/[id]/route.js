import { connectToDB } from "@utils/database";
import User from "@models/user";

export const GET = async (_request, { params }) => {
  try {
    await connectToDB();

    const { id } = await params;
    const user = await User.findById(id).select("_id username image");

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return Response.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
};