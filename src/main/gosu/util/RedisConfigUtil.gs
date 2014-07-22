package util

uses net.greghaines.jesque.ConfigBuilder
uses java.lang.System
uses java.net.URI
uses net.greghaines.jesque.Config
uses net.greghaines.jesque.client.Client
uses net.greghaines.jesque.client.ClientImpl
uses java.util.concurrent.locks.ReentrantLock
uses net.greghaines.jesque.Job

class RedisConfigUtil {

  static final var _INSTANCE : RedisConfigUtil as readonly INSTANCE = new RedisConfigUtil()
  static final var _LOCK = new ReentrantLock()
  var _CONFIG : Config as readonly CONFIG
  var _CLIENT : Client as readonly CLIENT

  private construct() {
    _CONFIG = config()
    _CLIENT = new ClientImpl(_CONFIG)
  }

  private function config() : Config {
    var builder = new ConfigBuilder()
    var host = System.Env['REDIS_HOST']
    var uri = new URI(host)
    builder.withHost(uri.Host)
    builder.withPort(uri.Port)
    builder.withPassword(uri.UserInfo.split(":",2)[1])
    return builder.build()
  }

  function enqueue(queue : String, job : Job) {
    using(_LOCK) {
      try {
        _CLIENT.enqueue(queue, job)
      } catch(e) {
        //Reconnect
        _CLIENT = new ClientImpl(_CONFIG)
        _CLIENT.enqueue(queue, job)
      }
    }
  }

}