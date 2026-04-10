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
    synchronize: false,
    logging: false,
    entities: ["src/entity/**/*.js"],
    subscribers: [],
    migrations: ["src/migration/**/*.ts"],
})