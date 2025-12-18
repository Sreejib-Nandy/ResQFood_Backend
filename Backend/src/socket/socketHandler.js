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
      socket.join(`restaurant:${userId}`);
      console.log(`Restaurant joined room restaurant:${userId}`);
    }

    if (role === "ngo") {
      socket.join(`ngo:${userId}`);
      console.log(`NGO joined room ngo:${userId}`);
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
