'use client';

import { useGlobalContext } from "../context/GlobalContext";
import { useEffect } from "react";

const UnreadMessageCount = ({ session }) => {
    const {unreadCount, setUnreadCount} = useGlobalContext();

    useEffect(() => {
        // Skip API call if there's no session
        if (!session || !session.user) return;

        const fetchUnreadMessages = async () => {
            try {
                const res = await fetch('/api/messages/unread-count');

                if (res.status === 200) {
                    const data = await res.json();
                    setUnreadCount(data);
                } else {
                    // Silently handle errors for this UI component
                    console.log("Error fetching unread count:", res.status);
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchUnreadMessages();
    }, [session, setUnreadCount]);

    // Only show if there's a count and the user is logged in
    return (session && unreadCount > 0) ? (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
        </span>
    ) : null;
};

export default UnreadMessageCount;