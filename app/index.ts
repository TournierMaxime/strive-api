import {
  HttpBadRequestError,
  HttpForbiddenError,
  HttpNotFoundError,
  HttpServerManager,
  HttpUnauthorizedError,
  Keys,
} from "tm-api-common"
import { Application } from "express"
import { configureActivityRoutes } from "./routers/activitiesRouters.js"
import Database from "better-sqlite3"

export const keys = new Keys()
export const httpErrorServer = {
  HttpBadRequestError,
  HttpForbiddenError,
  HttpNotFoundError,
  HttpUnauthorizedError,
}

const httpServerManager = new HttpServerManager()
const app = httpServerManager.getExpressApp()

const configureRoutes = (app: Application) => {
  configureActivityRoutes(app)
}

const db = new Database(process.env.DB_PATH)

export { db }

configureRoutes(app)

httpServerManager.startServer(Number(process.env.EXPRESS_PORT) || 3500)
