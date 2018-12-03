# Andela VLF Challenge

Andela VLF Sendit is an app that allows users to send parcels to anywhere in Nigeria

[![Build Status](https://travis-ci.org/Itsdenty/andela-vlf-challenge.svg?branch=master)](https://travis-ci.org/Itsdenty/andela-vlf-challenge) [![Coverage Status](https://coveralls.io/repos/github/Itsdenty/andela-vlf-challenge/badge.svg?branch=master)](https://coveralls.io/github/Itsdenty/andela-vlf-challenge?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/48ad51dc49c1a2d3a026/maintainability)](https://codeclimate.com/github/Itsdenty/andela-vlf-challenge/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/48ad51dc49c1a2d3a026/test_coverage)](https://codeclimate.com/github/Itsdenty/andela-vlf-challenge/test_coverage)


The App is hosted on github pages [ here ](https://itsdenty.github.io/andela-vlf-challenge/index.html).

The endpoints are hosted on heroku [ here ](https://andela-vlf.herokuapp.com/api-docs/).

## Made With
  ### UI
    * HTML for writing the webpage
    * CSS for styling
    * Javascript to add some behaviour
  
  ### Server
    * Nodejs for server-side logic
    * Babel for transpiling
    * Express for api routes implementation
    * Heroku for hosting services
    * PostgreSql for the App database
    * Swagger for documentation

## Structure of the backend
    *The server folder holds the backend code
    *The config folder holds the postgress connection configuration
    *The controller file holds the code for handling requests processing it through the     processor queries and returning a transformed result via the transformer file
    *The database folder holds the database seeder and migration files
    *The middlewares folder holds the middleware files/functions for input validation,      authentication check and authorization checks
    *The processor folder holds the files/functions for database queries and return the     result to the controller
    *The public folder holds the ui for the apidocs
    *The routes folder holds the files for the routes
    *The swagger folder holds the files for the swagger documentation
    *The tests folder holds the files for integrated tests
    *The utils folder holds helper functions often reused accross the app such as the       response transformer function.

  ### Continuous Integration
    * Travis CI & Codeclimate for test automation
    * Coveralls for test coverage report
  
  ### Test-Driven Development
    * Mocha, Chai and Supertest for api route testing

## Installation.
  * Install [Nodejs](https://nodejs.org/en/download/)
  * Clone this repo ``` git clone https://github.com/itsdenty/andela-vlf-challenge.git ```
  * Run ```npm install``` to install the required dependencies
  * Run ```npm test:dev``` to fireup the tests
  * Navigate to http://localhost:3100/api/v1/

## Features of the template
* Users can Signup and log in on the app.
* User Can create order for parcel deliveries.
* User can cancel parcel delivery Order.
* User can change the destination of parcel delivery
* Admin can change the status of the parcel
* Admin can change the current destination of the parcel
* Admin can check the list and details of all rides
* User can check the list and details of all rides
* Ride details include map location pointers and distance and costing

## Available APIs
<table>
  <tr>
      <th>HTTP REQUEST VERB</th>
      <th>API ENDPOINT/PATH</th>
      <th>ACTION</th>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/</td>
      <td>Welcomes users to the application</td>
  </tr>
  <tr>
      <td>POST</td>
      <td>/api/v1/auth/signup</td>
      <td>Registers a new user on the app</td>
  </tr>
  <tr>
      <td>POST</td>
      <td>/api/v1/auth/login</td>
      <td>Logs in a registered user</td>
  </tr>
  <tr>
      <td>POST</td>
      <td>/api/v1/parcels</td>
      <td>Allows users to create parcel orders</td>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/parcels</td>
      <td>Gets all parcel orders</td>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/users/:id/parcels</td>
      <td>Gets all user's parcel orders</td>
  </tr>
  <tr>
      <td>PATCH</td>
      <td>/api/v1/parcels/:id/cancel</td>
      <td>Cancels a parcel oreder</td>
  </tr>
  <tr>
      <td>PATCH</td>
      <td>/api/v1/parcels/:id/destination</td>
      <td>Change the destination of an order</td>
  </tr>
  <tr>
      <td>PATCH</td>
      <td>/api/v1/parcels/:id/status</td>
      <td>Change the status of a parcel</td>
  </tr>
  <tr>
      <td>PATCH</td>
      <td>/api/v1/parcels/:id/currentlocation</td>
      <td>Change the current location of a parcel</td>
  </tr>
</table>


For more details on how to use this API, check the **Documentation** out [ here ]().

## License and Copyright
&copy; Abd-afeez Abd-hamid

Licensed under the [MIT License](LICENSE).
