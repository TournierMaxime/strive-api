import { Request, Response } from "express"
import { db } from "../index.js"
import { runUpdateGarmin } from "../utils/runShell"

class ActivityController {
  async getActivities(req: Request, res: Response) {
    const limit = Math.max(
      1,
      Math.min(parseInt(String(req.body.limit ?? "100"), 10), 500)
    )
    const offset = Math.max(0, parseInt(String(req.body.offset ?? "0"), 10))

    const { total } = db
      .prepare(`SELECT COUNT(*) as total FROM activities`)
      .get() as { total: number }

    const activities = db
      .prepare(
        `SELECT * FROM activities ORDER BY start_time DESC LIMIT ? OFFSET ?`
      )
      .all(limit, offset)

    res.status(200).json({ activities, meta: { limit, offset, total } })
  }

  async getActivity(req: Request, res: Response) {
    const activity_id = req.params.activity_id

    const activity = db
      .prepare(`SELECT * FROM activities WHERE activity_id = ?`)
      .get(activity_id)

    res.status(200).json({ activity })
  }

  async patchActivity(req: Request, res: Response) {
    const activity_id = req.params.activity_id
    const { name } = req.body

    const activity = db
      .prepare(`UPDATE activities SET name = ? WHERE activity_id = ?`)
      .run(name, activity_id)

    res.status(200).json({ activity, message: "Activity's name updated" })
  }

  async updateActivities(req: Request, res: Response) {
    await runUpdateGarmin()

    res.status(200).json({ message: "Mise à jour effectuée !" })
  }

  async getActivityLaps(req: Request, res: Response) {
    const activity_id = req.params.activity_id

    const activity = db
      .prepare(`SELECT * FROM activity_laps WHERE activity_id = ?`)
      .all(activity_id)

    res.status(200).json({ activity })
  }

  async getActivityRecords(req: Request, res: Response) {
    const activity_id = req.params.activity_id

    const activity = db
      .prepare(`SELECT * FROM activity_records WHERE activity_id = ?`)
      .all(activity_id)

    res.status(200).json({ activity })
  }

  async deleteActivityLaps(req: Request, res: Response) {
    const activity_id = req.params.activity_id
    const { lap } = req.body

    const activity = db
      .prepare(`DELETE FROM activity_laps WHERE activity_id = ? AND lap = ?`)
      .run(activity_id, lap)

    res.status(200).json({ activity, message: "Lap deleted !" })
  }
}

export const activitiesControllers = new ActivityController()
