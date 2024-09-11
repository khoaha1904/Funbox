import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

@Controller('')
export class AppController {

    @Get('')
    @HttpCode(200)
    async getProfile() {
        return 'Funbox api'
    }

}
