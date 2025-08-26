import { Injectable } from "@nestjs/common";
import { DataSource, DataSourceOptions } from "typeorm";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } from "src/utils/env";

// Helper function to determine if we're in a test environment
const isTestEnvironment = () => {
    return process.env.NODE_ENV === 'test' || 
           process.env.JEST_WORKER_ID !== undefined ||
           process.argv.some(arg => arg.includes('jest') || arg.includes('test'));
};

@Injectable()
export class DatabaseManager {
    private static dataSource: DataSource | null = null;

    public static async getInstance() {
        if (!DatabaseManager.dataSource) {
            const config: DataSourceOptions = {
                type: "mysql",
                host: DB_HOST,
                port: Number(DB_PORT),
                username: DB_USER,
                password: DB_PASSWORD,
                database: DB_NAME,
                migrations: [
                    isTestEnvironment() 
                        ? "src/**/migrations/*.ts" 
                        : "dist/**/migrations/*.js"
                ],
                entities: [
                    isTestEnvironment() 
                        ? "src/**/*.entity{.ts,.js}" 
                        : "dist/**/*.entity{.ts,.js}"
                ],
                subscribers: [
                    isTestEnvironment() 
                        ? "src/**/*.subscriber{.ts,.js}" 
                        : "dist/**/*.subscriber{.ts,.js}"
                ],
                synchronize: false,
                logging: true,
            };
            DatabaseManager.dataSource = new DataSource(config);

            try {
                await DatabaseManager.dataSource.initialize();
                console.log("Database Connected");
            } catch (error) {
                console.error("Error during Data Source initialization", error);
                throw error;
            }
        }
        return DatabaseManager.dataSource;
    }
}
