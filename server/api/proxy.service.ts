import { Service } from '@tsed/common';
import { parse } from 'url';
import { environement } from "./proxy-utils";
import * as proxy from 'express-http-proxy';

@Service()
export class ProxyService {
  public handleProxy;
  constructor() {
    this.handleProxy = (urlPrefix?: string) => proxy(`${environement.API_PROXY_ADDRESS}` ,{
      proxyReqPathResolver: function(req) {
        let path = parse(req.url).path;
        return urlPrefix ? urlPrefix + path : path;
      },
      proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        return new Promise(function(resolve, reject) {
          resolve(proxyReqOpts);
        })
      }
    });
  }
}
