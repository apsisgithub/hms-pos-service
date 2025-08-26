import { Repository } from "typeorm"; // Assuming you're using TypeORM or similar
import { handleError } from "./handle-error.util";

export async function getTotalRecords(
    repository: Repository<any>,
    tableName: string,
    primaryKey: string
): Promise<number> {
    try {
        // Construct the SQL query dynamically
        const countSql = `
            SELECT COUNT(DISTINCT ${primaryKey}) AS total
            FROM ${tableName};
        `;

        const countResult = await repository.query(countSql);
        const total = Number(countResult[0]?.total) || 0;

        return total;
    } catch (err) {
        console.error(
            `Error occurred while getting total records for ${tableName} on primary key ${primaryKey}: `,
            err
        );
        handleError(err);
        throw err;
    }
}
