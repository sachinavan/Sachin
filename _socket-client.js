// =============================================
// MAHASHIVRATRI - SOCKET.IO CLIENT
// =============================================

class MahashivratriSocketClient {
    constructor(serverUrl = window.location.origin) {
        this.serverUrl = serverUrl;
        this.socket = null;
        this.userId = localStorage.getItem('userId');
        this.token = localStorage.getItem('token');
        this.eventListeners = new Map();
        
        this.init();
    }

    // Initialize socket connection
    init() {
        this.socket = io(this.serverUrl, {
            auth: {
                token: this.token
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        this.setupEventListeners();
        this.setupErrorHandlers();
    }

    // Setup event listeners
    setupEventListeners() {
        // Connection events
        this.socket.on('connect', () => {
            console.log('✅ Connected to server');
            this.emit('socket_connected', { socketId: this.socket.id });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected:', reason);
            this.emit('socket_disconnected', { reason });
        });

        // User events
        this.socket.on('user_joined', (data) => {
            console.log('👤 User joined:', data.username);
            this.emit('user_joined', data);
        });

        this.socket.on('user_disconnected', (data) => {
            console.log('👤 User left');
            this.emit('user_disconnected', data);
        });

        this.socket.on('user_count', (count) => {
            console.log(`👥 Total users: ${count}`);
            this.emit('user_count_updated', { count });
        });

        // Animation events
        this.socket.on('animation_update', (data) => {
            this.emit('animation_state_updated', data);
        });

        // Celebration events
        this.socket.on('celebration_event', (data) => {
            console.log('🎉 Celebration event:', data.eventType);
            this.emit('celebration_event', data);
        });

        this.socket.on('flower_animation', (data) => {
            this.emit('flower_shower', data);
        });

        this.socket.on('wedding_dance', (data) => {
            this.emit('wedding_dance', data);
        });

        this.socket.on('blessing_request', (data) => {
            this.emit('blessing_received', data);
        });

        // Chat events
        this.socket.on('chat_message', (message) => {
            this.emit('message_received', message);
        });
    }

    // Setup error handlers
    setupErrorHandlers() {
        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.emit('connection_error', error);
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.emit('socket_error', error);
        });
    }

    // Join celebration
    joinCelebration(username) {
        this.socket.emit('join_celebration', { username });
    }

    // Trigger flower shower
    triggerFlowerShower(flowerCount = 50, position = { x: 0, y: 0 }) {
        this.socket.emit('flower_shower', {
            flowerCount,
            position
        });
    }

    // Trigger wedding dance
    triggerWeddingDance(danceMoves = [], userId = this.userId) {
        this.socket.emit('wedding_dance', {
            userId,
            danceMoves
        });
    }

    // Send prayer
    sendPrayer(message, userId = this.userId) {
        this.socket.emit('prayer', {
            userId,
            message
        });
    }

    // Request blessing
    requestBlessing(message, username) {
        this.socket.emit('request_blessing', {
            userId: this.userId,
            username,
            message
        });
    }

    // Send chat message
    sendMessage(text, username) {
        this.socket.emit('chat_message', {
            username,
            text
        });
    }

    // Send animation state
    updateAnimationState(state) {
        this.socket.emit('animation_state', state);
    }

    // Custom event listener
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    // Emit custom event
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                callback(data);
            });
        }
    }

    // Disconnect
    disconnect() {
        this.socket.disconnect();
    }

    // Reconnect
    reconnect() {
        this.socket.connect();
    }

    // Get connection status
    isConnected() {
        return this.socket.connected;
    }

    // Get socket ID
    getSocketId() {
        return this.socket.id;
    }
}

// =============================================
// API CLIENT
// =============================================

class MahashivratriAPI {
    constructor(baseUrl = window.location.origin) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('token');
    }

    // Set authorization token
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Make request
    async request(method, endpoint, data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Request failed');
            }

            return result;
        } catch (error) {
            console.error(`API Error (${method} ${endpoint}):`, error);
            throw error;
        }
    }

    // Auth endpoints
    async register(username, email, password) {
        return this.request('POST', '/api/auth/register', {
            username, email, password
        });
    }

    async login(email, password) {
        return this.request('POST', '/api/auth/login', {
            email, password
        });
    }

    // User endpoints
    async getProfile() {
        return this.request('GET', '/api/user/profile');
    }

    async updatePreferences(preferences) {
        return this.request('PUT', '/api/user/preferences', preferences);
    }

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        const options = {
            method: 'POST',
            headers: {
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            },
            body: formData
        };

        const response = await fetch(`${this.baseUrl}/api/user/avatar`, options);
        return response.json();
    }

    // Statistics endpoints
    async getVisitorStats() {
        return this.request('GET', '/api/stats/visitors');
    }

    async getStatsHistory(days = 7) {
        return this.request('GET', `/api/stats/history/${days}`);
    }

    // Event endpoints
    async recordCelebration(eventType, location = {}, message = '') {
        return this.request('POST', '/api/events/celebrate', {
            eventType, location, message
        });
    }

    async getRecentEvents(limit = 10) {
        return this.request('GET', `/api/events/recent/${limit}`);
    }

    // Feedback endpoints
    async submitFeedback(rating, comment, email) {
        return this.request('POST', '/api/feedback/submit', {
            userId: localStorage.getItem('userId'),
            rating, comment, email
        });
    }

    async getAllFeedback() {
        return this.request('GET', '/api/feedback/all');
    }

    // Health check
    async healthCheck() {
        return this.request('GET', '/api/health');
    }

    // Get API info
    async getInfo() {
        return this.request('GET', '/api/info');
    }
}

// =============================================
// GLOBAL INITIALIZATION
// =============================================

let socketClient = null;
let apiClient = null;

window.addEventListener('DOMContentLoaded', () => {
    // Initialize socket client
    socketClient = new MahashivratriSocketClient();

    // Initialize API client
    apiClient = new MahashivratriAPI();

    // Make globally available
    window.mahashivratri = {
        socket: socketClient,
        api: apiClient
    };

    console.log('🕉️ Mahashivratri clients initialized');
    console.log('📡 Socket client available at: window.mahashivratri.socket');
    console.log('🔌 API client available at: window.mahashivratri.api');
});