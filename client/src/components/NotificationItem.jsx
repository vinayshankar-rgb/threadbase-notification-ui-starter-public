
import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function NotificationItem({ notification }) {
  const { dispatch } = useNotifications();

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.patch(
        `/api/notifications/${id}/read`
      );

      return response.data;
    },

    // Optimistically mark the notification as read
    onMutate: async (id) => {
      dispatch({
        type: "MARK_READ",
        payload: id,
      });
    },

    // If the PATCH request fails, reload the server's notification history
    onError: async () => {
      try {
        const response = await apiClient.get("/api/notifications");

        dispatch({
          type: "LOAD_NOTIFICATIONS",
          payload: response.data,
        });
      } catch (error) {
        console.error("Failed to reload notifications:", error);
      }
    },
  });

  function handleClick() {
    if (notification.isRead || markReadMutation.isPending) {
      return;
    }

    markReadMutation.mutate(notification.id);
  }

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      style={{
        padding: "12px",
        borderBottom: "1px solid #eee",
        background: notification.isRead ? "#fff" : "#eff6ff",
        cursor: notification.isRead ? "default" : "pointer",
        opacity: markReadMutation.isPending ? 0.7 : 1,
      }}
    >
      <div
        style={{
          fontWeight: notification.isRead ? "normal" : "bold",
        }}
      >
        {notification.title ||
          notification.message ||
          "New notification"}
      </div>

      {notification.message && notification.title && (
        <p
          style={{
            margin: "5px 0 0",
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          {notification.message}
        </p>
      )}

      <small
        style={{
          color: notification.isRead ? "#777" : "#2563eb",
        }}
      >
        {notification.isRead ? "Read" : "Unread"}
      </small>
    </div>
  );
}
