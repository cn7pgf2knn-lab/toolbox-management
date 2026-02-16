/**
 * FIREBASE CONFIGURATIE
 *
 * Firebase project: toolbox-management
 * Database URL: https://toolbox-management-default-rtdb.europe-west1.firebasedatabase.app
 */

// ============================================
// Firebase Config - INGEVULD EN KLAAR! ✅
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyAPBQDW0tb7LVJlJfY4-emWIx8s_Nl6Auo",
    authDomain: "toolbox-management.firebaseapp.com",
    databaseURL: "https://toolbox-management-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "toolbox-management",
    storageBucket: "toolbox-management.firebasestorage.app",
    messagingSenderId: "295012791715",
    appId: "1:295012791715:web:32c2deb70368bf2c099616"
};

// ============================================
// Initialiseer Firebase
// ============================================
(async function() {
    try {
        console.log('🔥 Initialiseren Firebase...');

        // Initialize database layer with Firebase
        await window.DB.init(firebaseConfig);

        console.log('✅ Firebase succesvol geïnitialiseerd!');
        console.log('✅ Database layer ready');

        // Test connection
        try {
            const users = await window.DB.getUsers();
            console.log(`✅ Database verbinding OK - ${users.length} users gevonden`);
        } catch (error) {
            console.warn('⚠️ Kon niet verbinden met database:', error.message);
        }

    } catch (error) {
        console.error('❌ Firebase initialisatie mislukt:', error);
        alert('FOUT: Firebase kon niet worden geïnitialiseerd. Check de Console (F12) voor details.');
    }
})();

// ============================================
// MIGRATIE HELPER (Optioneel)
// ============================================
// Als je data van localStorage naar Firebase wilt kopiëren,
// voer deze functie uit in de Console (F12):
//
// window.migrateToFirebase()
//
window.migrateToFirebase = async function() {
    if (!confirm('Weet je zeker dat je alle localStorage data naar Firebase wilt migreren?')) {
        return;
    }

    console.log('🔄 Starten migratie van localStorage naar Firebase...');

    try {
        // Haal data uit localStorage
        const users = JSON.parse(localStorage.getItem('users_complete') || '{"data":[]}').data || [];
        const employees = JSON.parse(localStorage.getItem('employees_complete') || '{"data":[]}').data || [];
        const toolboxes = JSON.parse(localStorage.getItem('toolboxes_complete') || '{"data":[]}').data || [];
        const completions = JSON.parse(localStorage.getItem('completions_complete') || '{"data":[]}').data || [];
        const invitations = JSON.parse(localStorage.getItem('invitations_complete') || '{"data":[]}').data || [];
        const emailConfig = JSON.parse(localStorage.getItem('emailjs_config') || '{"data":null}').data;
        const jobTypes = JSON.parse(localStorage.getItem('job_types') || '{"data":[]}').data || [];

        console.log(`📦 Gevonden: ${users.length} users, ${employees.length} employees, ${toolboxes.length} toolboxes`);

        // Upload naar Firebase
        for (const user of users) {
            await window.DB.saveUser(user);
        }
        console.log('✅ Users gemigreerd');

        for (const employee of employees) {
            await window.DB.saveEmployee(employee);
        }
        console.log('✅ Employees gemigreerd');

        for (const toolbox of toolboxes) {
            await window.DB.saveToolbox(toolbox);
        }
        console.log('✅ Toolboxes gemigreerd');

        for (const completion of completions) {
            await window.DB.saveCompletion(completion);
        }
        console.log('✅ Completions gemigreerd');

        for (const invitation of invitations) {
            await window.DB.saveInvitation(invitation);
        }
        console.log('✅ Invitations gemigreerd');

        if (emailConfig) {
            await window.DB.saveEmailConfig(emailConfig);
            console.log('✅ Email config gemigreerd');
        }

        if (jobTypes && jobTypes.length > 0) {
            await window.DB.saveJobTypes(jobTypes);
            console.log('✅ Job types gemigreerd');
        }

        console.log('✅ Migratie voltooid!');
        alert('Migratie succesvol! Je data staat nu in Firebase.');

    } catch (error) {
        console.error('❌ Migratie mislukt:', error);
        alert('FOUT: Migratie mislukt. Check de Console (F12) voor details.');
    }
};
