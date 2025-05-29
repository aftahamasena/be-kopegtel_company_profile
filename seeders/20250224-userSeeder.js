"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        username: "admin",
        email: "admin@example.com",
        password:
          "$2a$12$GL8f1xwe2FUqyiL6e6Fpi.aDzlHKI/DVUHRGnh/edL5L7fXMCpZl6",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "editor1",
        email: "editor1@example.com",
        password:
          "$2a$12$I11gYABeTbZAPGKy5jZ7IOWlM4HA1hxzv51HmDsGJGQY9aRH2UQoW",
        role: "editor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "editor2",
        email: "editor2@example.com",
        password:
          "$2a$12$I11gYABeTbZAPGKy5jZ7IOWlM4HA1hxzv51HmDsGJGQY9aRH2UQoW",
        role: "editor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "editor3",
        email: "editor3@example.com",
        password:
          "$2a$12$I11gYABeTbZAPGKy5jZ7IOWlM4HA1hxzv51HmDsGJGQY9aRH2UQoW",
        role: "editor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
