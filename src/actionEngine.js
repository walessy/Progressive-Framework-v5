// Progressive Framework V5 - Enhanced Action Engine with Real Integrations
const GoogleCalendarIntegration = require('./integrations/googleCalendar');
const FoodDeliveryIntegration = require('./integrations/foodDelivery');
const FitnessTrackerIntegration = require('./integrations/fitnessTracker');

class EnhancedActionEngine {
    constructor() {
        this.integrations = {
            calendar: new GoogleCalendarIntegration(),
            foodDelivery: new FoodDeliveryIntegration(),
            fitness: new FitnessTrackerIntegration()
        };
        this.initialized = false;
        this.actionHistory = [];
    }

    async initialize() {
        console.log('🚀 Initializing Enhanced Action Engine...');
        
        // Initialize all integrations
        const initResults = {
            calendar: await this.integrations.calendar.initialize(),
            foodDelivery: await this.integrations.foodDelivery.initialize(),
            fitness: await this.integrations.fitness.initialize()
        };

        // Log initialization status
        for (const [service, success] of Object.entries(initResults)) {
            const status = success ? '✅ Connected' : '🧪 Simulation Mode';
            console.log(`${status}: ${service}`);
        }

        this.initialized = true;
        
        const connectedCount = Object.values(initResults).filter(Boolean).length;
        const totalServices = Object.keys(initResults).length;
        
        console.log(`🎯 Enhanced Action Engine: ${connectedCount}/${totalServices} real integrations active`);
        
        return {
            success: true,
            connectedServices: connectedCount,
            totalServices: totalServices,
            details: initResults
        };
    }

    async executeAction(actionType, parameters, context = {}) {
        if (!this.initialized) {
            await this.initialize();
        }

        const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const startTime = Date.now();

        console.log(`🎬 Executing Action: ${actionType}`, parameters);

        try {
            let result;

            switch (actionType) {
                case 'schedule_event':
                    result = await this.handleScheduleEvent(parameters, context);
                    break;
                
                case 'list_events':
                    result = await this.handleListEvents(parameters, context);
                    break;
                
                case 'order_food':
                    result = await this.handleOrderFood(parameters, context);
                    break;
                
                case 'search_restaurants':
                    result = await this.handleSearchRestaurants(parameters, context);
                    break;
                
                case 'track_food_order':
                    result = await this.handleTrackFoodOrder(parameters, context);
                    break;
                
                case 'log_workout':
                    result = await this.handleLogWorkout(parameters, context);
                    break;
                
                case 'get_recent_workouts':
                    result = await this.handleGetRecentWorkouts(parameters, context);
                    break;
                
                case 'log_nutrition':
                    result = await this.handleLogNutrition(parameters, context);
                    break;
                
                case 'plan_healthy_day':
                    result = await this.handlePlanHealthyDay(parameters, context);
                    break;
                
                case 'fitness_progress_report':
                    result = await this.handleFitnessProgressReport(parameters, context);
                    break;
                
                default:
                    result = {
                        success: false,
                        error: `Unknown action type: ${actionType}`,
                        message: `❌ Action "${actionType}" is not supported`
                    };
            }

            // Record action in history
            const actionRecord = {
                id: actionId,
                type: actionType,
                parameters,
                context,
                result,
                timestamp: new Date().toISOString(),
                executionTime: Date.now() - startTime,
                success: result.success
            };

            this.actionHistory.push(actionRecord);

            // Keep only last 100 actions
            if (this.actionHistory.length > 100) {
                this.actionHistory.shift();
            }

            console.log(`✨ Action Complete: ${actionType} (${Date.now() - startTime}ms)`);
            return result;

        } catch (error) {
            console.error(`❌ Action Error: ${actionType}`, error);
            
            const errorResult = {
                success: false,
                error: error.message,
                message: `❌ Action "${actionType}" failed: ${error.message}`
            };

            // Still record failed action
            this.actionHistory.push({
                id: actionId,
                type: actionType,
                parameters,
                context,
                result: errorResult,
                timestamp: new Date().toISOString(),
                executionTime: Date.now() - startTime,
                success: false
            });

            return errorResult;
        }
    }

