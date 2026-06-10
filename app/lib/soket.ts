import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_BASE_SOCKET!, {
  withCredentials: true,
  transports: ["polling", "websocket"],
  query: {
    userId: typeof window !== "undefined" ? localStorage.getItem("userId") : "",
  },
});
