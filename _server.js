// =============================================
// MAHASHIVRATRI SPECIAL - NODE.JS BACKEND
// =============================================

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST']
    }
});

// =============================================
// MIDDLEWARE SETUP
// =============================================

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Logging
app.use(morgan('combined'));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from root directory (for scripts and styles)
app.use(express.static(__dirname));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '_mahashivratri-animation.html'));
});

// =============================================
// DATABASE CONFIGURATION
// =============================================

const db = require('./_database/init');
const {
    User,
    CelebrationEvent,
    VisitorStatistics,
    Feedback,
    AnimationState
} = require('./_models');

// Initialize database connection
db.connect()
    .then(async () => {
        console.log('✅ Database initialized successfully');
        // Create indexes
        await db.createIndexes();
        // Seed database if needed
        await db.seedDatabase();
    })
    .catch(err => {
        console.error('❌ Database initialization error:', err);
        process.exit(1);
    });

// Use VisitorStatistics model (note: model name is VisitorStatistics, not VisitorStats)
const VisitorStats = VisitorStatistics;

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'mahashivratri_secret', {
        expiresIn: '7d'
    });
};

// Hash Password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Verify Password
const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Use User model's matchPassword method if available
const verifyUserPassword = async (user, password) => {
    if (user.matchPassword) {
        return await user.matchPassword(password);
    }
    return await verifyPassword(password, user.password);
};

// Middleware: Verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mahashivratri_secret');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Get device type from user agent
const getDeviceType = (userAgent) => {
    if (/mobile|android|iphone|ipad/i.test(userAgent)) {
        return /tablet|ipad/i.test(userAgent) ? 'tablet' : 'mobile';
    }
    return 'desktop';
};

