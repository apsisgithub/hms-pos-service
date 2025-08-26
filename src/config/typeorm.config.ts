import { DataSource } from "typeorm";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } from "src/utils/env";

export default new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  migrations: [`./migrations/*.ts`],
  entities: ["src/**/*.entity.ts"],
  subscribers: ["src/**/*.subscriber.ts"],
  synchronize: false,
  logging: true,
});
