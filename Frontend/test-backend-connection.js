// Simple test script to verify backend connection
const API_BASE_URL = 'http://localhost:5000';

async function testBackendConnection() {
  console.log('Testing backend connection...');
  
  try {
    // Test basic connectivity
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ Backend is accessible');
      const data = await response.json();
      console.log('Response:', data);
    } else {
      console.log('❌ Backend responded with error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    console.log('Make sure the backend server is running on port 5000');
  }
}

// Run the test
testBackendConnection(); 