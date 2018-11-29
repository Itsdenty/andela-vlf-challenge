/* eslint-disable no-undef, no-unused-vars */
let currentModal = '',
  currentParcel = {},
  parcelList = [];

const errorMessage = document.getElementsByClassName('error'),
  parcelBtn = document.getElementById('submit-parcel'),
  parcelForm = document.getElementById('signupForm'),
  changeDestinationForm = document.getElementById('destination-form'),
  parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
  userParcels = 'https://andela-vlf.herokuapp.com/api/v1/users/',
  orderList = document.getElementById('orders'),
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
        } else {
          const parcelOrders = data.data;
          [currentParcel] = parcelOrders;
          parcelList = parcelOrders;
          initialize();
          calculateDistance();
          const orderHeader = `
                                <tr>
                                  <th>From</th>
                                  <th>To</th>
                                  <th>Weight</th>
                                  <th>Status</th>
                                  <th>Actions</th>
                                </tr>`;
          let orderDetails = '',
            index = 0;
          orderList.innerHTML += orderHeader;
          return parcelOrders.map((order) => {
            let orderFrom = order.fromlocation.split(',');
            orderFrom = `${orderFrom[1]}, ${orderFrom[2]}`;
            let orderTo = order.tolocation.split(',');
            orderTo = `${orderTo[1]}, ${orderTo[2]}`;
            if (index === 0) {
              orderDetails += `
              <tr class="highlight parcel-row" data-index="${index}">
                <td class="select-parcel" data-index="${index}"> ${orderFrom}</td>
                <td class="select-parcel" data-index="${index}"> ${orderTo}</td>
                <td class="select-parcel" data-index="${index}"> ${order.weight} ${order.weightmetric}</td>
                <td class="select-parcel" data-index="${index}"> ${order.status}</td>
                <td><select name="orderAction" class="my-actions">
                  <option value="">Select Action</option>
                  <option value="cancel${order.id}">Cancel</option>
                  <option value="destination${order.id}">Change Destination</option>
                </select></td>
              </tr>`;
            } else {
              orderDetails += `
              <tr class="parcel-row" data-index="${index}">
                <td class="select-parcel" data-index="${index}"> ${orderTo}</td>
                <td class="select-parcel" data-index="${index}"> ${orderFrom}</td>
                <td class="select-parcel" data-index="${index}"> ${order.weight} ${order.weightmetric}</td>
                <td class="select-parcel" data-index="${index}"> ${order.status}</td>
                <td><select name="orderAction" class="my-actions">
                  <option value="">Select Action</option>
                  <option value="cancel${order.id}">Cancel</option>
                  <option value="destination${order.id}">Change Destination</option>
                </select></td>
              </tr>`;
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
