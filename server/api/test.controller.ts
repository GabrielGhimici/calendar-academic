import { Controller, Get, Next, Request, Response } from '@tsed/common';
import { ProxyService } from './proxy.service';

@Controller('/greeting')
export class TestController {
  constructor(
    private proxyService: ProxyService
  ) {}
  @Get('')
  getGreet(
    @Request() request,
    @Response() response,
    @Next() next,
  ) {
    return this.proxyService.handleProxy('/greeting')(request, response, next);
  }
}
