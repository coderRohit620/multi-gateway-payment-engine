// Placeholder mock client for Redis cache operations
export const redisClient = {
    get: async (key) => null,
    set: async (key, val, options) => null,
    del: async (key) => null,
};

export default redisClient;
