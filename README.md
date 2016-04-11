## Distributed Throttle

This module allows you to throttle the invocation of a function (just like [Underscore#throttle](http://underscorejs.org/#throttle)) across a distributed system. It is built on top of Redis. It will currently always call the function on the leading edge and the trailing edge, just like Underscore's default implementation.

## Installing 

```bash
npm install node-distributed-throttle-function
```

## Using

```js
var distributedThrottle = require('node-distributed-throttle-function');
var redis = require('redis');

var port = '6381';
var hostname = 'localhost';
var password = '';

var redisConnection = redis.createClient(port, hostname, {
  auth_pass: password
};

var throttle = distributedThrottle(redisConnection);

throttle('my10secThrottledFunction', function(err) {
  if (err) {
    console.log('error!', err);
    return;
  }

  console.log('this function will be called at most once every 10 seconds.');
}, 10 * 1000 /* 10 sec */);

// If you want to cancel it such that the next invocation will fire immediately.
throttle.cancel('my10secThrottledFunction', function(err){
  if (err) {
    console.log('error!', err);
  } 
});

```

## Bugs & TODOs

See <https://github.com/mixmaxhq/node-distributed-throttle-function/issues>
