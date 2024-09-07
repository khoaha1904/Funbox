import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import * as fs from 'fs';
// import * as csv from 'fast-csv';

@Injectable()
export class UtilService {
	isValidEmail(email: string) {
		// Regular expression for validating an email address
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		return emailRegex.test(email);
	}

	generateUniqueCode(length: number): string {
		// Generate a unique code using your desired logic
		// For example, you can use a combination of random numbers and letters
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let code = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			code += characters[randomIndex];
		}

		return code;
	}

	// async readCsvFile(filePath: string): Promise<any[]> {
	// 	const dataArr = [];
	// 	return new Promise((resolve, reject) => {
	// 		fs.createReadStream(filePath)
	// 			.pipe(csv.parse({ headers: true }))
	// 			.on('error', (error) => reject(error))
	// 			.on('data', (row) => dataArr.push(row))
	// 			.on('end', () => {
	// 				resolve(dataArr);
	// 			});
	// 	});
	// }

	public async wait(seconds) {
		return new Promise((resolve) => {
			setTimeout(resolve, seconds * 1000);
		});
	}
	public sum(...res): number {
		return res.reduce((_prev, _current) => {
			return _prev + (_current ?? 0);
		}, 0);
	}

	public generateCode8(): string {
		const random = Math.floor(Math.random() * 1000000);
		const date = new Date().toISOString().slice(0, 10);
		const data = `${random}${date}`;
		const hash = createHash('sha256').update(data).digest('hex');
		return hash.slice(0, 8).toUpperCase();
	}

	public generateRandomString(length: number) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '0x0hw';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}

		return result;
	}

	public roundingUp(data: number): number {
		if (isNaN(data)) {
			return data;
		}

		return Math.ceil(data * 10000) / 10000;
	}

	public roundingDown(data: number): number {
		if (isNaN(data)) {
			return data;
		}

		return Math.floor(data * 10000) / 10000;
	}

	public generateIncreaseCode6(lastCode: string): string {
		const newLastCode = lastCode ? lastCode : '000000';

		const lastNumber = parseInt(newLastCode.slice(0, 3), 10);
		const nextNumber = (lastNumber + 1) % 1000;
		const nextNumberString = nextNumber.toString().padStart(3, '0');

		const randomString = this.generateRandomString(3);

		return `${nextNumberString}${randomString}`;
	}

	// private generateRandomString = (length: number): string => {
	// 	return randomBytes(Math.ceil(length / 2))
	// 		.toString('hex') // convert to hexadecimal format
	// 		.slice(0, length); // trim to required length
	// };
}
