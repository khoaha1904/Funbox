import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                const statusCode = context.getArgs()?.[1]?.statusCode;
                const response = {
                    data: data?.data,
                    statusCode: statusCode,
                    message: data?.message,
                    isSuccess: statusCode >= 200 && statusCode < 300,
                };
                return response;
            }),
            catchError(async (err) => {
                const response = {
                    statusCode: err?.response?.statusCode || 500,
                    message: err?.response?.message || 'Unknow Error',
                    isSuccess: false,
                };
                const Error = HttpErrorByCode[response.statusCode];
                throw new Error(response);
            })
        );
    }
}
