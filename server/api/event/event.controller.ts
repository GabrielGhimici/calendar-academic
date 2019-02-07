import { Controller, Get, Next, Post, Put, Request, Response } from '@tsed/common';
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

  @Post('/serializedEvents')
  getEventList(
    @Request() request,
    @Response() response,
    @Next() next) {
    return this.proxyService.handleProxy('/service')(request, response, next);
  }

  @Post('/serializedPrefferedEvents')
  getPreferredEventList(
    @Request() request,
    @Response() response,
    @Next() next) {
    return this.proxyService.handleProxy('/service')(request, response, next);
  }

  @Get('/invitations')
  getInvitationList(
    @Request() request,
    @Response() response,
    @Next() next) {
    return this.proxyService.handleProxy('/service')(request, response, next);
  }
}
