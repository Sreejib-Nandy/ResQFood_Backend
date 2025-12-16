import http from "http";
import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { Server } from "socket.io";
import { initSocket } from "./src/socket/socketHandler.js";
// import "./src/utils/cronJob.js";

// Call the function to connect database
connectDB();

// Create an HTTP server (use HTTPS in production)
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin : process.env.FRONTEND_URL || "*",
        methods : ["GET", "POST", "PATCH"],
        credentials : true,
    },
});

initSocket(io);

// Port declaration 
const port = process.env.PORT || 5000;
// Server listening at port 5000
server.listen(port, () => {
    console.log(`Server is running at ${port}`);
} )


