export const logger = {
    info: (message, meta = {}) => {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`, Object.keys(meta).length ? meta : "");
    },
    error: (message, error = null, meta = {}) => {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error ? error : "", Object.keys(meta).length ? meta : "");
    },
    warn: (message, meta = {}) => {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, Object.keys(meta).length ? meta : "");
    }
};

export default logger;
