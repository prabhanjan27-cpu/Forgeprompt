"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Profile from "@components/Profile";

const UserProfilePage = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setUser(null);
      setPosts([]);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      setUser(null);
      setPosts([]);

      try {
        const [userResponse, postsResponse] = await Promise.all([
          fetch(`/api/users/${id}`, {
            signal: controller.signal,
          }),
          fetch(`/api/users/${id}/posts`, {
            signal: controller.signal,
          }),
        ]);

        if (userResponse.status === 404) {
          setUser(null);
          setPosts([]);
          return;
        }

        if (!userResponse.ok || !postsResponse.ok) {
          throw new Error("Could not load this profile.");
        }

        const [userData, postsData] = await Promise.all([
          userResponse.json(),
          postsResponse.json(),
        ]);

        if (cancelled) return;

        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        if (cancelled) return;

        if (err.name === "AbortError") return;

        setError("Could not load this profile.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return <p className="desc">Loading profile...</p>;
  }

  if (error) {
    return <p className="desc">{error}</p>;
  }

  if (!user) {
    return <p className="desc">User not found.</p>;
  }

  return (
    <Profile
      name={user.username}
      desc={`Prompts shared by ${user.username}`}
      data={posts}
    />
  );
};

export default UserProfilePage;