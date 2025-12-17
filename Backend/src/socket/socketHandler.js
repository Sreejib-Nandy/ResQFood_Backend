let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const { userId, role } = socket.handshake.auth || {};

    if (!userId) {
      console.log("Socket rejected: no userId");
      socket.disconnect(true);
      return;
    }

    socket.join(userId);
    console.log(`User ${userId} joined room`);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }
  return ioInstance;
};
