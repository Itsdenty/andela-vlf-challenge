/* eslint-disable no-undef, no-unused-vars */
let status = 0,
  currentModal = '',
  loaderStatus = 0;

const errorMessage = document.getElementsByClassName('error'),
  signupBtn = document.getElementById('submit-signup'),
  signupForm = document.getElementById('signupForm'),
  toast = document.getElementById('toast'),
  route = 'https://andela-vlf.herokuapp.com/api/v1/auth/signup',

  animateText = () => {
    switch (status) {
      case '0':
        document.getElementById('text-anim').innerText = 'We deliver packages promptly';
        status = 1;
        break;
      case '1':
        document.getElementById('text-anim').innerText = 'You can check parcel status at any time';
        status = 2;
        break;
      case '2':
        document.getElementById('text-anim').innerText = 'Our service is cheap and reliable';
        status = 3;
        break;
      case '3':
        document.getElementById('text-anim').innerText = 'A package delivery solution you can trust';
        status = 0;
        break;
      default:
        document.getElementById('text-anim').innerText = 'A package delivery solution you can trust';
        status = 0;
    }
  },

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

  showToast = (toastClass, data) => {
    toast.classList.remove('hidden');
    toast.classList.add(toastClass);
    toast.innerHTML = `<p>${data.substr(0, 50)}</p>`;
    const flashError = setTimeout(() => {
      toast.classList.add('hidden');
    }, 5000);
  },

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

  dismissModal = () => {
    if (currentModal) {
      document.getElementById(currentModal).classList.add('hidden');
      currentModal = null;
    }
  },

  startAnimation = () => {
    const startAnim = setInterval(animateText, 3000);
    const classname = document.getElementsByClassName('trigger');
    Array.from(classname).forEach((element) => {
      element.addEventListener('click', toggleModal);
    });
    const dismissname = document.getElementsByClassName('dismiss');
    Array.from(dismissname).forEach((element) => {
      element.addEventListener('click', dismissModal);
    });
  },

  checkPassword = () => {
    if (signupForm.confirmPassword.value
      && (signupForm.password.value !== signupForm.confirmPassword.value)) {
      errorMessage[0].classList.add('display-error');
      errorMessage[0].innerHTML = 'password does not match';
      signupBtn.disabled = true;
    }

    if (signupForm.confirmPassword.value === signupForm.password.value) {
      errorMessage[0].innerHTML = '';
      errorMessage[0].remove('display-error');
      signupBtn.disabled = false;
    }
  },

  createAccount = (evt) => {
    evt.preventDefault();
    const headers = new Headers({
      'content-type': 'application/json',
    });
    const userDetails = {
      firstName: signupForm.firstName.value,
      lastName: signupForm.lastName.value,
      otherNames: signupForm.otherNames.value,
      username: signupForm.username.value,
      isAdmin: signupForm.isAdmin.value,
      email: signupForm.email.value,
      password: signupForm.password.value,
    };
    const startLoader = setInterval(loader, 500, 'submit-signup');
    fetch(route, {
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
  };

window.onload = () => {
  startAnimation();
  const classname = document.getElementsByClassName('trigger');
  Array.from(classname).forEach((element) => {
    element.addEventListener('click', toggleModal);
  });
  const dismissname = document.getElementsByClassName('dismiss');
  Array.from(dismissname).forEach((element) => {
    element.addEventListener('click', dismissModal);
  });
};

signupForm.confirmPassword.addEventListener('input', checkPassword);
signupForm.password.addEventListener('input', checkPassword);
signupForm.addEventListener('submit', createAccount);
