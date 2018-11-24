/* eslint-disable no-undef, no-unused-vars */
let currentModal = '',
  loaderStatus = 0;

const errorMessage = document.getElementsByClassName('error'),
  parcelBtn = document.getElementById('submit-signup'),
  createParcelBtn = document.getElementById('submit-login'),
  parcelForm = document.getElementById('signupForm'),
  toast = document.getElementById('toast'),
  createRoute = 'https://andela-vlf.herokuapp.com/api/v1/auth/login',

  // algorithm for loader animation
  loader = (id) => {
    switch (loaderStatus) {
      case 0:
        document.getElementById(id).innerText = 'loading.';
        loaderStatus = 1;
        break;
      case 1:
        document.getElementById(id).innerText = 'loading..';
        loaderStatus = 2;
        break;
      case 2:
        document.getElementById(id).innerText = 'loading...';
        loaderStatus = 3;
        break;
      case 3:
        document.getElementById(id).innerText = 'loading....';
        loaderStatus = 0;
        break;
      default:
        document.getElementById(id).innerText = 'loading.....';
        loaderStatus = 0;
    }
  },

  //  function for displaying toaster
  showToast = (toastClass, data) => {
    toast.classList.remove('hidden');
    toast.classList.add(toastClass);
    toast.innerHTML = `<p>${data.substr(0, 50)}</p>`;
    const flashError = setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove(toastClass);
    }, 5000);
  },

  // function for toggling login and signup modal
  toggleModal = (e) => {
    const elem = e.target.getAttribute('data-modal');
    if (currentModal && currentModal !== elem) {
      document.getElementById(currentModal).classList.add('hidden');
      document.getElementById(elem).classList.remove('hidden');
    } else {
      document.getElementById(elem).classList.toggle('hidden');
    }
    currentModal = elem;
  },

  // function for dismissing modal
  dismissModal = () => {
    if (currentModal) {
      document.getElementById(currentModal).classList.add('hidden');
      currentModal = null;
    }
  },

  // function for page animation and modal script
  startAnimation = () => {
    const classname = document.getElementsByClassName('trigger');
    Array.from(classname).forEach((element) => {
      element.addEventListener('click', toggleModal);
    });
    const dismissname = document.getElementsByClassName('dismiss');
    Array.from(dismissname).forEach((element) => {
      element.addEventListener('click', dismissModal);
    });
  },

  // create account method for signup
  createAccount = (evt) => {
    evt.preventDefault();
    const headers = new Headers({
        'content-type': 'application/json',
      }),

      userDetails = {
        firstName: signupForm.firstName.value,
        lastName: signupForm.lastName.value,
        otherNames: signupForm.otherNames.value,
        username: signupForm.username.value,
        isAdmin: signupForm.isAdmin.value,
        email: signupForm.email.value,
        password: signupForm.password.value,
      },

      startLoader = setInterval(loader, 500, 'submit-signup');

    fetch(signupRoute, {
      method: 'POST',
      body: JSON.stringify({ user: userDetails }),
      headers,
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) {
          clearInterval(startLoader);
          showToast('toast-red', data.error);
          signupBtn.innerText = 'Signup';
          return;
        }
        showToast('toast-green', 'registration successful');
        signupBtn.innerText = 'Signup';
        dismissModal();
        currentModal = '';
        // window.location.href = '/profile.html';
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      })
      .catch(error => alert(error.message));
  },

  // create account method for signup
  loginUser = (evt) => {
    evt.preventDefault();
    const headers = new Headers({
        'content-type': 'application/json',
      }),

      loginDetails = {
        email: loginForm.email.value,
        password: loginForm.password.value,
      },

      startLoader = setInterval(loader, 500, 'submit-login');
    console.log(loginDetails);
    fetch(loginRoute, {
      method: 'POST',
      body: JSON.stringify({ login: loginDetails }),
      headers,
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) {
          clearInterval(startLoader);
          showToast('toast-red', data.error);
          loginBtn.innerText = 'Login';
          return;
        }
        showToast('toast-green', 'login successful');
        loginBtn.innerText = 'Login';
        dismissModal();
        currentModal = '';
        // window.location.href = '/profile.html';
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      })
      .catch(error => alert(error.message));
  };

// onload methods for ui animation and signup and login modal events
window.onload = () => {
  startAnimation();
};

// add event listeners
createParcelForm.addEventListener('submit', createParcel);
