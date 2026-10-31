import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const GET = async (request) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    let filter = {}; 

    if (query) {
      // The same search text can match prompt content, a tag, or a username.
      const searchTerm = query.replace(/^[#@]/, "");
      const regex = { $regex: escapeRegex(searchTerm), $options: "i" };
      const matchingUsers = await User.find({ username: regex }).select("_id");

      const conditions = [
        { prompt: regex },
        { tag: regex },
      ];

      if (matchingUsers.length > 0) {
        conditions.push({
          creator: { $in: matchingUsers.map((user) => user._id) },
        });
      }

      filter = { $or: conditions };
    }

    const prompts = await Prompt.find(filter)
      .populate("creator")
      .sort({ _id: -1 });

    return Response.json(prompts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch prompts:", error);
    return Response.json(
      { message: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
};