// =============================================
// AUTH ROUTES
// =============================================

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        // Generate token
        const token = generateToken(user._id);
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isValidPassword = await verifyUserPassword(user, password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = generateToken(user._id);
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// =============================================
// USER ROUTES
// =============================================

// Get User Profile
app.get('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update User Preferences
app.put('/api/user/preferences', verifyToken, async (req, res) => {
    try {
        const { soundEnabled, fullscreenMode, theme } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                $set: {
                    'preferences.soundEnabled': soundEnabled,
                    'preferences.fullscreenMode': fullscreenMode,
                    'preferences.theme': theme,
                    updatedAt: new Date()
                }
            },
            { new: true }
        ).select('-password');
        
        res.json({
            message: 'Preferences updated',
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Preference update error:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

// =============================================
// STATISTICS ROUTES
// =============================================

// Get Visitor Statistics
app.get('/api/stats/visitors', async (req, res) => {
    try {
        const stats = await VisitorStats.findOne({
            date: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });
        
        res.json(stats || {
            totalVisitors: 0,
            activeUsers: 0,
            totalViews: 0
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get Historical Statistics
app.get('/api/stats/history/:days', async (req, res) => {
    try {
        const days = parseInt(req.params.days) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const stats = await VisitorStats.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        res.json(stats);
    } catch (error) {
        console.error('Historical stats error:', error);
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
});

// =============================================
// CELEBRATION EVENT ROUTES
// =============================================

// Record Celebration Event
app.post('/api/events/celebrate', async (req, res) => {
    try {
        const { userId, eventType, location, message, userName, title } = req.body;
        
        const event = new CelebrationEvent({
            userId: userId || null,
            userName: userName || 'Anonymous',
            eventType,
            title: title || `${eventType} celebration`,
            message: message || '',
            location: location || { x: 0, y: 0 }
        });
        
        await event.save();
        
        // Broadcast to all connected clients
        io.emit('celebration_event', {
            eventType,
            location: event.location,
            message: event.message,
            timestamp: new Date()
        });
        
        res.status(201).json({
            message: 'Event recorded',
            event
        });
    } catch (error) {
        console.error('Event recording error:', error);
        res.status(500).json({ error: 'Failed to record event' });
    }
});

// Get Recent Events
app.get('/api/events/recent/:limit', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit) || 10;
        
        const events = await CelebrationEvent.find()
            .sort({ timestamp: -1 })
            .limit(limit);
        
        res.json(events);
    } catch (error) {
        console.error('Events fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// =============================================
// FEEDBACK ROUTES
// =============================================

// Submit Feedback
app.post('/api/feedback/submit', async (req, res) => {
    try {
        const { userId, rating, comment, email } = req.body;
        
        if (!rating || !email) {
            return res.status(400).json({ error: 'Rating and email required' });
        }
        
        const feedback = new Feedback({
            userId: userId || null,
            rating,
            comment,
            email
        });
        
        await feedback.save();
        
        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Get All Feedback (Admin)
app.get('/api/feedback/all', async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        
        res.json(feedback);
    } catch (error) {
        console.error('Feedback fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// =============================================
// FILE UPLOAD ROUTES
// =============================================

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Upload Avatar
app.post('/api/user/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { avatar: `/uploads/${req.file.filename}` } },
            { new: true }
        ).select('-password');
        
        res.json({
            message: 'Avatar uploaded successfully',
            avatar: user.avatar
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
});

// =============================================
// SOCKET.IO CONFIGURATION
// =============================================

const connectedUsers = new Map();
const activeAnimationSessions = new Map();

io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    
    // Store user connection
    connectedUsers.set(socket.id, {
        id: socket.id,
        connectedAt: new Date(),
        deviceType: getDeviceType(socket.handshake.headers['user-agent'])
    });
    
    // Broadcast total active users
    io.emit('user_count', connectedUsers.size);
    
    // User joined celebration
    socket.on('join_celebration', (data) => {
        console.log(`🕉️ User joined celebration:`, data);
        
        socket.broadcast.emit('user_joined', {
            userId: socket.id,
            username: data.username,
            timestamp: new Date()
        });
    });
    
    // Animation state update
    socket.on('animation_state', (data) => {
        activeAnimationSessions.set(socket.id, {
            ...data,
            socketId: socket.id
        });
        
        io.emit('animation_update', {
            totalActiveSessions: activeAnimationSessions.size,
            ...data
        });
    });
    
    // Flower animation event
    socket.on('flower_shower', (data) => {
        socket.broadcast.emit('flower_animation', {
            userId: socket.id,
            flowerCount: data.flowerCount,
            position: data.position,
            timestamp: new Date()
        });
    });
    
    // Wedding dance event
    socket.on('wedding_dance', (data) => {
        socket.broadcast.emit('wedding_dance', {
            userId: socket.id,
            danceMoves: data.danceMoves,
            timestamp: new Date()
        });
        
        // Record event in database
        new CelebrationEvent({
            userId: data.userId || null,
            userName: data.username || 'Anonymous',
            eventType: 'wedding_dance',
            title: 'Wedding Dance Celebration',
            message: 'Participated in wedding dance'
        }).save().catch(err => console.error('Event save error:', err));
    });
    
    // Prayer event
    socket.on('prayer', (data) => {
        socket.broadcast.emit('prayer', {
            userId: socket.id,
            message: data.message,
            timestamp: new Date()
        });
        
        new CelebrationEvent({
            userId: data.userId || null,
            userName: data.username || 'Anonymous',
            eventType: 'prayer',
            title: 'Prayer Shared',
            message: data.message || ''
        }).save().catch(err => console.error('Event save error:', err));
    });
    
    // Chat message
    socket.on('chat_message', (message) => {
        io.emit('chat_message', {
            userId: socket.id,
            username: message.username,
            text: message.text,
            timestamp: new Date()
        });
    });
    
    // Blessing request
    socket.on('request_blessing', (data) => {
        io.emit('blessing_request', {
            userId: socket.id,
            username: data.username,
            message: data.message,
            timestamp: new Date()
        });
        
        new CelebrationEvent({
            userId: data.userId || null,
            userName: data.username || 'Anonymous',
            eventType: 'blessing',
            title: 'Blessing Request',
            message: data.message || ''
        }).save().catch(err => console.error('Event save error:', err));
    });
    
    // Disconnect
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
        
        connectedUsers.delete(socket.id);
        activeAnimationSessions.delete(socket.id);
        
        io.emit('user_disconnected', {
            userId: socket.id,
            remainingUsers: connectedUsers.size
        });
        io.emit('user_count', connectedUsers.size);
    });
});

// =============================================
// SCHEDULED TASKS
// =============================================

// Update visitor statistics every hour
cron.schedule('0 * * * *', async () => {
    try {
        const stats = new VisitorStats({
            totalVisitors: connectedUsers.size,
            activeUsers: connectedUsers.size,
            totalViews: connectedUsers.size * 1.5,
            averageSessionDuration: 300,
            deviceBreakdown: {
                mobile: Math.floor(connectedUsers.size * 0.4),
                tablet: Math.floor(connectedUsers.size * 0.1),
                desktop: Math.floor(connectedUsers.size * 0.5)
            }
        });
        
        await stats.save();
        console.log('📊 Visitor statistics updated');
    } catch (error) {
        console.error('Statistics update error:', error);
    }
});

// Cleanup old sessions every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        await AnimationState.deleteMany({
            timestamp: { $lt: twentyFourHoursAgo }
        });
        
        console.log('🧹 Old animation sessions cleaned up');
    } catch (error) {
        console.error('Cleanup error:', error);
    }
});

// =============================================
// HEALTH CHECK ROUTES
// =============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        connectedUsers: connectedUsers.size
    });
});

// API info
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Mahashivratri Special Animation API',
        version: '1.0.0',
        description: 'Backend API for Mahashivratri interactive celebration',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            user: {
                profile: 'GET /api/user/profile',
                preferences: 'PUT /api/user/preferences',
                avatar: 'POST /api/user/avatar'
            },
            statistics: {
                visitors: 'GET /api/stats/visitors',
                history: 'GET /api/stats/history/:days'
            },
            events: {
                celebrate: 'POST /api/events/celebrate',
                recent: 'GET /api/events/recent/:limit'
            },
            feedback: {
                submit: 'POST /api/feedback/submit',
                all: 'GET /api/feedback/all'
            }
        }
    });
});

// =============================================
// ERROR HANDLING
// =============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// =============================================
// SERVER STARTUP
// =============================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`
    🕉️  ╔══════════════════════════════════════════════════════╗
        ║   Mahashivratri Special Animation Server Running      ║
        ║   🎉 Happy Mahashivratri! 🎉                          ║
        ╚══════════════════════════════════════════════════════╝
    
    ✨ Server: http://localhost:${PORT}
    📊 API Docs: http://localhost:${PORT}/api/info
    💾 Database: ${MONGO_URI}
    🔐 Environment: ${process.env.NODE_ENV || 'development'}
    
    WebSocket Server: Ready for real-time connections
    Real-time Events: ENABLED
    `);
});

module.exports = { app, server, io };