const Scripty = require('node-redis-scripty');

function makeRedisKey(key) {
  return key + ':throttle';
}

module.exports = function(redis) {
  const scripty = new Scripty(redis);

  function throttle(key, throttleFn, ttl, noRetry /* Private */) {
    scripty.loadScriptFile(
      'claimThrottleLock',
      `${__dirname}/lua/claimThrottleLock.lua`,
      (err, claimThrottleLock) => {
        if (err) return void throttleFn(err);

        claimThrottleLock.run(1, makeRedisKey(key), ttl, (err, expiresIn) => {
          if (err) return void throttleFn(err);

          // If being throttled, wait for its expiration and try to run once more.
          if (expiresIn >= 0) {
            if (!noRetry) {
              setTimeout(() => throttle(key, throttleFn, ttl, true /* No retry */), expiresIn);
            }
          } else {
            throttleFn();
          }
        });
      }
    );
  }

  // Create an alias.
  throttle.call = throttle;

  throttle.cancel = function(key, callback) {
    redis.del(makeRedisKey(key), callback);
  };

  return throttle;
};
