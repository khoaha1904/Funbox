import { UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/response.interceptor';

@UseInterceptors(ResponseInterceptor)
export class BaseController { }
