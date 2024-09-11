import { Module } from '@nestjs/common';
import { SharedModule } from '@libs/shared/services';
import { HttpModule } from '@nestjs/axios';
import { FacebookExternalService } from './facebook-external.service';

@Module({
    imports: [SharedModule, HttpModule],
    providers: [FacebookExternalService],
    exports: [FacebookExternalService],
})
export class FacebookExternalModule { }
