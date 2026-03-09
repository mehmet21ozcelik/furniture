import { execSync } from "child_process";

export type SystemStatus = {
    diskUsage: {
        total: string;
        used: string;
        available: string;
        percent: string;
    } | null;
    memoryUsage: {
        total: string;
        free: string;
    };
    uptime: number;
};

export async function getSystemStatus(): Promise<SystemStatus> {
    let diskUsage = null;
    try {
        // Run df -h on root filesystem. 
        // Note: In Docker, this might reflect the container's layer or host partition depending on mount.
        const dfOutput = execSync("df -h /").toString();
        const lines = dfOutput.trim().split("\n");
        if (lines.length > 1) {
            const parts = lines[1].split(/\s+/);
            diskUsage = {
                total: parts[1],
                used: parts[2],
                available: parts[3],
                percent: parts[4],
            };
        }
    } catch (error) {
        console.error("Error getting disk usage:", error);
    }

    const totalMem = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
    const usedMem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

    return {
        diskUsage,
        memoryUsage: {
            total: `${totalMem} MB`,
            free: `${totalMem - usedMem} MB`,
        },
        uptime: process.uptime(),
    };
}
