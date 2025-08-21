import expressAsyncHandler from "express-async-handler"
import { Application } from "express"
import { activitiesControllers } from "../controllers/activitiesControllers.js"

const configureActivityRoutes = (app: Application) => {
  app.post(
    "/api/v1/activities/",
    expressAsyncHandler((req, res) =>
      activitiesControllers.getActivities(req, res)
    )
  )
  app.get(
    "/api/v1/activities/:activity_id",
    expressAsyncHandler((req, res) =>
      activitiesControllers.getActivity(req, res)
    )
  )
  app.post(
    "/api/v1/activities/update",
    expressAsyncHandler((req, res) =>
      activitiesControllers.updateActivities(req, res)
    )
  )
}

export { configureActivityRoutes }
