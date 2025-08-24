// Test script for register number validation (REVERSED LOGIC)
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testValidation() {
  console.log('🧪 Testing Register Number Validation System (REVERSED LOGIC)...\n');
  console.log('📋 Logic: Only students in acceptedidcards or rejectedidcards can apply\n');

  const testCases = [
    {
      registerNumber: 'ELIGIBLE001',
      name: 'Eligible Student 1',
      description: 'Student in acceptedidcards (should succeed)',
      expectedResult: 'SUCCESS'
    },
    {
      registerNumber: 'ELIGIBLE002',
      name: 'Eligible Student 2',
      description: 'Student in rejectedidcards (should succeed)',
      expectedResult: 'SUCCESS'
    },
    {
      registerNumber: 'NOT_ELIGIBLE001',
      name: 'Not Eligible Student 1',
      description: 'Student not in any collection (should fail)',
      expectedResult: 'FAIL'
    },
    {
      registerNumber: 'PENDING001',
      name: 'Pending Student 1',
      description: 'Student with pending request (should fail)',
      expectedResult: 'FAIL'
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📝 Test ${i + 1}: ${testCase.description}`);
    console.log(`Register Number: ${testCase.registerNumber}`);
    console.log(`Expected Result: ${testCase.expectedResult}`);

    try {
      // First check eligibility
      const eligibilityResponse = await fetch(`${BASE_URL}/api/check-eligibility/${testCase.registerNumber}`);
      const eligibilityResult = await eligibilityResponse.json();
      
      console.log(`Eligibility Check: ${eligibilityResult.eligible ? '✅ Eligible' : '❌ Not Eligible'}`);
      console.log(`Message: ${eligibilityResult.message}`);

      // Then try to submit
      const formData = new FormData();
      formData.append('registerNumber', testCase.registerNumber);
      formData.append('name', testCase.name);
      formData.append('department', 'Computer Science Engineering');
      formData.append('year', '3');
      formData.append('section', 'A');
      formData.append('reason', 'Test reason');
      formData.append('dob', '2000-01-01');
      formData.append('libraryCode', 'LIB001');

      const submitResponse = await fetch(`${BASE_URL}/api/idcards`, {
        method: 'POST',
        body: formData
      });

      const submitResult = await submitResponse.json();
      
      if (submitResponse.ok) {
        console.log('✅ Submission: Success');
      } else {
        console.log(`❌ Submission: Failed - ${submitResult.message}`);
      }

      // Verify result matches expectation
      const actualResult = submitResponse.ok ? 'SUCCESS' : 'FAIL';
      if (actualResult === testCase.expectedResult) {
        console.log('✅ Test Result: PASSED');
      } else {
        console.log('❌ Test Result: FAILED (unexpected result)');
      }

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n🎯 Validation test completed!');
  console.log('\n📋 Summary:');
  console.log('- Only students in acceptedidcards or rejectedidcards can apply');
  console.log('- Students not in any collection cannot apply');
  console.log('- Students with pending requests cannot apply');
}

// Check if server is running before testing
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Server is running');
      await testValidation();
    } else {
      console.log('❌ Server is not responding properly');
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('cd server && npm start');
  }
}

checkServer(); 