    // CALENDAR ACTIONS
    async handleScheduleEvent(params, context) {
        const eventDetails = {
            title: params.title || params.summary || 'New Event',
            description: params.description || params.notes || '',
            startTime: params.startTime || params.start,
            endTime: params.endTime || params.end,
            location: params.location || '',
            attendees: params.attendees || [],
            timezone: params.timezone || context.userTimezone || 'America/New_York'
        };

        const result = await this.integrations.calendar.scheduleEvent(eventDetails);
        
        return {
            ...result,
            actionType: 'schedule_event',
            enhancedMessage: this.enhanceMessage(result.message, 'calendar', context)
        };
    }

    async handleListEvents(params, context) {
        const maxResults = params.maxResults || params.limit || 10;
        const result = await this.integrations.calendar.listUpcomingEvents(maxResults);
        
        return {
            ...result,
            actionType: 'list_events',
            enhancedMessage: this.enhanceMessage(result.message, 'calendar', context),
            formattedEvents: result.events?.map(event => this.formatEventForDisplay(event))
        };
    }

    // FOOD DELIVERY ACTIONS
    async handleOrderFood(params, context) {
        const orderDetails = {
            restaurantId: params.restaurantId,
            items: params.items || [],
            address: params.address || context.userAddress,
            deliveryTime: params.deliveryTime || 'asap',
            paymentMethod: params.paymentMethod || 'default',
            specialInstructions: params.specialInstructions || params.notes,
            estimatedTotal: params.estimatedTotal,
            tip: params.tip
        };

        const result = await this.integrations.foodDelivery.orderFood(orderDetails);
        
        return {
            ...result,
            actionType: 'order_food',
            enhancedMessage: this.enhanceMessage(result.message, 'food', context)
        };
    }

    async handleSearchRestaurants(params, context) {
        const criteria = {
            location: params.location || context.userLocation,
            cuisine: params.cuisine || params.cuisineType,
            priceRange: params.priceRange,
            maxDeliveryTime: params.maxDeliveryTime,
            minRating: params.minRating,
            limit: params.limit || 10
        };

        const result = await this.integrations.foodDelivery.searchRestaurants(criteria);
        
        return {
            ...result,
            actionType: 'search_restaurants',
            enhancedMessage: this.enhanceMessage(result.message, 'food', context),
            formattedRestaurants: result.restaurants?.map(restaurant => this.formatRestaurantForDisplay(restaurant))
        };
    }

    async handleTrackFoodOrder(params, context) {
        const orderId = params.orderId || params.orderNumber;
        const result = await this.integrations.foodDelivery.trackOrder(orderId);
        
        return {
            ...result,
            actionType: 'track_food_order',
            enhancedMessage: this.enhanceMessage(result.message, 'food', context)
        };
    }

    // FITNESS ACTIONS
    async handleLogWorkout(params, context) {
        const workoutData = {
            title: params.title || params.name || `${params.type || 'Workout'} Session`,
            type: params.type || 'General',
            duration: params.duration || 30,
            startTime: params.startTime || new Date().toISOString(),
            distance: params.distance,
            caloriesBurned: params.calories || params.caloriesBurned,
            intensity: params.intensity || 'Moderate',
            notes: params.notes || params.description,
            isIndoor: params.isIndoor || false,
            date: params.date
        };

        const result = await this.integrations.fitness.logWorkout(workoutData);
        
        return {
            ...result,
            actionType: 'log_workout',
            enhancedMessage: this.enhanceMessage(result.message, 'fitness', context)
        };
    }

    async handleGetRecentWorkouts(params, context) {
        const days = params.days || params.period || 7;
        const result = await this.integrations.fitness.getRecentWorkouts(days);
        
        return {
            ...result,
            actionType: 'get_recent_workouts',
            enhancedMessage: this.enhanceMessage(result.message, 'fitness', context),
            formattedWorkouts: result.workouts?.map(workout => this.formatWorkoutForDisplay(workout))
        };
    }

