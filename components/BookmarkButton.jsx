"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function BookmarkButton({ propertyId }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch("/api/bookmarks/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });
        const data = await res.json();
        if (res.ok) setIsBookmarked(data.isBookmarked);
      } catch (err) {
        console.error("Failed to check bookmark status", err);
      }
    };
    checkBookmarkStatus();
  }, [session, propertyId]);

  const handleClick = async () => {
    if (!session) {
      toast.error("Please sign in to bookmark properties");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setIsBookmarked(data.isBookmarked);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Failed to update bookmark", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-white shadow text-blue-600 hover:text-blue-800"
      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      {isBookmarked ? <FaBookmark size={22} /> : <FaRegBookmark size={22} />}
    </button>
  );
}
