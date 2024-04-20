// script.js

// Example function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
  
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Example AJAX request (you can modify this based on your server API)
    fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Redirect to the welcome page on successful login
          window.location.href = '/welcome';
        } else {
          // Handle login error (display an error message, redirect, etc.)
          console.error('Login failed.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  // Attach the form submission handler to the form element
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleSubmit);
  }
  