import { Controller, Get, Next, Request, Response } from '@tsed/common';
import * as Path from 'path';

@Controller('')
export class RootController {
  @Get('*')
  public loadIndex(@Request() request, @Response() response, @Next() next) {
    response.sendFile(Path.resolve(__dirname, '../../client/index.html'));
  }
}
