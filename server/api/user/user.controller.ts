import { BodyParams, Controller, Get, Next, Post, Request, Required, Response } from '@tsed/common';
import { ProxyService } from '../proxy.service';

@Controller('/user')
export class UserController {
  constructor(
    private proxyService: ProxyService
  ){}

  @Get('/details')
  getProfile(@Request() request,
             @Response() response,
             @Next() next) {
    return this.proxyService.handleProxy('/service')(request, response, next);
  }

  @Post('/login')
  doLogin( @Request() request,
           @Response() response,
           @Next() next,
           @Required() @BodyParams('email') email: string,
           @Required() @BodyParams('password') password: string ) {
    return this.proxyService.handleLoginProxy(request, response, next);
  }


  @Post('/logout')
  doLogout( @Request() request,
            @Response() response,
            @Next() next) {
    return this.proxyService.handleSimpleResponseProxy('/service')(request, response, next);
  }

  @Get('/token_info')
  getTokenInfo( @Request() request,
                @Response() response,
                @Next() next ) {
    return this.proxyService.handleProxy()(request, response, next);
  }
}
