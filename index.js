var Scripty = require('node-redis-scripty');

function makeRedisKey(key) {
  return key + ':throttle';
}

module.exports = function(redis) {
  var scripty = new Scripty(redis);

  var throttle = function(key, throttleFn, ttl, noRetry /* Private */ ) {
    scripty.loadScriptFile(
      'claimThrottleLock',
      __dirname + '/lua/claimThrottleLock.lua',
      function(err, claimThrottleLock) {
        if (err) return throttleFn(err);

        claimThrottleLock.run(1, makeRedisKey(key), ttl, function(err, expiresIn) {
          if (err) return throttleFn(err);

          // If being throttled, wait for its expiration and try to run once more.
          if (expiresIn > 0) {
            if (!noRetry) {
              setTimeout(function() {
                throttle(key, throttleFn, ttl, true /* No retry */ );
              }, expiresIn);
            }
          } else {
            throttleFn();
          }
        });
      }
    );
  };

  throttle.cancel = function(key, callback) {
    redis.del(makeRedisKey(key), callback);
  };

  return throttle;
};