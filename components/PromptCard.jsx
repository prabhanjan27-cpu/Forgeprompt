"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const PromptCard = ({
  post,
  handleTagClick,
  handleEdit,
  handleDelete,
}) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const promptRef = useRef(null);

  useEffect(() => {
    const promptElement = promptRef.current;
    if (!promptElement) return;

    const checkOverflow = () => {
      setHasOverflow(promptElement.scrollHeight > promptElement.clientHeight);
    };

    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(promptElement);
    return () => resizeObserver.disconnect();
  }, [post.prompt, expanded]);

  const creatorId = post.creator?._id;
  const profileHref = creatorId ? `/users/${creatorId}` : "#";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Could not copy prompt:", error);
    }
  };

  return (
    <div className="prompt_card">
      <div className="flex items-start justify-between gap-5">
        <Link
          href={profileHref}
          className="flex flex-1 cursor-pointer items-center justify-start gap-3"
          aria-label={`View ${post.creator?.username || "user"} profile`}
        >
          {post.creator?.image ? (
            <Image
              src={post.creator.image}
              alt={`${post.creator.username || "User"} avatar`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200" />
          )}

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator?.username || "Unknown user"}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator?.email}
            </p>
          </div>
        </Link>

        <button
          type="button"
          className="copy_btn"
          onClick={handleCopy}
          aria-label="Copy prompt"
        >
          <Image
            src={
              copied
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt=""
            width={12}
            height={12}
          />
        </button>
      </div>

      <p
        ref={promptRef}
        className={`my-4 font-satoshi text-sm text-gray-700 ${
          expanded ? "" : "prompt_text_collapsed"
        }`}
      >
        {post.prompt}
      </p>

      {(hasOverflow || expanded) && (
        <button
          type="button"
          className="mb-4 cursor-pointer font-inter text-sm text-blue-600 hover:underline"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      <button
        type="button"
        className="font-inter cursor-pointer text-sm blue_gradient"
        onClick={() => handleTagClick?.(post.tag)}
      >
        #{post.tag}
      </button>

      {session?.user?.id === creatorId && pathName === "/profile" && (
        <div className="mt-5 flex justify-end gap-6 border-t border-gray-100 pt-3">
          <button
            type="button"
            className="font-inter cursor-pointer text-sm green_gradient"
            onClick={handleEdit}
          >
            Edit
          </button>

          <button
            type="button"
            className="font-inter cursor-pointer text-sm orange_gradient"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