    async handleLogNutrition(params, context) {
        const nutritionData = {
            foodName: params.foodName || params.food,
            brand: params.brand,
            servingSize: params.servingSize || params.serving,
            mealType: params.mealType || params.meal || 'snack',
            calories: params.calories,
            protein: params.protein,
            carbs: params.carbs || params.carbohydrates,
            fat: params.fat,
            date: params.date
        };

        const result = await this.integrations.fitness.logNutrition(nutritionData);
        
        return {
            ...result,
            actionType: 'log_nutrition',
            enhancedMessage: this.enhanceMessage(result.message, 'fitness', context)
        };
    }

    // COMPLEX COMPOSITE ACTIONS
    async handlePlanHealthyDay(params, context) {
        const results = {
            workoutPlanned: false,
            mealsPlanned: false,
            calendarCleared: false
        };

        try {
            // 1. Schedule workout
            if (params.includeWorkout !== false) {
                const workoutTime = params.workoutTime || this.suggestWorkoutTime();
                const workoutResult = await this.handleScheduleEvent({
                    title: '🏋️ Daily Workout',
                    startTime: workoutTime,
                    endTime: new Date(new Date(workoutTime).getTime() + 60 * 60 * 1000).toISOString(),
                    description: 'Scheduled by your AI health assistant'
                }, context);
                results.workoutPlanned = workoutResult.success;
            }

            // 2. Get healthy meal suggestions
            if (params.includeMeals !== false) {
                const preferences = {
                    vegetarian: params.vegetarian || context.dietaryPreferences?.vegetarian,
                    maxCalories: params.maxCaloriesPerMeal || 500
                };
                const mealResult = await this.integrations.foodDelivery.suggestHealthyOptions(preferences);
                results.mealSuggestions = mealResult.suggestions;
                results.mealsPlanned = mealResult.success;
            }

            // 3. Check calendar for conflicts
            const eventsResult = await this.handleListEvents({ maxResults: 5 }, context);
            results.upcomingEvents = eventsResult.events;
            results.calendarCleared = eventsResult.success;

            return {
                success: true,
                actionType: 'plan_healthy_day',
                results: results,
                message: `🌟 Healthy Day Planned! Workout: ${results.workoutPlanned ? '✅' : '❌'}, Meals: ${results.mealsPlanned ? '✅' : '❌'}`,
                recommendations: this.generateHealthyDayRecommendations(results, context)
            };

        } catch (error) {
            return {
                success: false,
                actionType: 'plan_healthy_day',
                error: error.message,
                message: '❌ Failed to plan healthy day',
                partialResults: results
            };
        }
    }

    async handleFitnessProgressReport(params, context) {
        const days = params.days || 30;
        
        try {
            // Get recent workouts
            const workoutsResult = await this.handleGetRecentWorkouts({ days }, context);
            
            // Generate progress analysis
            const analysis = this.analyzeWorkoutProgress(workoutsResult.workouts || [], days);
            
            return {
                success: true,
                actionType: 'fitness_progress_report',
                period: `${days} days`,
                workouts: workoutsResult.workouts,
                summary: workoutsResult.summary,
                analysis: analysis,
                recommendations: this.generateFitnessRecommendations(analysis),
                message: `📊 Fitness Progress Report: ${analysis.totalWorkouts} workouts in ${days} days`
            };

        } catch (error) {
            return {
                success: false,
                actionType: 'fitness_progress_report',
                error: error.message,
                message: '❌ Failed to generate fitness progress report'
            };
        }
    }

    // UTILITY AND FORMATTING METHODS
    enhanceMessage(originalMessage, category, context) {
        const enhancements = {
            calendar: ['📅', '🗓️', '⏰'],
            food: ['🍽️', '🍕', '🥗', '🍔'],
            fitness: ['💪', '🏃‍♀️', '🏋️', '🧘']
        };

        const emoji = enhancements[category]?.[Math.floor(Math.random() * enhancements[category].length)] || '🤖';
        const userName = context.userName || 'there';
        
        return `${emoji} ${originalMessage}${context.addPersonalization ? ` - Great job, ${userName}!` : ''}`;
    }

