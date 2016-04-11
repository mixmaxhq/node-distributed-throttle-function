--
-- "Claims" a throttle lock by grabbing the key.
--
-- KEYS[1]   - key
-- ARGV[1]   - ttl
local key     = KEYS[1]
local ttl = ARGV[1]

local value = redis.call("SET", key, "", "NX", "PX", ttl)

-- If we were the first to set the value, return a sentinel value of 0.
if value then
	return 0
end

-- If we weren't the first, return the time until expiration (so the client knows when to try again).
return redis.call("PTTL", key)