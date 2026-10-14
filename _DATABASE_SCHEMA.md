# 🗄️ Mahashivratri Animation - Database Schema Documentation

## Overview
Complete MongoDB database schema for storing all information related to the Mahashivratri Special Animation platform.

## Collections

### 1. **Users Collection**
Stores user account information and preferences.

**Fields:**
- `username` - Unique username
- `email` - User email address
- `password` - Hashed password
- `firstName`, `lastName` - User's name
- `avatar` - Profile picture URL
- `preferences` - Sound, theme, language settings
- `role` - User role (user, moderator, admin)
- `visitationHistory` - Array of visit records
- `createdAt`, `updatedAt` - Timestamps

**Indexes:**
- `username` (unique)
- `email` (unique)
- `createdAt` (descending)

---

### 2. **Celebration Events Collection**
Tracks all celebration activities and user interactions.

**Fields:**
- `eventType` - Type of event (flower_shower, wedding_dance, etc.)
- `userId` - Reference to User
- `userName` - Event organizer name
- `title`, `description` - Event details
- `participantsCount` - Number of participants
- `location` - Geographic coordinates
- `images`, `videos` - Media attachments
- `likes`, `comments`, `shares` - Engagement metrics
- `status` - Event status (active, completed, archived)
- `tags`, `category` - Organization
- `createdAt`, `updatedAt` - Timestamps

**Indexes:**
- `eventType` + `createdAt` (compound)
- `location.coordinates` (geospatial)
- `userId` (reference)

---

### 3. **Visitor Statistics Collection**
Records analytics and visitor data.

**Fields:**
- `date` - Statistics date
- `totalVisitors` - Total visitor count
- `uniqueVisitors` - Unique visitor count
- `activeUsers` - Currently active users
- `totalPageViews` - Total page views
- `deviceBreakdown` - Mobile, tablet, desktop percentages
- `operatingSystems` - OS breakdown
- `browsers` - Browser statistics
- `geography` - Country and city data
- `trafficSources` - Source of traffic
- `userBehavior` - User actions and events
- `animationMetrics` - Animation performance
- `conversions` - Conversion tracking

**Indexes:**
- `date` (descending)
- Compound index on year, month, day

---

### 4. **Feedback Collection**
Stores user feedback and feature requests.

**Fields:**
- `userId` - Reference to User
- `rating` - 1-5 star rating
- `ratingCategory` - Specific area ratings
- `comment` - User feedback text
- `feedback_type` - Type (suggestion, bug, complaint, etc.)
- `issueCategory` - Issue classification
- `deviceInfo` - Device details when submitted
- `attachments` - File uploads
- `response` - Admin response
- `priority` - Issue priority level
- `status` - Resolution status
- `createdAt`, `updatedAt` - Timestamps

**Indexes:**
- `userId` + `createdAt` (compound)
- `rating`
- `response.status`

---

### 5. **Animation State Collection**
Captures animation session data and performance metrics.

**Fields:**
- `sessionId` - Unique session identifier
- `userId` - Reference to User
- `animationStatus` - Current animation state
- `currentFrame` - Current animation frame
- `flowerAnimation` - Flower animation settings
- `deityAnimation` - Deity position and rotation
- `particleSystem` - Particle system metrics
- `effects` - Visual effects settings
- `audioSettings` - Sound preferences
- `performanceMetrics` - FPS, CPU, GPU usage
- `userInteractions` - Click, scroll, keyboard events
- `sessionDuration` - Session length
- `deviceInfo` - Device information
- `errors` - Error logs during session

**Indexes:**
- `sessionId` (unique)
- `userId` + `createdAt` (compound)
- `animationStatus`
- Auto-expires after 24 hours

---

### 6. **Messages & Conversations Collections**
Handles real-time chat and communication.

**Message Fields:**
- `conversationId` - Reference to Conversation
- `senderId` - Reference to User
- `messageType` - Text, image, video, emoji
- `content` - Message text
- `media` - File attachments
- `reactions` - Emoji reactions
- `replies` - Thread replies
- `status` - Sent, delivered, read
- `readBy` - Who read the message
- `editHistory` - Edit tracking

**Conversation Fields:**
- `participants` - Array of user IDs
- `conversationType` - Private, group, prayer circle
- `name` - Conversation title
- `lastMessage` - Most recent message
- `unreadCounts` - Unread per participant
- `settings` - Mute, archive settings

**Indexes:**
- Message: `conversationId` + `createdAt`
- Conversation: `participants`

---

### 7. **Donations Collection**
Tracks monetary contributions.

**Fields:**
- `donorId` - Reference to User (nullable)
- `donorName`, `donorEmail` - Donor information
- `amount` - Donation amount
- `currency` - Currency code
- `donationType` - One-time, monthly, yearly
- `donationPurpose` - Purpose of donation
- `paymentMethod` - Payment type
- `transactionId` - Payment processor ID
- `paymentStatus` - Pending, completed, failed
- `stripeChargeId` - Stripe integration
- `invoiceUrl`, `receiptUrl` - Documents
- `isRecurring` - Recurring donation flag
- `refundStatus` - Refund tracking
- `isAnonymous` - Anonymous donation flag
- `createdAt` - Donation date

**Indexes:**
- `transactionId` (unique)
- `donorId` + `createdAt` (compound)
- `paymentStatus`

---

### 8. **Notifications Collection**
Stores user notifications.

**Fields:**
- `recipientId` - Reference to User
- `notificationType` - Type of notification
- `senderId` - Reference to User (sender)
- `title`, `body` - Notification content
- `actionUrl` - Action link
- `isRead` - Read status
- `priority` - Low, normal, high, urgent
- `channels` - In-app, email, push, SMS
- `relatedEntity` - Related object reference
- `expiresAt` - Expiration date
- `createdAt`, `updatedAt` - Timestamps

**Indexes:**
- `recipientId` + `createdAt` (compound)
- `recipientId` + `isRead` (compound)

---

## Relationships