    formatEventForDisplay(event) {
        return {
            ...event,
            displayTime: new Date(event.start).toLocaleString(),
            duration: event.end ? this.calculateDuration(event.start, event.end) : null,
            isToday: this.isToday(event.start),
            timeUntil: this.getTimeUntil(event.start)
        };
    }

    formatRestaurantForDisplay(restaurant) {
        return {
            ...restaurant,
            displayRating: `⭐ ${restaurant.rating}`,
            displayDeliveryTime: `🚚 ${restaurant.deliveryTime}`,
            displayFee: `💰 $${restaurant.deliveryFee}`,
            isRecommended: restaurant.rating >= 4.5 && restaurant.deliveryTime.includes('30') || restaurant.deliveryTime.includes('25')
        };
    }

    formatWorkoutForDisplay(workout) {
        return {
            ...workout,
            displayDate: new Date(workout.date).toLocaleDateString(),
            displayDuration: `⏱️ ${workout.duration} min`,
            displayCalories: `🔥 ${workout.calories} cal`,
            displayDistance: workout.distance > 0 ? `📏 ${workout.distance} km` : null,
            efficiency: this.calculateWorkoutEfficiency(workout)
        };
    }

    // ANALYSIS AND RECOMMENDATION METHODS
    analyzeWorkoutProgress(workouts, days) {
        const totalWorkouts = workouts.length;
        const workoutsPerWeek = (totalWorkouts / days) * 7;
        const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        
        const workoutTypes = workouts.reduce((acc, w) => {
            acc[w.type] = (acc[w.type] || 0) + 1;
            return acc;
        }, {});

        const consistency = this.calculateConsistency(workouts, days);
        const trend = this.calculateProgressTrend(workouts);

        return {
            totalWorkouts,
            workoutsPerWeek: Math.round(workoutsPerWeek * 10) / 10,
            totalCalories,
            totalDuration,
            averageCaloriesPerWorkout: Math.round(totalCalories / totalWorkouts) || 0,
            averageDurationPerWorkout: Math.round(totalDuration / totalWorkouts) || 0,
            mostFrequentWorkoutType: Object.keys(workoutTypes).reduce((a, b) => workoutTypes[a] > workoutTypes[b] ? a : b, 'None'),
            workoutTypes,
            consistency: consistency,
            trend: trend
        };
    }

    generateFitnessRecommendations(analysis) {
        const recommendations = [];

        if (analysis.workoutsPerWeek < 3) {
            recommendations.push('💡 Try to increase workout frequency to 3-4 times per week for optimal results');
        }

        if (analysis.averageDurationPerWorkout < 30) {
            recommendations.push('💡 Consider extending workout sessions to 30-45 minutes for better effectiveness');
        }

        if (Object.keys(analysis.workoutTypes).length < 2) {
            recommendations.push('💡 Add variety to your routine - try mixing cardio, strength, and flexibility exercises');
        }

        if (analysis.consistency < 0.5) {
            recommendations.push('💡 Focus on consistency - even short, regular workouts are better than sporadic long sessions');
        }

        if (analysis.trend === 'declining') {
            recommendations.push('💡 Your workout frequency has been declining - consider scheduling workouts in advance');
        }

        if (recommendations.length === 0) {
            recommendations.push('🌟 Great job! Keep up your excellent workout routine!');
        }

        return recommendations;
    }

