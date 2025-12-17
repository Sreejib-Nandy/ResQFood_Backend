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

    if (role === "restaurant") {
      socket.join(userId.toString());
    }

    if (role === "ngo") {
      socket.join(userId.toString());
    }

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
