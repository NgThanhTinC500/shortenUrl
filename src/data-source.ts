import { DataSource } from "typeorm";
import "reflect-metadata";
import "dotenv/config";
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12345678",
    database: "shortenUrl",
    synchronize: true,
    logging: false,
    entities: ["src/entities/*.ts"],
    subscribers: [],
    migrations: ["src/migration/**/*.ts"],
})