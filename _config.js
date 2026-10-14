// =============================================
// MAHASHIVRATRI CONFIGURATION
// =============================================

const config = {
    // Server
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        env: process.env.NODE_ENV || 'development'
    },

    // Database
    database: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mahashivratri',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'mahashivratri_secret',
        expiresIn: '7d'
    },

    // CORS
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        credentials: true
    },

    // Rate limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },

    // File upload
    upload: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },

    // Animation
    animation: {
        flowerEmojis: ['🌹', '🌺', '🌸', '🌼', '🌻', '💐', '🏵️'],
        maxFlowers: 100,
        maxParticles: 200,
        animationFrameRate: 60
    },

    // Socket.IO
    socketIo: {
        transports: ['websocket', 'polling'],
        pingInterval: 25000,
        pingTimeout: 20000
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: 'combined'
    }
};

module.exports = config;