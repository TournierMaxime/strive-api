// utils/runShell.ts
import { spawn } from "node:child_process";
export function runUpdateGarmin() {
    return new Promise((resolve, reject) => {
        const child = spawn("/bin/sh", ["-lc", "/var/app/scripts/update_garmin.sh"], {
            cwd: "/var/app",
            stdio: ["ignore", "pipe", "pipe"],
            env: { ...process.env }, // ajoute tes GARMIN_* ici si besoin
        });
        child.stdout.on("data", (d) => process.stdout.write(d));
        child.stderr.on("data", (d) => process.stderr.write(d));
        child.on("close", (code) => code === 0
            ? resolve()
            : reject(new Error(`update_garmin.sh exited ${code}`)));
    });
}
