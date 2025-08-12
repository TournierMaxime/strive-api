import { Express } from "express"
import { WebSocketServer } from "ws"

declare global {
  namespace Express {
    interface Request {
      wss?: WebSocketServer
    }
  }
}

export {}
