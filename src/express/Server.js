const express = require("express"); 
const cookieParser = require("cookie-parser"); 
const cors = require("cors"); 

class Server {
    constructor(bot, port) {
        this.app = express(); 
        require('express-ws')(this.app); 
        this.port = port; 
        this.Bot = bot; 
        this.addMiddleware(); 

        this.app.listen(this.port); 
    }

    addMiddleware() {
        this.app.use(express.json()); 
        this.app.use(express.urlencoded()); 
        this.app.use(cors({
            origin: 'http://localhost:3000', // CORS policy
            credentials: true
        })); 
        this.app.use(cookieParser()); 
        this.addRouters(); 
    }

    addRouters() {
        this.app.use("/live", require("./routers/live")); 
        this.app.use("/api", require("./routers/api")); 
    }
}

module.exports = Server; 