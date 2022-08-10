import { io } from "socket.io-client";

export const socketInit = () => {
  const options = {
    "force new connections": true,
    reconneectionAttempt: "Infinity",
    timeout: 10000, //10k ms
    transports: ["websocket"],
  };

  return io("http://localhost:5000", options);
};
