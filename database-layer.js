/**
 * DATABASE ABSTRACTION LAYER
 *
 * Deze laag scheidt de app logica van de database implementatie.
 * Je kunt makkelijk switchen tussen Firebase en custom backend
 * door alleen dit bestand aan te passen!
 */

// ============================================
// DATABASE INTERFACE
// ============================================
const DatabaseLayer = {
    // Current implementation
    implementation: null,

    // Initialize database connection
    async init(config) {
        if (this.implementation) {
            return this.implementation.init(config);
        }
        throw new Error('Database implementation not set');
    },

    // ============================================
    // USERS
    // ============================================
    async getUsers() {
        return await this.implementation.getUsers();
    },

    async saveUser(user) {
        return await this.implementation.saveUser(user);
    },

    async updateUser(userId, data) {
        return await this.implementation.updateUser(userId, data);
    },

    async deleteUser(userId) {
        return await this.implementation.deleteUser(userId);
    },

    // ============================================
    // EMPLOYEES
    // ============================================
    async getEmployees() {
        return await this.implementation.getEmployees();
    },

    async saveEmployee(employee) {
        return await this.implementation.saveEmployee(employee);
    },

    async updateEmployee(employeeId, data) {
        return await this.implementation.updateEmployee(employeeId, data);
    },

    async deleteEmployee(employeeId) {
        return await this.implementation.deleteEmployee(employeeId);
    },

    // ============================================
    // TOOLBOXES
    // ============================================
    async getToolboxes() {
        return await this.implementation.getToolboxes();
    },

    async saveToolbox(toolbox) {
        return await this.implementation.saveToolbox(toolbox);
    },

    async updateToolbox(toolboxId, data) {
        return await this.implementation.updateToolbox(toolboxId, data);
    },

    async deleteToolbox(toolboxId) {
        return await this.implementation.deleteToolbox(toolboxId);
    },

    // ============================================
    // COMPLETIONS
    // ============================================
    async getCompletions() {
        return await this.implementation.getCompletions();
    },

    async saveCompletion(completion) {
        return await this.implementation.saveCompletion(completion);
    },

    async updateCompletion(completionId, data) {
        return await this.implementation.updateCompletion(completionId, data);
    },

    async deleteCompletion(completionId) {
        return await this.implementation.deleteCompletion(completionId);
    },

    // ============================================
    // INVITATIONS
    // ============================================
    async getInvitations() {
        return await this.implementation.getInvitations();
    },

    async saveInvitation(invitation) {
        return await this.implementation.saveInvitation(invitation);
    },

    async updateInvitation(invitationId, data) {
        return await this.implementation.updateInvitation(invitationId, data);
    },

    async deleteInvitation(invitationId) {
        return await this.implementation.deleteInvitation(invitationId);
    },

    // ============================================
    // EMAIL CONFIG
    // ============================================
    async getEmailConfig() {
        return await this.implementation.getEmailConfig();
    },

    async saveEmailConfig(config) {
        return await this.implementation.saveEmailConfig(config);
    },

    // ============================================
    // JOB TYPES
    // ============================================
    async getJobTypes() {
        return await this.implementation.getJobTypes();
    },

    async saveJobTypes(jobTypes) {
        return await this.implementation.saveJobTypes(jobTypes);
    },

    // ============================================
    // REALTIME LISTENERS
    // ============================================
    onUsersChange(callback) {
        return this.implementation.onUsersChange(callback);
    },

    onEmployeesChange(callback) {
        return this.implementation.onEmployeesChange(callback);
    },

    onToolboxesChange(callback) {
        return this.implementation.onToolboxesChange(callback);
    },

    onCompletionsChange(callback) {
        return this.implementation.onCompletionsChange(callback);
    },

    onInvitationsChange(callback) {
        return this.implementation.onInvitationsChange(callback);
    },

    onEmailConfigChange(callback) {
        return this.implementation.onEmailConfigChange(callback);
    },

    // ============================================
    // AUTHENTICATION
    // ============================================
    async login(username, password) {
        return await this.implementation.login(username, password);
    },

    async logout() {
        return await this.implementation.logout();
    },

    async getCurrentUser() {
        return await this.implementation.getCurrentUser();
    },

    onAuthChange(callback) {
        return this.implementation.onAuthChange(callback);
    }
};

// Export voor gebruik in app
window.DB = DatabaseLayer;

console.log('✅ Database Abstraction Layer geladen');
