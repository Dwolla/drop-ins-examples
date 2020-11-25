const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dwolla = require("dwolla");
const qs = require("query-string");

const ENVIRONMENT = {
  sandbox: "https://api-sandbox.dwolla.com",
  production: "https://api.dwolla.com",
};
const port = 4041;
const env = "sandbox";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "hbs");

app.get("/", function (req, res) {
  res.status(200).render(`landing`, {});
});

app.get("/create-customer", function (req, res) {
  generateAccessToken().then((aRes) => {
    generateClientToken(aRes.access_token, "customer.create").then((cRes) => {
      res.status(200).render(`create-customer`, { token: cRes.token });
    });
  });
});

app.get("/upload-document", function (req, res) {
  generateAccessToken().then((aRes) => {
    generateClientToken(
      aRes.access_token,
      "customer.documents.create",
      "db8b240b-f1a9-4f28-b378-113bcaa50cb2"
    ).then((cRes) => {
      const customer = {
        id: "db8b240b-f1a9-4f28-b378-113bcaa50cb2",
        firstName: "",
        lastName: "",
        email: "",
      };
      res.status(200).render(`document`, { customer, token: cRes.token });
    });
  });
});

app.get("/update-customer", function (req, res) {
  generateAccessToken().then((aRes) => {
    generateClientToken(aRes.access_token, "customer.update", "").then(
      (cRes) => {
        const customer = {
          id: "",
          firstName: "",
          lastName: "",
          email: "",
        };
        res
          .status(200)
          .render(`update-customer`, { customer, token: cRes.token });
      }
    );
  });
});

app.get("/personal-vcr-flow", function (req, res) {
  generateAccessToken().then((aRes) => {
    generateClientToken(
      aRes.access_token,
      "customer.update",
      "customerId"
    ).then((cRes) => {
      const customer = {
        id: "customerId",
        firstName: "",
        lastName: "",
        email: "",
      };
      res.status(200).render(`personal-vcr`, { customer, token: cRes.token });
    });
  });
});

app.get("/balance-display", function (req, res) {
  generateAccessToken().then((aRes) => {
    generateClientToken(
      aRes.access_token,
      "customer.fundingsources.read",
      "db8b240b-f1a9-4f28-b378-113bcaa50cb2"
    ).then((cRes) => {
      const customer = {
        id: "db8b240b-f1a9-4f28-b378-113bcaa50cb2",
        firstName: "",
        lastName: "",
        email: "",
      };
      res.status(200).render(`balance`, { customer, token: cRes.token });
    });
  });
});

app.get("/payin-flow", function (req, res) {
  const body = {
    action: "customer.transfers.send",
    _links: {
      customer: {
        href:
          "http://localhost:17188/customers/db8b240b-f1a9-4f28-b378-113bcaa50cb2",
        type: "application/vnd.dwolla.v1.hal+json",
        "resource-type": "customer",
      },
      destination: {
        href:
          "http://localhost:17188/funding-sources/35ee455d-eb79-4b42-b523-00a6e721143a",
        type: "application/vnd.dwolla.v1.hal+json",
        "resource-type": "funding-source",
      },
    },
    amount: {
      currency: "USD",
      value: "16.91",
    },
  };
  generateAccessToken().then((aRes) => {
    generateClientTokenWithBody(aRes.access_token, body).then((cRes) => {
      res.status(200).render(`payin`, { blob: cRes.blob, token: cRes.token });
    });
  });
});

app.get("/iav", function (req, res) {
  res.status(200).render("iav");
});

app.get("/dwolla-web.js", function (req, res) {
  var component = path.join(
    __dirname,
    "../../../packages/dwolla-web/dist/browser/dwolla-web.js"
  );
  res.sendFile(component);
});

app.get("/styles/:sheet", function (req, res) {
  res.sendFile(path.join(__dirname, `/static/styles/${req.params.sheet}`));
});

app.post("/tokenUrl", function (req, res) {
  generateAccessToken().then((aRes) => {
    generateClientTokenWithBody(aRes.access_token, req.body).then((cRes) => {
      res.send({ token: cRes.token });
    });
  });
});

function generateClientToken(token, action, customerId) {
  const url = `${ENVIRONMENT[env]}/client-tokens`;
  const body = {
    action: action,
  };

  if (customerId) {
    body._links = {
      customer: {
        href: `${ENVIRONMENT[env]}/customers/${customerId}`,
      },
    };
  }

  return dwolla
    .post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.dwolla.v1.hal+json",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

function generateClientTokenWithBody(token, body) {
  const url = `${ENVIRONMENT[env]}/client-tokens`;

  return dwolla
    .post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.dwolla.v1.hal+json",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

function generateAccessToken() {
  const url = `${ENVIRONMENT[env]}/token`;
  const clientId = "";
  const clientSecret = "";
  const authHeader =
    "Basic " +
    new Buffer(clientId + ":" + clientSecret, "UTF-8").toString("base64");

  return dwolla
    .post(url, qs.stringify({ grant_type: "client_credentials" }), {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return "err";
    });
}

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
