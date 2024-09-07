import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class AppAxiosService {
	constructor(private httpService: HttpService) {}

	public get<T>(url: string): Observable<AxiosResponse<T>> {
		return this.httpService.get<T>(url);
	}

	public post<T>(url: string, data: any): Observable<AxiosResponse<T>> {
		return this.httpService.post<T>(url, data);
	}

	public patch<T>(url: string, data: any): Observable<AxiosResponse<T>> {
		return this.httpService.patch<T>(url, data);
	}

	public put<T>(url: string, data: any): Observable<AxiosResponse<T>> {
		return this.httpService.put<T>(url, data);
	}

	public delete<T>(url: string, data: any): Observable<AxiosResponse<T>> {
		return this.httpService.delete<T>(url, data);
	}
}
