const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    version: "1.0.0",
    title: "Autoshack API",
    description: "API for the Autoshack project",
  },
  servers: [
    {
      url: "http://localhost:" + (process.env.PORT || 1783),
      description: "", // by default: ''
    },
  ],
  tags: [
    {
      name: "Camera",
      description: "Routes related to the camera operation for Autoshack",
    },
    {
      name: "Shack Log",
      description: "Routes related to the shack log for Autoshack",
    },
    {
      name: "Schedule",
      description: "Routes related to scheduling for Autoshack",
    },
    // { ... }
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["./index.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
