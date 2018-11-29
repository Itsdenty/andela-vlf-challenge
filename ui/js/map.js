/* eslint-disable no-undef, no-unused-vars */
let currentModal = '',
  autocomplete = {},
  toGeocode = '',
  fromGeocode = '',
  changeGeocode = '',
  autocomplete2 = {},
  autocomplete3 = {},
  autocomplete4 = {},
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
                                <td id="destination-id">${toLocation}</td>
                              </tr>
                              <tr>
                              <td><b>Current Location</b></td>
                              <td id="location-id">${currentParcel.currentlocation || 'not available'}</td>
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
    const index = currentParcel.tolocation.indexOf('lat');
    const toLocation = currentParcel.tolocation.substring(0, index);
    const index2 = currentParcel.fromlocation.indexOf('lat');
    const fromLocation = currentParcel.fromlocation.substring(0, index2);
    // let orderFrom = currentParcel.fromlocation.split(',');
    // orderFrom = `${orderFrom[1]}, ${orderFrom[2]}`;
    // let orderTo = currentParcel.tolocation.split(',');
    // orderTo = `${orderTo[1]}, ${orderTo[2]}`;
    const request = {
      origin: fromLocation,
      destination: toLocation,
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

  fillInCurrentLocation = () => {
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

    const currentLocation = document.getElementById('changeLocation');
    if (currentLocation) {
      autocomplete4 = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(currentLocation),
        { types: ['geocode'] }
      );

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete4.addListener('place_changed', fillInCurrentLocation);
    }
  };
