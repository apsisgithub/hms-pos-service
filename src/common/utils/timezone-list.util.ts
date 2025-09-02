import axios from "axios";
import { handleError } from "src/utils/handle-error.util";

export async function getTimezones(): Promise<string[]> {
    try {
        const url = process.env.TIMEZONE_LIST_API;
        const res = await axios.get(`${url}`, {
            params: {
                key: process.env.TIMEZONE_DB_API_KEY,
                format: "json",
            },
        });

        const formattedTimezones = res.data.zones.map((z: any) => {
            const offsetHours = z.gmtOffset / 3600;
            const sign = offsetHours >= 0 ? "+" : "-";
            const absHours = Math.abs(offsetHours);

            const hours = Math.floor(absHours).toString().padStart(2, "0");
            const minutes = ((absHours % 1) * 60).toString().padStart(2, "0");

            const zoneName = z.zoneName.split("/").pop();

            return `GMT${sign}${hours}:${minutes} ${zoneName}`;
        });

        return formattedTimezones;
    } catch (error) {
        console.error("Error fetching timezones:", error.message);
        handleError("Could not fetch timezones");
        return [];
    }
}
