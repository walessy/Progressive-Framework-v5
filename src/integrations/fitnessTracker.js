// Progressive Framework V5 - Fitness Tracker Real Integration
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class FitnessTrackerIntegration {
    constructor() {
        this.configPath = path.join(__dirname, '../../config/fitness-tracker-config.json');
        this.providers = {
            strava: null,
            myfitnesspal: null,
            fitbit: null,
            garmin: null
        };
        this.initialized = false;
        this.activeProviders = [];
    }

    async initialize() {
        try {
            // Load configuration
            const configExists = await this.checkConfig();
            
            if (!configExists) {
                console.log('⚠️ Fitness Tracker: Configuration not found - using simulation mode');
                return false;
            }

            const config = JSON.parse(await fs.readFile(this.configPath, 'utf8'));
            
            // Initialize available providers
            for (const [provider, settings] of Object.entries(config.providers || {})) {
                if (settings.enabled && settings.access_token) {
                    this.providers[provider] = {
                        ...settings,
                        client: axios.create({
                            baseURL: settings.api_url,
                            headers: {
                                'Authorization': `Bearer ${settings.access_token}`,
                                'Content-Type': 'application/json'
                            }
                        })
                    };
                    this.activeProviders.push(provider);
                }
            }

            if (this.activeProviders.length > 0) {
                this.initialized = true;
                console.log(`✅ Fitness Tracker: Initialized with ${this.activeProviders.join(', ')}`);
                return true;
            } else {
                console.log('⚠️ Fitness Tracker: No active providers - using simulation mode');
                return false;
            }

        } catch (error) {
            console.error('❌ Fitness Tracker initialization error:', error.message);
            return false;
        }
    }

    async checkConfig() {
        try {
            await fs.access(this.configPath);
            return true;
        } catch {
            return false;
        }
    }

    // REAL API METHODS
    async logWorkout(workoutData) {
        if (!this.initialized) {
            return this.simulateLogWorkout(workoutData);
        }

        const results = [];

        // Log to each active provider
        for (const providerName of this.activeProviders) {
            try {
                const provider = this.providers[providerName];
                const result = await this.logWorkoutToProvider(providerName, provider, workoutData);
                results.push(result);
            } catch (error) {
                console.error(`❌ ${providerName} API error:`, error.message);
                results.push({
                    provider: providerName,
                    success: false,
                    error: error.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        
        return {
            success: successCount > 0,
            results: results,
            message: `✅ Workout logged to ${successCount}/${this.activeProviders.length} fitness trackers`,
            workoutSummary: this.formatWorkoutSummary(workoutData)
        };
    }

    async logWorkoutToProvider(providerName, provider, workoutData) {
        let payload;
        let endpoint;

        switch (providerName) {
            case 'strava':
                payload = {
                    name: workoutData.title || 'Workout',
                    type: this.mapWorkoutTypeToStrava(workoutData.type),
                    sport_type: this.mapWorkoutTypeToStrava(workoutData.type),
                    start_date_local: workoutData.startTime || new Date().toISOString(),
                    elapsed_time: workoutData.duration * 60, // Convert minutes to seconds
                    distance: workoutData.distance || 0, // in meters
                    description: workoutData.notes || '',
                    trainer: workoutData.isIndoor || false,
                    commute: false
                };
                endpoint = '/activities';
                break;

            case 'myfitnesspal':
                payload = {
                    exercise: {
                        name: workoutData.title || 'Workout',
                        duration_minutes: workoutData.duration || 30,
                        calories_burned: workoutData.caloriesBurned || this.estimateCalories(workoutData),
                        date: workoutData.date || new Date().toISOString().split('T')[0],
                        notes: workoutData.notes || ''
                    }
                };
                endpoint = '/exercise/log';
                break;

            case 'fitbit':
                payload = {
                    activityName: workoutData.title || 'Workout',
                    activityTypeId: this.mapWorkoutTypeToFitbit(workoutData.type),
                    durationMillis: (workoutData.duration || 30) * 60 * 1000,
                    startTime: workoutData.startTime || new Date().toISOString(),
                    calories: workoutData.caloriesBurned || this.estimateCalories(workoutData),
                    distance: workoutData.distance || 0,
                    distanceUnit: workoutData.distanceUnit || 'Kilometer'
                };
                endpoint = '/activities';
                break;

            case 'garmin':
                payload = {
                    activityName: workoutData.title || 'Workout',
                    activityTypeDTO: {
                        typeKey: this.mapWorkoutTypeToGarmin(workoutData.type)
                    },
                    startTimeLocal: workoutData.startTime || new Date().toISOString(),
                    duration: (workoutData.duration || 30) * 60, // seconds
                    distance: workoutData.distance || 0,
                    calories: workoutData.caloriesBurned || this.estimateCalories(workoutData),
                    description: workoutData.notes || ''
                };
                endpoint = '/activity-service/activity';
                break;

            default:
                throw new Error(`Unsupported provider: ${providerName}`);
        }

        const response = await provider.client.post(endpoint, payload);

        return {
            provider: providerName,
            success: true,
            activityId: response.data.id || response.data.activityId,
            message: `✅ Logged to ${providerName}`,
            data: response.data
        };
    }

    async getRecentWorkouts(days = 7) {
        if (!this.initialized) {
            return this.simulateGetRecentWorkouts(days);
        }

        const allWorkouts = [];

        for (const providerName of this.activeProviders) {
            try {
                const provider = this.providers[providerName];
                const workouts = await this.getWorkoutsFromProvider(providerName, provider, days);
                allWorkouts.push(...workouts);
            } catch (error) {
                console.error(`❌ ${providerName} API error:`, error.message);
            }
        }

        // Sort by date (most recent first)
        allWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));

        return {
            success: true,
            workouts: allWorkouts,
            message: `📊 Retrieved ${allWorkouts.length} workouts from last ${days} days`,
            summary: this.generateWorkoutSummary(allWorkouts)
        };
    }

    async getWorkoutsFromProvider(providerName, provider, days) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        let endpoint;
        let params = {};

        switch (providerName) {
            case 'strava':
                endpoint = '/athlete/activities';
                params = {
                    after: Math.floor(startDate.getTime() / 1000),
                    before: Math.floor(endDate.getTime() / 1000)
                };
                break;
            case 'fitbit':
                endpoint = '/activities/list';
                params = {
                    afterDate: startDate.toISOString().split('T')[0],
                    sort: 'desc',
                    limit: 50
                };
                break;
            default:
                return [];
        }

        const response = await provider.client.get(endpoint, { params });
        
        return response.data.map(activity => ({
            id: activity.id,
            title: activity.name || activity.activityName,
            type: activity.type || activity.activityType,
            date: activity.start_date_local || activity.startTime,
            duration: Math.round((activity.elapsed_time || activity.duration) / 60), // minutes
            distance: activity.distance || 0,
            calories: activity.calories || 0,
            provider: providerName
        }));
    }

    async logNutrition(nutritionData) {
        if (!this.initialized || !this.providers.myfitnesspal) {
            return this.simulateLogNutrition(nutritionData);
        }

        try {
            const provider = this.providers.myfitnesspal;
            
            const payload = {
                food_entry: {
                    food_name: nutritionData.foodName,
                    brand_name: nutritionData.brand || '',
                    serving_size: nutritionData.servingSize || 1,
                    meal_type: nutritionData.mealType || 'snack', // breakfast, lunch, dinner, snack
                    calories: nutritionData.calories,
                    protein: nutritionData.protein || 0,
                    carbs: nutritionData.carbs || 0,
                    fat: nutritionData.fat || 0,
                    date: nutritionData.date || new Date().toISOString().split('T')[0]
                }
            };

            const response = await provider.client.post('/food/log', payload);

            return {
                success: true,
                entryId: response.data.id,
                message: `🍎 Nutrition logged: ${nutritionData.foodName} (${nutritionData.calories} cal)`,
                provider: 'myfitnesspal'
            };

        } catch (error) {
            console.error('❌ MyFitnessPal API error:', error.message);
            return {
                success: false,
                error: error.message,
                fallback: this.simulateLogNutrition(nutritionData)
            };
        }
    }

    // SIMULATION METHODS (fallback when API not available)
    simulateLogWorkout(workoutData) {
        const simulatedId = 'SIM_' + Date.now();
        
        return {
            success: true,
            simulated: true,
            results: [{
                provider: 'simulated',
                success: true,
                activityId: simulatedId,
                message: '🧪 SIMULATED: Workout logged'
            }],
            message: `🧪 SIMULATED: ${workoutData.type || 'Workout'} logged for ${workoutData.duration || 30} minutes`,
            workoutSummary: this.formatWorkoutSummary(workoutData)
        };
    }

    simulateGetRecentWorkouts(days) {
        const simulatedWorkouts = [
            {
                id: 'sim_1',
                title: 'Morning Run',
                type: 'Run',
                date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                duration: 30,
                distance: 5.2,
                calories: 320,
                provider: 'simulated'
            },
            {
                id: 'sim_2',
                title: 'Strength Training',
                type: 'WeightTraining',
                date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                duration: 45,
                distance: 0,
                calories: 280,
                provider: 'simulated'
            },
            {
                id: 'sim_3',
                title: 'Yoga Session',
                type: 'Yoga',
                date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
                duration: 60,
                distance: 0,
                calories: 180,
                provider: 'simulated'
            }
        ];

        return {
            success: true,
            simulated: true,
            workouts: simulatedWorkouts,
            message: `🧪 SIMULATED: Showing ${simulatedWorkouts.length} mock workouts from last ${days} days`,
            summary: this.generateWorkoutSummary(simulatedWorkouts)
        };
    }

    simulateLogNutrition(nutritionData) {
        const simulatedId = 'SIM_FOOD_' + Date.now();
        
        return {
            success: true,
            simulated: true,
            entryId: simulatedId,
            message: `🧪 SIMULATED: ${nutritionData.foodName} (${nutritionData.calories} cal) would be logged`,
            provider: 'simulated'
        };
    }

    // UTILITY METHODS
    formatWorkoutSummary(workoutData) {
        return {
            type: workoutData.type || 'General',
            duration: `${workoutData.duration || 30} minutes`,
            calories: workoutData.caloriesBurned || this.estimateCalories(workoutData),
            distance: workoutData.distance ? `${workoutData.distance} km` : null,
            intensity: workoutData.intensity || 'Moderate'
        };
    }

    generateWorkoutSummary(workouts) {
        const totalWorkouts = workouts.length;
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);

        const workoutTypes = [...new Set(workouts.map(w => w.type))];

        return {
            totalWorkouts,
            totalDuration: `${totalDuration} minutes`,
            totalCalories,
            totalDistance: totalDistance > 0 ? `${totalDistance.toFixed(1)} km` : null,
            workoutTypes,
            averageWorkoutDuration: Math.round(totalDuration / totalWorkouts) || 0
        };
    }

    estimateCalories(workoutData) {
        // Basic calorie estimation based on workout type and duration
        const calorieRates = {
            'Run': 12,
            'Bike': 8,
            'WeightTraining': 6,
            'Yoga': 3,
            'Swimming': 10,
            'HIIT': 15,
            'Walk': 4,
            'default': 7
        };

        const rate = calorieRates[workoutData.type] || calorieRates.default;
        return Math.round(rate * (workoutData.duration || 30));
    }

    // Provider-specific mapping functions
    mapWorkoutTypeToStrava(type) {
        const mapping = {
            'Run': 'Run',
            'Bike': 'Ride',
            'WeightTraining': 'WeightTraining',
            'Yoga': 'Yoga',
            'Swimming': 'Swim',
            'HIIT': 'Workout',
            'Walk': 'Walk'
        };
        return mapping[type] || 'Workout';
    }

    mapWorkoutTypeToFitbit(type) {
        const mapping = {
            'Run': 90009,
            'Bike': 90001,
            'WeightTraining': 90025,
            'Yoga': 90047,
            'Swimming': 90024,
            'HIIT': 90013,
            'Walk': 90013
        };
        return mapping[type] || 90013; // General workout
    }

    mapWorkoutTypeToGarmin(type) {
        const mapping = {
            'Run': 'running',
            'Bike': 'cycling',
            'WeightTraining': 'strength_training',
            'Yoga': 'yoga',
            'Swimming': 'swimming',
            'HIIT': 'training',
            'Walk': 'walking'
        };
        return mapping[type] || 'training';
    }

    // STATUS AND UTILITY METHODS
    isConnected() {
        return this.initialized;
    }

    getStatus() {
        return {
            provider: 'fitness_tracker',
            status: this.initialized ? 'connected' : 'not_configured',
            active_providers: this.activeProviders,
            capabilities: ['log_workouts', 'get_recent_workouts', 'log_nutrition', 'workout_analytics'],
            setup_required: !this.initialized
        };
    }

    getAvailableProviders() {
        return Object.keys(this.providers).filter(provider => this.providers[provider] !== null);
    }
}

module.exports = FitnessTrackerIntegration;