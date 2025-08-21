import { db } from "../index.js";
import { runUpdateGarmin } from "../utils/runShell";
class ActivityController {
    async getActivities(req, res) {
        const limit = Math.max(1, Math.min(parseInt(String(req.body.limit ?? "100"), 10), 500));
        const offset = Math.max(0, parseInt(String(req.body.offset ?? "0"), 10));
        const { total } = db
            .prepare(`SELECT COUNT(*) as total FROM activities`)
            .get();
        const activities = db
            .prepare(`SELECT * FROM activities ORDER BY start_time DESC LIMIT ? OFFSET ?`)
            .all(limit, offset);
        res.status(200).json({ activities, meta: { limit, offset, total } });
    }
    async getActivity(req, res) {
        const activity_id = req.params.activity_id;
        const activity = db
            .prepare(`SELECT * FROM new_activities WHERE activity_id = ?`)
            .get(activity_id);
        res.status(200).json({ activity });
    }
    async updateActivities(req, res) {
        await runUpdateGarmin();
        res.status(200).json({ message: "Mise à jour effectuée !" });
    }
}
export const activitiesControllers = new ActivityController();
