"use strict";

module.exports = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/metadata",
      handler: "dataController.meta",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
    {
      method: "GET",
      path: "/download",
      handler: "dataController.download",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
    {
      method: "POST",
      path: "/generate",
      handler: "dataController.generate",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
    {
      method: "POST",
      path: "/delete",
      handler: "dataController.delete",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
    {
      method: "POST",
      path: "/upload",
      handler: "dataController.upload",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
  ],
};
