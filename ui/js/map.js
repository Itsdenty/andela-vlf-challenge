/* eslint-disable no-undef, no-unused-vars */
let currentModal = '',
  autocomplete = {},
  toGeocode = '',
  fromGeocode = '',
  changeGeocode = '',
  autocomplete2 = {},
  autocomplete3 = {},
  currentParcel = {},
  parcelList = [],
  currentIndex = 0,
  selectedId = 0,
  directionsDisplay,
  map;

const errorMessage = document.getElementsByClassName('error'),
  parcelBtn = document.getElementById('submit-parcel'),
  parcelForm = document.getElementById('signupForm'),
  changeDestinationForm = document.getElementById('destination-form'),
  distDiv = document.getElementById('dist'),
  parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
  userParcels = 'https://andela-vlf.herokuapp.com/api/v1/users/',
  orderList = document.getElementById('orders'),
  directionsService = new google.maps.DirectionsService(),
  service = new google.maps.DistanceMatrixService(),
  dismissParcelBtn = document.getElementById('dismiss-cancel-order'),
  confirmParcelBtn = document.getElementById('confirm-cancel-order'),
  changeDestinationBtn = document.getElementById('submit-change-destination'),

  calculateDistance = () => {
    const index = currentParcel.tolocation.indexOf('lat');
    const toLocation = currentParcel.tolocation.substring(0, index);
    const index2 = currentParcel.fromlocation.indexOf('lat');
    const fromLocation = currentParcel.fromlocation.substring(0, index2);
    let orderFrom = currentParcel.fromlocation.split(',');
    orderFrom = `${orderFrom[1]}, ${orderFrom[2]}`;
    let orderTo = currentParcel.tolocation.split(',');
    orderTo = `${orderTo[1]}, ${orderTo[2]}`;
    const callback = (response, status) => {
      if (status === 'OK') {
        const [orig] = response.destinationAddresses,
          [dest] = response.originAddresses,
          dist = response.rows[0].elements[0].distance.text,
          duration = response.rows[0].elements[0].duration.text;
        distDiv.innerHTML = `
                              <table>
                              <tr>
                                <th>Data</th>
                                <th>Value</th>
                                <th>Data</th>
                                <th>Value</th>
                              </tr>
                              <tr>
                                <td><b>Order Location</b></td>
                                <td>${fromLocation}</td>
                                <td><b>Delivery Location</b></td>
                                <td>${toLocation}</td>
                              </tr>
                              <tr>
                              <td><b>Current Location</b></td>
                              <td>${currentParcel.currentStatus || 'not available'}</td>
                              <td><b>Delivery Price</b></td>
                              <td>${(parseInt(dist, 10) * 10) + 200} naira</td>
                              </tr>
                              <tr>
                              <td><b>Delivery Distance</b></td>
                              <td>${dist} naira</td>
                              <td><b>Estimated Duration</b></td>
                              <td>${duration}</td>
                              </tr>
                            </table>
                              `;
      } else {
        showToast('toast-red', `Error: ${status}`);
      }
    };

    service.getDistanceMatrix(
      {
        origins: [orderFrom],
        destinations: [orderTo],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
      },
      callback
    );
  },

  calcRoute = () => {
    let orderFrom = currentParcel.fromlocation.split(',');
    orderFrom = `${orderFrom[1]}, ${orderFrom[2]}`;
    let orderTo = currentParcel.tolocation.split(',');
    orderTo = `${orderTo[1]}, ${orderTo[2]}`;
    const request = {
      origin: orderFrom,
      destination: orderTo,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(map);
        // calculateDistance();
      } else {
        showToast('toast-red', `Directions Request from ${start.toUrlValue(6)} to  ${end.toUrlValue(6)} failed: ${status}`);
      }
    });
  },

  initialize = () => {
    directionsDisplay = new google.maps.DirectionsRenderer();
    const fromMarker = currentParcel.tolocation.split(','),
      fromLng = parseFloat(fromMarker[fromMarker.length - 1].substr(6)),
      fromLat = parseFloat(fromMarker[fromMarker.length - 2].substr(5)),
      center = new google.maps.LatLng(fromLat, fromLng),
      mapOptions = {
        zoom: 7,
        center
      };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsDisplay.setMap(map);
    calcRoute();
    loaderDiv.classList.add('hidden');
  },

  // function for page animation and modal script
  configureMaps = () => {
    const processSelection = (selected) => {
      if (selected.includes('cancel')) {
        currentModal = 'cancel-parcel';
        document.getElementById(currentModal).classList.remove('hidden');
        const cancelId = selected.split('').pop();
        selectedId = cancelId;
      } else if (selected.includes('destination')) {
        currentModal = 'change-destination';
        document.getElementById(currentModal).classList.remove('hidden');
        const destinationId = selected.split('').pop();
        selectedId = destinationId;
      } else if (selected.includes('status')) {
        currentModal = 'change-status';
        document.getElementById(currentModal).classList.remove('hidden');
        const statusId = selected.split('').pop();
        selectedId = statusId;
      } else if (selected.includes('location')) {
        currentModal = 'change-location';
        document.getElementById(currentModal).classList.remove('hidden');
        const locationId = selected.split('').pop();
        selectedId = locationId;
      }
    };

    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('select-parcel')) {
        const parcelIndex = e.target.getAttribute('data-index');
        currentParcel = parcelList[parcelIndex];
        document.getElementsByClassName('parcel-row')[currentIndex].classList.remove('highlight');
        document.getElementsByClassName('parcel-row')[parcelIndex].classList.add('highlight');
        currentIndex = parcelIndex;
        initialize();
        calculateDistance();
      }
      if (e.target && e.target.classList.contains('my-actions')) {
        const selected = e.target.value;
        processSelection(selected);
      }
    });
  },

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

  // cancelPArce method for cancelling order
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

  // create account method for signup
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
  },

  fillInFromLocation = () => {
    // Get the place details from the autocomplete object.
    const place = autocomplete.getPlace();
    fromGeocode = `lat:${place.geometry.location.lat()}, long:${place.geometry.location.lng()}`;
  },

  fillInToLocation = () => {
    // Get the place details from the autocomplete object.
    const place = autocomplete2.getPlace();
    toGeocode = `lat:${place.geometry.location.lat()}, long:${place.geometry.location.lng()}`;
  },

  fillInDestination = () => {
    // Get the place details from the autocomplete object.
    const place = autocomplete3.getPlace();
    changeGeocode = `lat:${place.geometry.location.lat()}, long:${place.geometry.location.lng()}`;
  },

  initAutocomplete = () => {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    const orderLocation = document.getElementById('fromLocation');
    if (orderLocation) {
      autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(orderLocation),
        { types: ['geocode'] }
      );

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete.addListener('place_changed', fillInFromLocation);
    }

    const destinationLocation = document.getElementById('toLocation');
    if (destinationLocation) {
      autocomplete2 = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(destinationLocation),
        { types: ['geocode'] }
      );

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete2.addListener('place_changed', fillInToLocation);
    }


    const destination = document.getElementById('changeDestination');
    if (destination) {
      autocomplete3 = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(destination),
        { types: ['geocode'] }
      );

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete3.addListener('place_changed', fillInDestination);
    }
  };
