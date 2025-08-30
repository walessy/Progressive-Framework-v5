// Progressive Framework V5 - Google Calendar Real Integration
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

class GoogleCalendarIntegration {
    constructor() {
        this.calendar = null;
        this.auth = null;
        this.configPath = path.join(__dirname, '../../config/google-calendar-config.json');
        this.credentialsPath = path.join(__dirname, '../../config/google-credentials.json');
        this.tokenPath = path.join(__dirname, '../../config/google-token.json');
        this.initialized = false;
    }

    async initialize() {
        try {
            // Check if credentials file exists
            const credentialsExist = await this.checkFile(this.credentialsPath);
            
            if (!credentialsExist) {
                console.log('⚠️ Google Calendar: Credentials not found - using simulation mode');
                console.log('📖 Setup guide: Set up Google Calendar API credentials');
                return false;
            }

            // Load credentials
            const credentials = JSON.parse(await fs.readFile(this.credentialsPath, 'utf8'));
            const { client_secret, client_id, redirect_uris } = credentials.web || credentials.installed;
            
            // Create OAuth2 client
            this.auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            
            // Check for existing token
            const tokenExists = await this.checkFile(this.tokenPath);
            
            if (tokenExists) {
                const token = JSON.parse(await fs.readFile(this.tokenPath, 'utf8'));
                this.auth.setCredentials(token);
                
                // Verify token is still valid
                try {
                    await this.auth.getAccessToken();
                    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
                    this.initialized = true;
                    console.log('✅ Google Calendar: Successfully initialized with saved token');
                    return true;
                } catch (tokenError) {
                    console.log('⚠️ Google Calendar: Token expired, re-authentication required');
                    return false;
                }
            } else {
                console.log('⚠️ Google Calendar: Authentication required');
                console.log('🔗 Auth URL:', this.getAuthUrl());
                return false;
            }

        } catch (error) {
            console.error('❌ Google Calendar initialization error:', error.message);
            return false;
        }
    }

    getAuthUrl() {
        if (!this.auth) return null;
        
        const SCOPES = ['https://www.googleapis.com/auth/calendar'];
        return this.auth.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
    }

    async handleAuthCode(code) {
        if (!this.auth) throw new Error('Auth client not initialized');
        
        try {
            const { tokens } = await this.auth.getToken(code);
            this.auth.setCredentials(tokens);
            
            // Save token for future use
            await fs.writeFile(this.tokenPath, JSON.stringify(tokens, null, 2));
            
            this.calendar = google.calendar({ version: 'v3', auth: this.auth });
            this.initialized = true;
            
            console.log('✅ Google Calendar: Authentication successful!');
            return true;
        } catch (error) {
            console.error('❌ Google Calendar auth error:', error.message);
            throw error;
        }
    }

    async checkFile(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    // REAL API METHODS
    async scheduleEvent(eventDetails) {
        if (!this.initialized) {
            return this.simulateScheduleEvent(eventDetails);
        }

        try {
            const event = {
                summary: eventDetails.title,
                description: eventDetails.description || '',
                start: {
                    dateTime: eventDetails.startTime,
                    timeZone: eventDetails.timezone || 'America/New_York',
                },
                end: {
                    dateTime: eventDetails.endTime,
                    timeZone: eventDetails.timezone || 'America/New_York',
                },
                location: eventDetails.location || '',
                attendees: eventDetails.attendees ? 
                    eventDetails.attendees.map(email => ({ email })) : [],
                reminders: {
                    useDefault: true,
                },
            };

            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });

            return {
                success: true,
                eventId: response.data.id,
                eventLink: response.data.htmlLink,
                message: `✅ Real Event Created: "${eventDetails.title}" scheduled for ${new Date(eventDetails.startTime).toLocaleString()}`
            };

        } catch (error) {
            console.error('❌ Google Calendar API error:', error.message);
            return {
                success: false,
                error: error.message,
                fallback: this.simulateScheduleEvent(eventDetails)
            };
        }
    }

    async listUpcomingEvents(maxResults = 10) {
        if (!this.initialized) {
            return this.simulateListEvents(maxResults);
        }

        try {
            const response = await this.calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: maxResults,
                singleEvents: true,
                orderBy: 'startTime',
            });

            const events = response.data.items.map(event => ({
                id: event.id,
                title: event.summary,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                location: event.location || 'No location',
                description: event.description || ''
            }));

            return {
                success: true,
                events: events,
                message: `📅 Retrieved ${events.length} upcoming real events`
            };

        } catch (error) {
            console.error('❌ Google Calendar API error:', error.message);
            return {
                success: false,
                error: error.message,
                fallback: this.simulateListEvents(maxResults)
            };
        }
    }

    // SIMULATION METHODS (fallback when API not available)
    simulateScheduleEvent(eventDetails) {
        const simulatedId = 'sim_' + Date.now();
        return {
            success: true,
            simulated: true,
            eventId: simulatedId,
            eventLink: `https://calendar.google.com/calendar/event?eid=${simulatedId}`,
            message: `🧪 SIMULATED: Event "${eventDetails.title}" would be scheduled for ${new Date(eventDetails.startTime).toLocaleString()}`,
            details: eventDetails
        };
    }

    simulateListEvents(maxResults) {
        const now = new Date();
        const simulatedEvents = [
            {
                id: 'sim_1',
                title: 'Morning Workout',
                start: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
                location: 'Home Gym',
                description: 'Simulated upcoming event'
            },
            {
                id: 'sim_2', 
                title: 'Team Meeting',
                start: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
                location: 'Office',
                description: 'Simulated upcoming event'
            }
        ].slice(0, maxResults);

        return {
            success: true,
            simulated: true,
            events: simulatedEvents,
            message: `🧪 SIMULATED: Showing ${simulatedEvents.length} mock upcoming events`
        };
    }

    // STATUS AND UTILITY METHODS
    isConnected() {
        return this.initialized;
    }

    getStatus() {
        return {
            provider: 'google_calendar',
            status: this.initialized ? 'connected' : 'not_configured',
            capabilities: ['schedule_events', 'list_events', 'personalized_descriptions'],
            setup_required: !this.initialized,
            auth_url: this.initialized ? null : this.getAuthUrl()
        };
    }
}

module.exports = GoogleCalendarIntegration;