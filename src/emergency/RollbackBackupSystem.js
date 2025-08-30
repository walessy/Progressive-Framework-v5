// Rollback & Backup System
// Location: C:\Projects\Progressive-Framework-v5\src\emergency\RollbackBackupSystem.js

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class RollbackBackupSystem {
    constructor() {
        this.backupPath = path.join(__dirname, '../../data/backups');
        this.rollbackPoints = new Map();
        this.backupSchedule = new Map();
        this.maxBackups = 50; // Keep last 50 backups
        this.autoBackupInterval = 3600000; // 1 hour
        
        // Backup types and their priorities
        this.backupTypes = {
            'conversations': { priority: 1, frequency: 1800000 }, // 30 minutes
            'budgets': { priority: 2, frequency: 3600000 },      // 1 hour
            'system_state': { priority: 1, frequency: 900000 },  // 15 minutes
            'agent_configs': { priority: 3, frequency: 7200000 }, // 2 hours
            'user_profiles': { priority: 2, frequency: 1800000 } // 30 minutes
        };
        
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.backupPath, { recursive: true });
            await this.loadExistingBackups();
            await this.startAutomaticBackups();
            
            console.log('💾 Rollback & Backup System initialized successfully');
        } catch (error) {
            console.error('Rollback & Backup System initialization failed:', error);
            throw error;
        }
    }

    // ========================================
    // BACKUP CREATION & MANAGEMENT
    // ========================================

    async createFullSystemBackup(reason = 'manual', metadata = {}) {
        const backupId = this.generateBackupId();
        const timestamp = new Date().toISOString();
        
        const backup = {
            id: backupId,
            timestamp: timestamp,
            reason: reason,
            type: 'full_system',
            metadata: {
                ...metadata,
                systemState: await this.captureSystemState(),
                createdBy: 'RollbackBackupSystem'
            },
            components: {},
            integrity: null,
            status: 'creating'
        };

        try {
            console.log(`💾 Starting full system backup: ${backupId}`);
            
            // Backup each component
            backup.components.conversations = await this.backupConversations();
            backup.components.budgets = await this.backupBudgets();
            backup.components.systemState = await this.backupSystemState();
            backup.components.agentConfigs = await this.backupAgentConfigs();
            backup.components.userProfiles = await this.backupUserProfiles();
            
            // Calculate integrity hash
            backup.integrity = this.calculateBackupIntegrity(backup);
            backup.status = 'completed';
            
            // Save backup metadata
            await this.saveBackupMetadata(backup);
            
            // Add to rollback points
            this.rollbackPoints.set(backupId, backup);
            
            // Clean up old backups
            await this.cleanupOldBackups();
            
            console.log(`✅ Full system backup completed: ${backupId}`);
            
            return backup;
            
        } catch (error) {
            console.error(`❌ Backup ${backupId} failed:`, error);
            backup.status = 'failed';
            backup.error = error.message;
            
            // Still save the failed backup for debugging
            await this.saveBackupMetadata(backup);
            throw error;
        }
    }

    async createIncrementalBackup(componentType, data, reason = 'auto') {
        const backupId = this.generateBackupId('inc');
        const timestamp = new Date().toISOString();
        
        const backup = {
            id: backupId,
            timestamp: timestamp,
            reason: reason,
            type: 'incremental',
            component: componentType,
            metadata: {
                systemState: await this.captureSystemState(),
                createdBy: 'RollbackBackupSystem'
            },
            data: null,
            integrity: null,
            status: 'creating'
        };

        try {
            // Compress and encrypt the data
            backup.data = await this.compressAndEncryptData(data);
            backup.integrity = this.calculateDataIntegrity(data);
            backup.status = 'completed';
            
            // Save incremental backup
            await this.saveIncrementalBackup(backup);
            
            console.log(`📦 Incremental backup created: ${componentType} - ${backupId}`);
            
            return backup;
            
        } catch (error) {
            console.error(`❌ Incremental backup ${backupId} failed:`, error);
            backup.status = 'failed';
            backup.error = error.message;
            throw error;
        }
    }

    // ========================================
    // COMPONENT-SPECIFIC BACKUP METHODS
    // ========================================

    async backupConversations() {
        try {
            const conversationPath = path.join(__dirname, '../../data/conversations');
            const backupData = await this.copyDirectoryToBackup(conversationPath, 'conversations');
            
            return {
                component: 'conversations',
                backupPath: backupData.path,
                fileCount: backupData.fileCount,
                size: backupData.size,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Conversations backup failed:', error);
            throw error;
        }
    }

    async backupBudgets() {
        try {
            const budgetPath = path.join(__dirname, '../../data/budgets');
            const backupData = await this.copyDirectoryToBackup(budgetPath, 'budgets');
            
            return {
                component: 'budgets',
                backupPath: backupData.path,
                fileCount: backupData.fileCount,
                size: backupData.size,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Budgets backup failed:', error);
            throw error;
        }
    }

    async backupSystemState() {
        try {
            const systemState = {
                timestamp: new Date().toISOString(),
                processInfo: {
                    pid: process.pid,
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage(),
                    cpuUsage: process.cpuUsage()
                },
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
                env: {
                    NODE_ENV: process.env.NODE_ENV,
                    // Add other non-sensitive environment variables as needed
                }
            };
            
            const backupFile = path.join(this.backupPath, `system_state_${Date.now()}.json`);
            await fs.writeFile(backupFile, JSON.stringify(systemState, null, 2));
            
            return {
                component: 'system_state',
                backupPath: backupFile,
                data: systemState,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('System state backup failed:', error);
            throw error;
        }
    }

    async backupAgentConfigs() {
        try {
            // This would backup agent configuration files
            // For now, we'll create a placeholder
            const configs = {
                timestamp: new Date().toISOString(),
                agents: ['MCA', 'NPA', 'WPA', 'BMA'],
                configurations: {
                    // Agent-specific configurations would go here
                }
            };
            
            const backupFile = path.join(this.backupPath, `agent_configs_${Date.now()}.json`);
            await fs.writeFile(backupFile, JSON.stringify(configs, null, 2));
            
            return {
                component: 'agent_configs',
                backupPath: backupFile,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Agent configs backup failed:', error);
            throw error;
        }
    }

    async backupUserProfiles() {
        try {
            // This would backup user profile data from the enhanced conversation store
            const profiles = {
                timestamp: new Date().toISOString(),
                profileCount: 0,
                // User profiles would be backed up here
            };
            
            const backupFile = path.join(this.backupPath, `user_profiles_${Date.now()}.json`);
            await fs.writeFile(backupFile, JSON.stringify(profiles, null, 2));
            
            return {
                component: 'user_profiles',
                backupPath: backupFile,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('User profiles backup failed:', error);
            throw error;
        }
    }

    // ========================================
    // ROLLBACK OPERATIONS
    // ========================================

    async performRollback(backupId, options = {}) {
        const {
            dryRun = false,
            verifyIntegrity = true,
            createPreRollbackBackup = true,
            components = null // null means all components
        } = options;

        console.log(`🔄 Starting rollback to backup: ${backupId}${dryRun ? ' (DRY RUN)' : ''}`);
        
        try {
            // Get the backup to rollback to
            const backup = this.rollbackPoints.get(backupId);
            if (!backup) {
                throw new Error(`Backup ${backupId} not found`);
            }

            // Verify backup integrity
            if (verifyIntegrity) {
                const isValid = await this.verifyBackupIntegrity(backup);
                if (!isValid) {
                    throw new Error(`Backup ${backupId} failed integrity check`);
                }
            }

            // Create pre-rollback backup
            let preRollbackBackup = null;
            if (createPreRollbackBackup && !dryRun) {
                preRollbackBackup = await this.createFullSystemBackup(
                    `pre_rollback_${backupId}`,
                    { rollbackTarget: backupId }
                );
            }

            const rollbackResult = {
                backupId: backupId,
                startTime: new Date().toISOString(),
                dryRun: dryRun,
                preRollbackBackup: preRollbackBackup?.id,
                componentsProcessed: [],
                componentsFailed: [],
                success: false,
                error: null
            };

            // Determine components to rollback
            const componentsToRollback = components || Object.keys(backup.components);

            // Perform rollback for each component
            for (const componentName of componentsToRollback) {
                try {
                    console.log(`🔄 Rolling back component: ${componentName}`);
                    
                    const componentBackup = backup.components[componentName];
                    if (!componentBackup) {
                        console.warn(`Component ${componentName} not found in backup ${backupId}`);
                        continue;
                    }

                    if (!dryRun) {
                        await this.rollbackComponent(componentName, componentBackup);
                    }
                    
                    rollbackResult.componentsProcessed.push({
                        component: componentName,
                        success: true,
                        timestamp: new Date().toISOString()
                    });
                    
                } catch (componentError) {
                    console.error(`Failed to rollback component ${componentName}:`, componentError);
                    rollbackResult.componentsFailed.push({
                        component: componentName,
                        error: componentError.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }

            rollbackResult.success = rollbackResult.componentsFailed.length === 0;
            rollbackResult.endTime = new Date().toISOString();

            if (rollbackResult.success) {
                console.log(`✅ Rollback to ${backupId} completed successfully`);
            } else {
                console.warn(`⚠️ Rollback to ${backupId} completed with ${rollbackResult.componentsFailed.length} component failures`);
            }

            return rollbackResult;

        } catch (error) {
            console.error(`❌ Rollback to ${backupId} failed:`, error);
            throw error;
        }
    }

    async rollbackComponent(componentName, componentBackup) {
        switch (componentName) {
            case 'conversations':
                await this.rollbackConversations(componentBackup);
                break;
                
            case 'budgets':
                await this.rollbackBudgets(componentBackup);
                break;
                
            case 'system_state':
                await this.rollbackSystemState(componentBackup);
                break;
                
            case 'agent_configs':
                await this.rollbackAgentConfigs(componentBackup);
                break;
                
            case 'user_profiles':
                await this.rollbackUserProfiles(componentBackup);
                break;
                
            default:
                console.warn(`Unknown component for rollback: ${componentName}`);
        }
    }

    async rollbackConversations(componentBackup) {
        try {
            const targetPath = path.join(__dirname, '../../data/conversations');
            
            // Clear existing conversations
            await this.clearDirectory(targetPath);
            
            // Restore from backup
            await this.restoreDirectoryFromBackup(componentBackup.backupPath, targetPath);
            
            console.log(`✅ Conversations rolled back successfully`);
            
        } catch (error) {
            console.error('Conversations rollback failed:', error);
            throw error;
        }
    }

    async rollbackBudgets(componentBackup) {
        try {
            const targetPath = path.join(__dirname, '../../data/budgets');
            
            // Clear existing budgets
            await this.clearDirectory(targetPath);
            
            // Restore from backup
            await this.restoreDirectoryFromBackup(componentBackup.backupPath, targetPath);
            
            console.log(`✅ Budgets rolled back successfully`);
            
        } catch (error) {
            console.error('Budgets rollback failed:', error);
            throw error;
        }
    }

    // ========================================
    // AUTOMATIC BACKUP SCHEDULING
    // ========================================

    async startAutomaticBackups() {
        // Schedule regular full system backups
        setInterval(async () => {
            try {
                await this.createFullSystemBackup('scheduled');
            } catch (error) {
                console.error('Scheduled backup failed:', error);
            }
        }, this.autoBackupInterval);

        // Schedule component-specific backups
        Object.entries(this.backupTypes).forEach(([componentType, config]) => {
            setInterval(async () => {
                try {
                    await this.createComponentBackup(componentType, 'scheduled');
                } catch (error) {
                    console.error(`Scheduled ${componentType} backup failed:`, error);
                }
            }, config.frequency);
        });

        console.log('📅 Automatic backup scheduling started');
    }

    async createComponentBackup(componentType, reason = 'auto') {
        try {
            let data = null;
            
            switch (componentType) {
                case 'conversations':
                    data = await this.backupConversations();
                    break;
                case 'budgets':
                    data = await this.backupBudgets();
                    break;
                case 'system_state':
                    data = await this.backupSystemState();
                    break;
                case 'agent_configs':
                    data = await this.backupAgentConfigs();
                    break;
                case 'user_profiles':
                    data = await this.backupUserProfiles();
                    break;
                default:
                    throw new Error(`Unknown component type: ${componentType}`);
            }
            
            return await this.createIncrementalBackup(componentType, data, reason);
            
        } catch (error) {
            console.error(`Component backup for ${componentType} failed:`, error);
            throw error;
        }
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    async copyDirectoryToBackup(sourcePath, componentName) {
        try {
            const backupDir = path.join(this.backupPath, componentName, Date.now().toString());
            await fs.mkdir(backupDir, { recursive: true });
            
            const stats = await this.copyDirectory(sourcePath, backupDir);
            
            return {
                path: backupDir,
                fileCount: stats.fileCount,
                size: stats.totalSize
            };
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Source directory doesn't exist, create empty backup
                console.warn(`Source directory ${sourcePath} doesn't exist, creating empty backup`);
                return {
                    path: null,
                    fileCount: 0,
                    size: 0
                };
            }
            throw error;
        }
    }

    async copyDirectory(source, destination) {
        let fileCount = 0;
        let totalSize = 0;
        
        try {
            await fs.mkdir(destination, { recursive: true });
            
            const entries = await fs.readdir(source, { withFileTypes: true });
            
            for (const entry of entries) {
                const srcPath = path.join(source, entry.name);
                const destPath = path.join(destination, entry.name);
                
                if (entry.isDirectory()) {
                    const stats = await this.copyDirectory(srcPath, destPath);
                    fileCount += stats.fileCount;
                    totalSize += stats.totalSize;
                } else {
                    await fs.copyFile(srcPath, destPath);
                    const stats = await fs.stat(srcPath);
                    fileCount++;
                    totalSize += stats.size;
                }
            }
            
        } catch (error) {
            console.error(`Failed to copy directory ${source} to ${destination}:`, error);
            throw error;
        }
        
        return { fileCount, totalSize };
    }

    async clearDirectory(dirPath) {
        try {
            const entries = await fs.readdir(dirPath);
            
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry);
                const stats = await fs.stat(fullPath);
                
                if (stats.isDirectory()) {
                    await this.clearDirectory(fullPath);
                    await fs.rmdir(fullPath);
                } else {
                    await fs.unlink(fullPath);
                }
            }
            
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`Failed to clear directory ${dirPath}:`, error);
                throw error;
            }
        }
    }

    async restoreDirectoryFromBackup(backupPath, targetPath) {
        if (!backupPath) {
            console.warn('No backup path provided, skipping restore');
            return;
        }
        
        await fs.mkdir(targetPath, { recursive: true });
        await this.copyDirectory(backupPath, targetPath);
    }

    calculateBackupIntegrity(backup) {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify({
            id: backup.id,
            timestamp: backup.timestamp,
            components: backup.components
        }));
        return hash.digest('hex');
    }

    calculateDataIntegrity(data) {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(data));
        return hash.digest('hex');
    }

    async verifyBackupIntegrity(backup) {
        try {
            const calculatedHash = this.calculateBackupIntegrity(backup);
            return calculatedHash === backup.integrity;
        } catch (error) {
            console.error('Backup integrity verification failed:', error);
            return false;
        }
    }

    async compressAndEncryptData(data) {
        // For now, just JSON stringify
        // In production, you might want to compress and encrypt
        return JSON.stringify(data);
    }

    async saveBackupMetadata(backup) {
        const metadataFile = path.join(this.backupPath, `${backup.id}_metadata.json`);
        await fs.writeFile(metadataFile, JSON.stringify(backup, null, 2));
    }

    async saveIncrementalBackup(backup) {
        const backupFile = path.join(this.backupPath, `${backup.id}.json`);
        await fs.writeFile(backupFile, JSON.stringify(backup, null, 2));
    }

    async loadExistingBackups() {
        try {
            const files = await fs.readdir(this.backupPath);
            const metadataFiles = files.filter(file => file.endsWith('_metadata.json'));
            
            let loadedCount = 0;
            
            for (const metadataFile of metadataFiles) {
                try {
                    const filePath = path.join(this.backupPath, metadataFile);
                    const metadata = JSON.parse(await fs.readFile(filePath, 'utf8'));
                    
                    if (metadata.status === 'completed') {
                        this.rollbackPoints.set(metadata.id, metadata);
                        loadedCount++;
                    }
                    
                } catch (fileError) {
                    console.warn(`Failed to load backup metadata ${metadataFile}:`, fileError.message);
                }
            }
            
            console.log(`📚 Loaded ${loadedCount} existing backups`);
            
        } catch (error) {
            console.warn('Failed to load existing backups:', error.message);
        }
    }

    async cleanupOldBackups() {
        try {
            const backups = Array.from(this.rollbackPoints.values())
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            if (backups.length > this.maxBackups) {
                const backupsToDelete = backups.slice(this.maxBackups);
                
                for (const backup of backupsToDelete) {
                    await this.deleteBackup(backup.id);
                }
                
                console.log(`🧹 Cleaned up ${backupsToDelete.length} old backups`);
            }
            
        } catch (error) {
            console.error('Backup cleanup failed:', error);
        }
    }

    async deleteBackup(backupId) {
        try {
            const backup = this.rollbackPoints.get(backupId);
            if (!backup) return;
            
            // Delete metadata file
            const metadataFile = path.join(this.backupPath, `${backupId}_metadata.json`);
            await fs.unlink(metadataFile).catch(() => {}); // Ignore if doesn't exist
            
            // Delete component backups
            if (backup.components) {
                Object.values(backup.components).forEach(async (component) => {
                    if (component.backupPath) {
                        await fs.rmdir(component.backupPath, { recursive: true }).catch(() => {});
                    }
                });
            }
            
            // Remove from rollback points
            this.rollbackPoints.delete(backupId);
            
        } catch (error) {
            console.error(`Failed to delete backup ${backupId}:`, error);
        }
    }

    generateBackupId(prefix = 'backup') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async captureSystemState() {
        return {
            timestamp: new Date().toISOString(),
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            nodeVersion: process.version
        };
    }

    // ========================================
    // PUBLIC API METHODS
    // ========================================

    getAvailableBackups() {
        return Array.from(this.rollbackPoints.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(backup => ({
                id: backup.id,
                timestamp: backup.timestamp,
                type: backup.type,
                reason: backup.reason,
                status: backup.status,
                components: Object.keys(backup.components || {}),
                size: this.calculateBackupSize(backup)
            }));
    }

    calculateBackupSize(backup) {
        if (!backup.components) return 0;
        
        return Object.values(backup.components).reduce((total, component) => {
            return total + (component.size || 0);
        }, 0);
    }

    getBackupDetails(backupId) {
        return this.rollbackPoints.get(backupId);
    }

    async createManualBackup(reason = 'manual') {
        return await this.createFullSystemBackup(reason, { manual: true });
    }

    async testRollback(backupId) {
        return await this.performRollback(backupId, { dryRun: true });
    }

    getBackupStatistics() {
        const backups = Array.from(this.rollbackPoints.values());
        
        return {
            totalBackups: backups.length,
            completedBackups: backups.filter(b => b.status === 'completed').length,
            failedBackups: backups.filter(b => b.status === 'failed').length,
            totalSize: backups.reduce((size, backup) => size + this.calculateBackupSize(backup), 0),
            oldestBackup: backups.length > 0 ? 
                backups.reduce((oldest, backup) => 
                    new Date(backup.timestamp) < new Date(oldest.timestamp) ? backup : oldest
                ).timestamp : null,
            newestBackup: backups.length > 0 ? 
                backups.reduce((newest, backup) => 
                    new Date(backup.timestamp) > new Date(newest.timestamp) ? backup : newest
                ).timestamp : null,
            backupTypes: this.backupTypes
        };
    }
}

module.exports = RollbackBackupSystem;