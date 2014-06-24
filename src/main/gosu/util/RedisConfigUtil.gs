package util

uses net.greghaines.jesque.ConfigBuilder
uses java.lang.System
uses java.net.URI
uses net.greghaines.jesque.Config

class RedisConfigUtil {

  static property get Config() : Config {
    var builder = new ConfigBuilder()
    var host = System.Env['REDIS_HOST']
    var uri = new URI(host)
    builder.withHost(uri.Host)
    builder.withPort(uri.Port)
    builder.withPassword(uri.UserInfo.split(":",2)[1])
    return builder.build()
  }

}