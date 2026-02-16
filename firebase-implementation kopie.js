/**
 * FIREBASE IMPLEMENTATION
 *
 * Deze implementatie gebruikt Firebase Realtime Database.
 * Later kan je dit vervangen door een custom backend implementatie
 * zonder de rest van de app aan te passen!
 */

const FirebaseImplementation = {
    db: null,
    auth: null,
    userId: null,

    // ============================================
    // INITIALIZATION
    // ============================================
    async init(firebaseConfig) {
        try {
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.db = firebase.database();
            this.auth = firebase.auth();

            console.log('✅ Firebase geïnitialiseerd');

            // Wait for auth state
            return new Promise((resolve) => {
                this.auth.onAuthStateChanged((user) => {
                    if (user) {
                        this.userId = user.uid;
                        console.log('✅ Gebruiker ingelogd:', user.email);
                    }
                    resolve(true);
                });
            });
        } catch (error) {
            console.error('❌ Firebase init error:', error);
            throw error;
        }
    },

    // ============================================
    // HELPER: Get company ID (voor multi-tenant support later)
    // ============================================
    getCompanyPath() {
        // Voor nu: 1 bedrijf
        // Later: meerdere bedrijven per Firebase instance
        return 'companies/containers-maes';
    },

    // ============================================
    // USERS
    // ============================================
    async getUsers() {
        const snapshot = await this.db.ref(`${this.getCompanyPath()}/users`).once('value');
        const data = snapshot.val();
        return data ? Object.values(data) : [];
    },

    async saveUser(user) {
        await this.db.ref(`${this.getCompanyPath()}/users/${user.id}`).set(user);
        return user;
    },

    async updateUser(userId, data) {
        await this.db.ref(`${this.getCompanyPath()}/users/${userId}`).update(data);
        return data;
    },

    async deleteUser(userId) {
        await this.db.ref(`${this.getCompanyPath()}/users/${userId}`).remove();
        return true;
    },

    // ============================================
    // EMPLOYEES
    // ============================================
    async getEmployees() {
        const snapshot = await this.db.ref(`${this.getCompanyPath()}/employees`).once('value');
        const data = snapshot.val();
        return data ? Object.values(data) : [];
    },

    async saveEmployee(employee) {
        await this.db.ref(`${this.getCompanyPath()}/employees/${employee.id}`).set(employee);
        return employee;
    },

    async updateEmployee(employeeId, data) {
        await this.db.ref(`${this.getCompanyPath()}/employees/${employeeId}`).update(data);
        return data;
    },

    async deleteEmployee(employeeId) {
        await this.db.ref(`${this.getCompanyPath()}/employees/${employeeId}`).remove();
        return true;
    },

    // ============================================
    // TOOLBOXES
    // ============================================
    async getToolboxes() {
        const snapshot = await this.db.ref(`${this.getCompanyPath()}/toolboxes`).once('value');
        const data = snapshot.val();
        return data ? Object.values(data) : [];
    },

    async saveToolbox(toolbox) {
        await this.db.ref(`${this.getCompanyPath()}/toolboxes/${toolbox.id}`).set(toolbox);
        return toolbox;
    },

    async updateToolbox(toolboxId, data) {
        await this.db.ref(`${this.getCompanyPath()}/toolboxes/${toolboxId}`).update(data);
        return data;
    },

    async deleteToolbox(toolboxId) {
        await this.db.ref(`${this.getCompanyPath()}/toolboxes/${toolboxId}`).remove();
        return true;
    },

    // ============================================
    // COMPLETIONS
    // ============================================
    async getCompletions() {
        const snapshot = await this.db.ref(`${this.getCompanyPath()}/completions`).once('value');
        const data = snapshot.val();
        return data ? Object.values(data) : [];
    },

    async saveCompletion(completion) {
        await this.db.ref(`${this.getCompanyPath()}/completions/${completion.id}`).set(completion);
        return completion;
    },

    async updateCompletion(completionId, data) {
        await this.db.ref(`${this.getCompanyPath()}/completions/${completionId}`).update(data);
        return data;
    },

    async deleteCompletion(completionId) {
        await this.db.ref(`${this.getCompanyPath()}/completions/${completionId}`).remove();
        return true;
    },

    // ============================================
    // INVITATIONS
    // ============================================
    async getInvitations() {
        const snapshot = await this.db.ref(`${this.getCompanyPath()}/invitations`).once('value');
        const data = snapshot.val();
        return data ? Object.values(data) : [];
    },

    async saveInvitation(invitation) {
        await this.db.ref(`${this.getCompanyPath()}/invitations/${invitation.id}`).set(invitation);
        return invitation;
    },

    async updateInvitation(invitationId, data) {
        await this.db.ref(`${this.getCompanyPath()}/invitations/${invitationId}`).update(data);
        return data;
    },

    async deleteInvitation(invitationId) {
        await this.db.ref(`${this.getCompanyPath()}/invitations/${invitationId}`).remove();
        return true;
    },

    // ============================================
    // EMAIL CONFIG
    // ============================================
    async getEmailConfig() {
        const snapshot = await this.db.ref(`${this.getCompanyPath()}/emailConfig`).once('value');
        return snapshot.val();
    },

    async saveEmailConfig(config) {
        await this.db.ref(`${this.getCompanyPath()}/emailConfig`).set(config);
        return config;
    },

    // ============================================
    // JOB TYPES
    // ============================================
    async getJobTypes() {
        const snapshot = await this.db.ref(`${this.getCompanyPath()}/jobTypes`).once('value');
        const data = snapshot.val();
        return data || [];
    },

    async saveJobTypes(jobTypes) {
        await this.db.ref(`${this.getCompanyPath()}/jobTypes`).set(jobTypes);
        return jobTypes;
    },

    // ============================================
    // REALTIME LISTENERS
    // ============================================
    onUsersChange(callback) {
        const ref = this.db.ref(`${this.getCompanyPath()}/users`);
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data ? Object.values(data) : []);
        });
        return () => ref.off('value');
    },

    onEmployeesChange(callback) {
        const ref = this.db.ref(`${this.getCompanyPath()}/employees`);
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data ? Object.values(data) : []);
        });
        return () => ref.off('value');
    },

    onToolboxesChange(callback) {
        const ref = this.db.ref(`${this.getCompanyPath()}/toolboxes`);
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data ? Object.values(data) : []);
        });
        return () => ref.off('value');
    },

    onCompletionsChange(callback) {
        const ref = this.db.ref(`${this.getCompanyPath()}/completions`);
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data ? Object.values(data) : []);
        });
        return () => ref.off('value');
    },

    onInvitationsChange(callback) {
        const ref = this.db.ref(`${this.getCompanyPath()}/invitations`);
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data ? Object.values(data) : []);
        });
        return () => ref.off('value');
    },

    onEmailConfigChange(callback) {
        const ref = this.db.ref(`${this.getCompanyPath()}/emailConfig`);
        ref.on('value', (snapshot) => {
            callback(snapshot.val());
        });
        return () => ref.off('value');
    },

    // ============================================
    // AUTHENTICATION
    // ============================================
    async login(username, password) {
        // Voor nu: simpele email/password auth
        // Later: meer secure met proper user management
        const email = `${username}@toolbox.local`;

        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            this.userId = userCredential.user.uid;

            // Haal user data op
            const users = await this.getUsers();
            const user = users.find(u => u.username === username);

            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async logout() {
        await this.auth.signOut();
        this.userId = null;
        return true;
    },

    async getCurrentUser() {
        const user = this.auth.currentUser;
        if (!user) return null;

        // Haal user data op
        const users = await this.getUsers();
        return users.find(u => u.id === this.userId);
    },

    onAuthChange(callback) {
        return this.auth.onAuthStateChanged(callback);
    }
};

// Set Firebase als implementatie
window.DB.implementation = FirebaseImplementation;

console.log('✅ Firebase Implementatie geladen');
