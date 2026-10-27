
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

export default function NotificationBell() {
  const { state } = useNotifications();
  const unreadCount = state.unreadCount;

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <button
        onClick={() => setOpen((previous) => !previous)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.3rem",
          color: "#fff",
          position: "relative",
        }}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
      >
        🔔

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-8px",
              background: "#ef4444",
              color: "#fff",
              borderRadius: "999px",
              padding: "2px 5px",
              fontSize: "0.7rem",
              fontWeight: "bold",
              minWidth: "16px",
              textAlign: "center",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