    generateHealthyDayRecommendations(results, context) {
        const recommendations = [];

        if (results.workoutPlanned) {
            recommendations.push('🏃‍♀️ Workout scheduled! Remember to warm up and stay hydrated');
        }

        if (results.mealsPlanned) {
            recommendations.push('🥗 Healthy meal options found! Try to eat balanced portions throughout the day');
        }

        if (results.upcomingEvents?.length > 3) {
            recommendations.push('⏰ Busy day ahead! Consider meal prep and quick workout options');
        }

        recommendations.push('💧 Don\'t forget to drink plenty of water throughout the day');
        recommendations.push('😴 Aim for 7-8 hours of sleep for optimal recovery');

        return recommendations;
    }

    // HELPER METHODS
    suggestWorkoutTime() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(7, 0, 0, 0); // 7 AM tomorrow
        return tomorrow.toISOString();
    }

    calculateDuration(start, end) {
        const duration = (new Date(end) - new Date(start)) / (1000 * 60); // minutes
        return `${Math.round(duration)} minutes`;
    }

    isToday(dateString) {
        const today = new Date().toDateString();
        const eventDate = new Date(dateString).toDateString();
        return today === eventDate;
    }

    getTimeUntil(dateString) {
        const now = new Date();
        const eventTime = new Date(dateString);
        const diff = eventTime - now;
        
        if (diff < 0) return 'Past';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days} day${days !== 1 ? 's' : ''}`;
        }
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        
        return `${minutes}m`;
    }

    calculateWorkoutEfficiency(workout) {
        // Simple efficiency score based on calories/minute
        if (!workout.calories || !workout.duration || workout.duration === 0) return 'N/A';
        
        const efficiency = workout.calories / workout.duration;
        if (efficiency > 10) return 'High';
        if (efficiency > 6) return 'Good';
        if (efficiency > 3) return 'Fair';
        return 'Low';
    }

    calculateConsistency(workouts, days) {
        if (workouts.length === 0) return 0;
        
        // Group workouts by day
        const workoutDays = new Set();
        workouts.forEach(workout => {
            const day = new Date(workout.date).toDateString();
            workoutDays.add(day);
        });
        
        return workoutDays.size / days;
    }

    calculateProgressTrend(workouts) {
        if (workouts.length < 4) return 'insufficient_data';
        
        // Compare first half vs second half
        const midpoint = Math.floor(workouts.length / 2);
        const firstHalf = workouts.slice(0, midpoint);
        const secondHalf = workouts.slice(midpoint);
        
        const firstHalfAvg = firstHalf.reduce((sum, w) => sum + (w.calories || 0), 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, w) => sum + (w.calories || 0), 0) / secondHalf.length;
        
        const change = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;
        
        if (change > 0.1) return 'improving';
        if (change < -0.1) return 'declining';
        return 'stable';
    }

    // STATUS AND ADMIN METHODS
    getStatus() {
        return {
            initialized: this.initialized,
            integrations: {
                calendar: this.integrations.calendar.getStatus(),
                foodDelivery: this.integrations.foodDelivery.getStatus(),
                fitness: this.integrations.fitness.getStatus()
            },
            actionHistory: {
                totalActions: this.actionHistory.length,
                recentActions: this.actionHistory.slice(-5).map(a => ({
                    type: a.type,
                    success: a.success,
                    timestamp: a.timestamp
                }))
            },
            capabilities: this.getCapabilities()
        };
    }

    getCapabilities() {
        const capabilities = [];
        
        if (this.integrations.calendar.isConnected()) {
            capabilities.push('Real Calendar Management');
        } else {
            capabilities.push('Simulated Calendar Management');
        }
        
        if (this.integrations.foodDelivery.isConnected()) {
            capabilities.push('Real Food Ordering');
        } else {
            capabilities.push('Simulated Food Ordering');
        }
        
        if (this.integrations.fitness.isConnected()) {
            capabilities.push('Real Fitness Tracking');
        } else {
            capabilities.push('Simulated Fitness Tracking');
        }
        
        capabilities.push('Complex Action Planning');
        capabilities.push('Progress Analytics');
        capabilities.push('Personalized Recommendations');
        
        return capabilities;
    }

    getActionHistory(limit = 10) {
        return this.actionHistory.slice(-limit).reverse();
    }
}

module.exports = EnhancedActionEngine;