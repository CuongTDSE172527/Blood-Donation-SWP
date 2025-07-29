// Check users in database
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

async function checkUsers() {
    try {
        console.log('Checking all users in database...\n');
        
        // Get all users
        const response = await axios.get(`${API_BASE}/donor/users`);
        const users = response.data;
        
        console.log('All users in database:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ID: ${user.id}, Name: "${user.fullName}", Email: "${user.email}", Role: ${user.role}`);
        });
        
        // Check for test users
        const testUsers = users.filter(user => 
            user.fullName?.includes('Test') || 
            user.fullName?.includes('Updated') ||
            user.email?.includes('example.com')
        );
        
        if (testUsers.length > 0) {
            console.log('\n⚠️  Found test users:');
            testUsers.forEach(user => {
                console.log(`- ID: ${user.id}, Name: "${user.fullName}", Email: "${user.email}"`);
            });
        } else {
            console.log('\n✅ No test users found');
        }
        
        // Check for donor users
        const donorUsers = users.filter(user => user.role === 'DONOR');
        console.log(`\n📊 Total donor users: ${donorUsers.length}`);
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

checkUsers(); 