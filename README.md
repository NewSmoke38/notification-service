# Notification Service

A hierarchical notification preference management system built with NestJS and TypeORM. This service allows organizations to manage notification groups, topics, and user preferences across multiple communication channels.

## What It Is

This is a backend service that provides a flexible notification preference system where:

- Organizations can create notification groups and topics
- Users can control their notification preferences at both group and topic levels
- Preferences can be configured per communication channel (email, SMS, push, in-app, chat, WhatsApp)
- A two-gate system ensures notifications are only sent when explicitly allowed

The system follows an opt-in model by default, requiring users to explicitly enable notifications for specific topics and channels.

## Architecture

### Module Structure

- **Organizations Module:** Handles the people and companies, it sets up organizations and manages users, deciding who gets to be an Admin or a regular Customer.
- **Notifications Module:** Keeps your alerts organized by sorting them into broad Groups (like "Marketing") that hold specific Topics (like "New Offers"), so everything stays structured!
- **Preferences Module:** Acts as the "brain" for permissions; it lets users hit a "master switch" to mute an entire group or fine-tune their settings to just block specific channels like SMS.

### Data Flow and Hierarchy

```
Organization
    ├── Users
    │   ├── User 1 (admin/customer)
    │   └── User 2 (admin/customer)
    │
    └── Notification Groups
        ├── Group 1 (e.g., "Marketing")
        │   ├── Topic 1 (e.g., "Product Updates")
        │   │   ├── Channel: email
        │   │   ├── Channel: SMS
        │   │   └── Channel: push
        │   └── Topic 2 (e.g., "Newsletters")
        │
        └── Group 2 (e.g., "Security")
            └── Topic 1 (e.g., "Security Alerts")
```

### Notification Permission Logic (Two-Gate System)

When checking if a notification should be sent:

1. **Gate 1 - Group Preference Check**:
   - If user has disabled the entire group → BLOCK
   - If group is enabled or no preference set → Continue to Gate 2

2. **Gate 2 - Topic/Channel Preference Check**:
   - If user has explicitly enabled this topic + channel → ALLOW
   - If no explicit preference → BLOCK (opt-in model)

This ensures:
- Users can disable entire categories with one switch
- Fine-grained control per topic and channel
- Default opt-in behavior (safer for users)

### Guard System

- `AdminGuard`: Protects endpoints that should only be accessible by admin users
  - Applied to group and topic creation endpoints
  - Checks user role from request headers

## How to Run

### Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```
### Running the Application

#### Development Mode:
```bash
npm run start:dev
```
The server will start on `http://localhost:3000` or any other port you want. 

**The application currently uses SQLite with an in-memory database for development. This means:
- Data is reset on every server restart**

To use a persistent database, modify the TypeORM configuration in `src/app.module.ts`:
```typescript
database: 'path/to/database.sqlite', // instead of ':memory:'
```

