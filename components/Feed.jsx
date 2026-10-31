"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => (
  <div className="mt-16 prompt_layout">
    {data.map((post) => (
      <PromptCard
        key={post._id}
        post={post}
        handleTagClick={handleTagClick}
      />
    ))}
  </div>
);

export const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (searchText.trim()) params.set("q", searchText.trim());

        const response = await fetch(`/api/prompt?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Could not load prompts.");

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load prompts.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, searchText.trim() ? 300 : 0);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchText]);

  const handleTagClick = (tag) => {
    setSearchText(tag.replace(/^#/, ""));
  };

  return (
    <section className="feed">
      <form className="relative w-full" onSubmit={(event) => event.preventDefault()}>
        <input
          type="search"
          placeholder="Search for a prompt, tag, or username"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          aria-label="Search prompts, tags, and usernames"
          className="search_input peer"
        />
      </form>

      {loading && <p className="desc mt-6">Searching...</p>}
      {error && <p className="desc mt-6">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="desc mt-6">No prompts found.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};
