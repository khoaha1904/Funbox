import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';

dotenv.config({
	path: `.env`,
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
	process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	migrations: [__dirname + '/migrations/*.js'],
	entities: [__dirname + '/../modules/*/entities/*.entity.js'],
	namingStrategy: new SnakeNamingStrategy(),
	database: process.env.POSTGRES_CORE_DB,
	host: process.env.POSTGRES_CORE_HOST,
	port: Number(process.env.POSTGRES_CORE_PORT),
	username: process.env.POSTGRES_CORE_USER,
	password: process.env.POSTGRES_CORE_PASSWORD,
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
