import { Service } from '@tsed/common';
import { parse } from 'url';
import { environement } from "./proxy-utils";
import * as proxy from 'express-http-proxy';

@Service()
export class ProxyService {
  public handleProxy;
  public handleLoginProxy;
  public handleSimpleResponseProxy;

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
    this.handleLoginProxy = proxy(`${environement.API_PROXY_ADDRESS}`, {
      proxyReqPathResolver: function (req) {
        return parse(req.url).path;
      },
      proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        return new Promise(function (resolve, reject) {
          resolve(proxyReqOpts);
        });
      },
      userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        if (!proxyResData.toString('utf8')) return JSON.stringify({OK: false});
        userRes.append('Access-Control-Allow-Credentials', true);
        userRes.cookie('CAToken', proxyResData.toString(), {expires: new Date(Number(new Date()) + 30 * 60 * 1000), httpOnly: false});
        return JSON.stringify({OK: true});
      }
    });
    this.handleSimpleResponseProxy = (urlPrefix?: string) => proxy(`${environement.API_PROXY_ADDRESS}` ,{
      proxyReqPathResolver: function(req) {
        let path = parse(req.url).path;
        return urlPrefix ? urlPrefix + path : path;
      },
      proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        return new Promise(function(resolve, reject) {
          resolve(proxyReqOpts);
        })
      },
      userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        if (!proxyResData.toString('utf8')) return JSON.stringify({OK: false});
        return JSON.stringify({OK: true});
      }
    });
  }
}
