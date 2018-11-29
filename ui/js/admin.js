/* eslint-disable no-undef, no-unused-vars */
let currentModal = '',
  currentParcel = {},
  parcelList = [];

const errorMessage = document.getElementsByClassName('error'),
  changeStatusBtn = document.getElementById('submit-status'),
  parcelForm = document.getElementById('signupForm'),
  changeStatusForm = document.getElementById('status-form'),
  changeLocationForm = document.getElementById('location-form'),
  distDiv = document.getElementById('dist'),
  toast = document.getElementById('toast'),
  loaderDiv = document.getElementById('loader'),
  parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
  orderList = document.getElementById('orders'),
  directionsService = new google.maps.DirectionsService(),
  service = new google.maps.DistanceMatrixService(),
  changeLocationBtn = document.getElementById('submit-change-location'),

  // check user state and redirect to admin page if an admin
  checkState = () => {
    const user = JSON.parse(localStorage.getItem('user')),
      token = `Bearer ${localStorage.getItem('token')}`;
    if (!token || !user) {
      showToast('toast-red', 'Please login/signup to access this page');
    } else if (!user.isadmin) {
      window.location.href = 'parcel.html';
    }
  },

  // retrieve all user orders
  getAllOrders = () => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    if (!token) {
      showToast('toast-red', 'Please login to access this page', 'index.html');
    }
    loaderDiv.classList.remove('hidden');
    fetch(parcelRoute, {
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
                  <option value="status${order.id}">Change Status</option>
                  <option value="location${order.id}">Change Current Location</option>
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
  // change parcel order status method
  changeStatus = (evt) => {
    evt.preventDefault();
    const token = `Bearer ${localStorage.getItem('token')}`,
      statusRoute = `${parcelRoute}/${selectedId}/status`,
      headers = new Headers({
        'content-type': 'application/json',
        authorization: token
      }),
      status = `${changeStatusForm.status.value}`,
      startLoader = setInterval(loader, 500, 'submit-status');
    fetch(statusRoute, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
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
          changeStatusBtn.innerText = 'Submit';
        } else {
          clearInterval(startLoader);
          showToast('toast-green', 'successfully cancelled');
          changeStatusBtn.innerText = 'Submit';
          dismissModal();
          currentModal = '';
        }
      })
      .catch(error => showToast('toast-red', error.message));
  },

  // change parcel current location method
  changeLocation = (evt) => {
    evt.preventDefault();
    const token = `Bearer ${localStorage.getItem('token')}`,
      currentRoute = `${parcelRoute}/${selectedId}/currentLocation`,
      currentLocation = `${changeLocationForm.changeLocation.value}`,
      headers = new Headers({
        'content-type': 'application/json',
        authorization: token
      }),

      startLoader = setInterval(loader, 500, 'submit-change-location');
    fetch(currentRoute, {
      method: 'PATCH',
      body: JSON.stringify({ currentLocation }),
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
          changeLocationBtn.innerText = 'Submit';
        } else {
          clearInterval(startLoader);
          showToast('toast-green', 'successfully changed location');
          changeLocationBtn.innerText = 'Submit';
          dismissModal();
          currentModal = '';
        }
      })
      .catch(error => showToast('toast-red', error.message));
  };

// onload methods for automatically firing relevant methods
window.onload = () => {
  configureModals();
  configureMaps();
  initAutocomplete();
  getAllOrders();
};

// add event listeners
changeStatusForm.addEventListener('submit', changeStatus);
changeLocationForm.addEventListener('submit', changeLocation);
