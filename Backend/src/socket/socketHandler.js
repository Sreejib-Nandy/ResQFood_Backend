let ioInstance = null;

// Sockety.io connection
export const initSocket = (io) => {
  ioInstance = io;
  io.on("connection", (socket) => {
    console.log("Socket connected :", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected :", socket.id);
    });
  });
};

export const getIO = () => {
  if (!ioInstance) throw new Error("Socket.io not initialized!");
  return ioInstance;
};
