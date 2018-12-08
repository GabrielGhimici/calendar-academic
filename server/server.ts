import { ServerLoader, ServerSettings } from '@tsed/common';
import * as Path from 'path';
import * as Express from 'express';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');

@ServerSettings({
  rootDir: Path.resolve(__dirname),
  port: 3000,
  mount: {
    '/api': '${rootDir}/api/**/*.js',
    '/': '${rootDir}/general/**/*.js'
  },
  logger: {
    logRequest: true
  }
})
export class Server extends ServerLoader {
  public $onMountingMiddlewares(): void|Promise<any> {
    this
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
    this.use(Express.static(`${__dirname}/../client`));
    return null;
  }

  public $onServerInitError(err) {
    console.error(err);
  }
}
