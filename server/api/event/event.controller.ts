import { Controller, Next, Put, Request, Response } from '@tsed/common';
import { ProxyService } from '../proxy.service';

@Controller('/event')
export class UserController {
  constructor(
    private proxyService: ProxyService
  ) {}

  @Put('/createPrivateRecurentEvent')
  createPrivateRecurrentEvent(
    @Request() request,
    @Response() response,
    @Next() next) {
    return this.proxyService.handleSimpleResponseProxy('/service')(request, response, next);
  }

  @Put('/createPrivateEvent')
  createPrivateEvent(
    @Request() request,
    @Response() response,
    @Next() next) {
    return this.proxyService.handleSimpleResponseProxy('/service')(request, response, next);
  }
}
