'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'UserEvents'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const validEvents = [
    {
      name: "Event 1",
      body: "Description of Event 1",
      lat: 37.7749,
      lng: -122.4194,
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      userId: 1
    },
    {
      name: "Event 2",
      body: "Description of Event 2",
      lat: 34.0522,
      lng: -118.2437,
      address: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      userId: 2
    },
    {
      name: "Event 3",
      body: "Description of Event 3",
      lat: 40.7128,
      lng: -74.0060,
      address: "789 Oak St",
      city: "New York",
      state: "NY",
      userId: 3
    },
    {
      name: "Event 4",
      body: "Description of Event 4",
      lat: 41.8781,
      lng: -87.6298,
      address: "101 Pine St",
      city: "Chicago",
      state: "IL",
      userId: 4
    },
    {
      name: "Event 5",
      body: "Description of Event 5",
      lat: 29.7604,
      lng: -95.3698,
      address: "202 Maple St",
      city: "Houston",
      state: "TX",
      userId: 5
    },
    {
      name: "Event 6",
      body: "Description of Event 6",
      lat: 39.9526,
      lng: -75.1652,
      address: "303 Cedar St",
      city: "Philadelphia",
      state: "PA",
      userId: 6
    },
    {
      name: "Event 7",
      body: "Description of Event 7",
      lat: 33.4484,
      lng: -112.0740,
      address: "404 Walnut St",
      city: "Phoenix",
      state: "AZ",
      userId: 7
    },
    {
      name: "Event 8",
      body: "Description of Event 8",
      lat: 32.7157,
      lng: -117.1611,
      address: "505 Birch St",
      city: "San Diego",
      state: "CA",
      userId: 8
    },
    {
      name: "Event 9",
      body: "Description of Event 9",
      lat: 47.6062,
      lng: -122.3321,
      address: "606 Willow St",
      city: "Seattle",
      state: "WA",
      userId: 9
    },
    {
      name: "Event 10",
      body: "Description of Event 10",
      lat: 25.7617,
      lng: -80.1918,
      address: "707 Oak St",
      city: "Miami",
      state: "FL",
      userId: 10
    }
  ]

  await queryInterface.bulkInsert(options, validEvents, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, {});
  }
};
