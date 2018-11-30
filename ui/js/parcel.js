/* eslint-disable no-undef, no-unused-vars, no-plusplus */
let currentModal = '';

const errorMessage = document.getElementsByClassName('error'),
  parcelBtn = document.getElementById('submit-parcel'),
  parcelForm = document.getElementById('signupForm'),
  changeDestinationForm = document.getElementById('destination-form'),
  parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
  userParcels = 'https://andela-vlf.herokuapp.com/api/v1/users/',
  dismissParcelBtn = document.getElementById('dismiss-cancel-order'),
  confirmParcelBtn = document.getElementById('confirm-cancel-order'),
  changeDestinationBtn = document.getElementById('submit-change-destination'),

  // check user state and redirect to admin page if an admin
  checkState = () => {
    const user = JSON.parse(localStorage.getItem('user')),
      token = `Bearer ${localStorage.getItem('token')}`;
    if (!token || !user) {
      showToast('toast-red', 'Please login/signup to access this page');
    } else if (user.isadmin) {
      window.location.href = 'admin.html';
    }
  },

  // create account method for signup
  createParcel = (evt) => {
    evt.preventDefault();
    const user = JSON.parse(localStorage.getItem('user')),
      token = `Bearer ${localStorage.getItem('token')}`,
      headers = new Headers({
        'content-type': 'application/json',
        authorization: token
      }),

      parcelDetails = {
        fromLocation: `${createParcelForm.fromLocation.value}, ${fromGeocode}`,
        toLocation: `${createParcelForm.toLocation.value}, ${toGeocode}`,
        weight: createParcelForm.weight.value,
        weightmetric: createParcelForm.weightmetric.value,
        placedBy: user.id,
      },
      startLoader = setInterval(loader, 500, 'submit-parcel');
    fetch(parcelRoute, {
      method: 'POST',
      body: JSON.stringify({ parcel: parcelDetails }),
      headers,
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) {
          clearInterval(startLoader);
          showToast('toast-red', data.error);
          parcelBtn.innerText = 'Create Parcel';
          return;
        }
        clearInterval(startLoader);
        showToast('toast-green', data.data.message);
        parcelBtn.innerText = 'Create Parcel';
        dismissModal();
        const order = parcelDetails,
          index = parcelList.length - 1;
        order.id = data.data.id;
        order.fromlocation = order.fromLocation;
        order.tolocation = order.toLocation;
        order.status = 'placed';
        const index1 = order.tolocation.indexOf('lat'),
          orderTo = order.tolocation.substring(0, index1),
          index2 = order.fromlocation.indexOf('lat'),
          orderFrom = order.fromlocation.substring(0, index2),
          orderDetails = fillOtherRow(order, index, orderFrom, orderTo);
        orderList.innerHTML += orderDetails;
        parcelList.push(orderDetails);
        currentModal = '';
        // window.location.href = '/profile.html';
      })
      .catch(error => showToast('toast-red', error.message));
  },

  // fetch orders only made by logged in user
  getUserOrders = () => {
    const token = `Bearer ${localStorage.getItem('token')}`,
      user = JSON.parse(localStorage.getItem('user')),
      userRoute = `${userParcels}${user.id}/parcels`;
    if (!token) {
      showToast('toast-red', 'Please login to access this page', 'index.html');
    }
    loaderDiv.classList.remove('hidden');
    fetch(userRoute, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      },
    })
      .then(res => res.json())
      .then((data, res) => {
        if (data.status === 401) {
          showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
        } else if (data.data.length < 1) {
          showToast('toast-red', 'No Order available at the moment');
          loaderDiv.classList.add('hidden');
        } else {
          const parcelOrders = data.data;
          [currentParcel] = parcelOrders;
          totalList = parcelOrders;
          console.log(totalList, 'list');
          initialize();
          calculateDistance();
          selectedPage = 1;
          const orderHeader = fillHeader(),
            paginate = pagination();
          let orderDetails = '',
            index = 0;
          orderList.innerHTML += orderHeader;
          return parcelList.map((order) => {
            const index1 = order.tolocation.indexOf('lat'),
              orderTo = order.tolocation.substring(0, index1),
              index2 = order.fromlocation.indexOf('lat'),
              orderFrom = order.fromlocation.substring(0, index2);
            console.log(paginate);

            if (index === 0) {
              orderDetails = fillFirstRow(order, index, orderFrom, orderTo);
            } else {
              orderDetails = fillOtherRow(order, index, orderFrom, orderTo);
            }
            
            orderList.innerHTML += orderDetails;
            orderDetails = '';
            index += 1;
            return '';
          });
        }
      });
  },

  // cancelParcel method for cancelling order
  cancelParcel = (evt) => {
    evt.preventDefault();
    const token = `Bearer ${localStorage.getItem('token')}`,
      cancelRoute = `${parcelRoute}/${selectedId}/cancel`,
      headers = new Headers({
        'content-type': 'application/json',
        authorization: token
      }),
      startLoader = setInterval(loader, 500, 'confirm-cancel-order');
    fetch(cancelRoute, {
      method: 'PATCH',
      headers,
    })
      .then(res => res.json())
      .then((data, res) => {
        if (data.status === 401) {
          clearInterval(startLoader);
          showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
        } else if (data.status === 500) {
          clearInterval(startLoader);
          showToast('toast-red', data.error);
        } else {
          clearInterval(startLoader);
          showToast('toast-green', 'successfully cancelled');
          confirmParcelBtn.innerText = 'Cancel';
          dismissModal();
          document.getElementById(`status${selectedId}`).innerHTML = 'cancelled';
          currentModal = '';
        }
      })
      .catch(error => showToast('toast-red', error.message));
  },

  // change parcel destination method
  changeDestination = (evt) => {
    evt.preventDefault();
    const token = `Bearer ${localStorage.getItem('token')}`,
      cancelRoute = `${parcelRoute}/${selectedId}/destination`,
      destination = `${changeDestinationForm.changeDestination.value}, ${changeGeocode}`,
      headers = new Headers({
        'content-type': 'application/json',
        authorization: token
      }),

      startLoader = setInterval(loader, 500, 'submit-change-destination');
    fetch(cancelRoute, {
      method: 'PATCH',
      body: JSON.stringify({ toLocation: destination }),
      headers,
    })
      .then(res => res.json())
      .then((data, res) => {
        if (data.status === 401) {
          clearInterval(startLoader);
          showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
        } else if (data.status === 500) {
          clearInterval(startLoader);
          showToast('toast-red', data.error);
        } else {
          clearInterval(startLoader);
          showToast('toast-green', 'successfully cancelled');
          confirmParcelBtn.innerText = 'Submit';
          dismissModal();
          let newTo = destination.split(',');
          newTo = `${newTo[1]}, ${newTo[2]}`;

          document.getElementById(`destination${selectedId}`).innerHTML = newTo;
          document.getElementById('destination-id').innerHTML = newTo;
          currentModal = '';
        }
      })
      .catch(error => showToast('toast-red', error.message));
  };

// onload methods for ui animation and signup and login modal events
window.onload = () => {
  checkState();
  configureModals();
  configureMaps();
  initAutocomplete();
  getUserOrders();
};

// add event listeners
createParcelForm.addEventListener('submit', createParcel);
changeDestinationForm.addEventListener('submit', changeDestination);
confirmParcelBtn.addEventListener('click', cancelParcel);
dismissParcelBtn.addEventListener('click', dismissModal);
