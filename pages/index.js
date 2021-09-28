const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Client = require("dwolla-v2").Client;

const dwolla = new Client({
  key: "",
  secret: "",
  environment: "sandbox", // defaults to 'production'
});

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
    generateClientToken("customer.create").then((cRes) => {
      res.status(200).render(`create-customer`, { token: cRes.token });
    });
});

app.get("/upgrade-customer", function (req, res) {
  generateClientToken("customer.update", "0c8bafa5-45ab-4282-8916-cae984ceb147").then(
    (cRes) => {
      const customer = {
        // This body is hard coded, and will need to be replaced in your implementation
        id: "0c8bafa5-45ab-4282-8916-cae984ceb147",
        firstName: "Jane",
        lastName: "Doe",
        email: "email14@email.com",
      };
      res
        .status(200)
        .render(`upgrade-customer`, { customer, token: cRes.token });
    }
  );
});

app.get("/upload-document", function (req, res) {

  dwolla.post("customers", {
    // This body is hard coded, and will need to be replaced in production
    type: "personal",
    firstName: "document",
    lastName: "hodgins",
    email: `${Math.random()}email12@email.com`,
    address1: "726 Evergreen Terrace",
    city: "Springfield",
    state: "OR",
    postalCode: "32817",
    dateOfBirth: "1990-03-22",
    ssn: "1111"
  })
  
  .then(function(customerRes){
    const customerId = customerRes.headers.get("location").split("/").slice(-1)[0]
    generateClientToken(
      "customer.documents.create",
      customerId
    ).then((cRes) => {
      const customer = {
        id: customerId,
      };
      res.status(200).render(`document`, { customer, token: cRes.token });
    });     
  })
});

// This example lets you selectt an existing customer to upload a document
app.get("/upload-document-for-existing-customer", function (req, res) {
  generateClientToken(
    "customer.documents.create",
    "26981bca-7a80-4d04-9d21-4c5f44eaef6e"
  ).then((cRes) => {
     // This body is hard coded, and will need to be replaced in your implementation
    const customer = {
      id:  "26981bca-7a80-4d04-9d21-4c5f44eaef6e"
    };
    res.status(200).render(`document`, { customer, token: cRes.token });
  });
});

app.get("/personal-vcr-flow", function (req, res) {
    generateClientToken(
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

app.get("/business-vcr-flow", function (req, res) {
  res.status(200).render(`business-vcr`, {});
});

app.get("/beneficial-owners", function (req, res) {
  //TODO: Add option to submit customerId from input on client-side
  dwolla.post("customers", {
    // This body is hard coded, and will need to be replaced in production
    firstName: 'Account',
    lastName: 'Admin',
    email: `${Math.random()}email@email.com`,
    type: 'business',
    address1: '99-99 33rd St',
    city: 'Some City',
    state: 'NY',
    postalCode: '11101',
    controller: {
        firstName: 'Jane',
        lastName: 'Controller',
        title: 'CEO',
        dateOfBirth: '1980-01-31',
        ssn: '1234',
        address: {
          address1: '1234 Main st',
          address2: 'Apt 12',
          city: 'Des Moines',
          stateProvinceRegion: 'IA',
          postalCode: '50309',
          country: 'US',
        }
    },
    businessClassification: '9ed38155-7d6f-11e3-83c3-5404a6144203',
    businessType: 'llc',
    businessName: 'Jane Doe Corp',
    ein: '12-3456789'
  })
  .then(function(customerRes){
    const customerId = customerRes.headers.get("location").split("/").slice(-1)[0]
    res.status(200).render(`beneficial-owners`, { customerId });
  });
});

app.get("/balance-display", function (req, res) {
    generateClientToken(
      "customer.fundingsources.read",
      "640e5978-c099-45e2-b3c6-3eef9dd773f7"
    ).then((cRes) => {
      const customer = {
        id: "640e5978-c099-45e2-b3c6-3eef9dd773f7",
        firstName: "mya",
        lastName: "mya",
        email: "mya@mya.com",
      };
      res.status(200).render(`balance`, { customer, token: cRes.token });
    });
});

app.get("/payin-flow", function (req, res) {

  //TODO: Replace with sample API call chain
  const body = {
    action: "customer.transfers.send",
    _links: {
      customer: {
        href:
          "http://api-sandbox.dwolla.com/customers/4594a375-ca4c-4220-a36a-fa7ce556449d",
        type: "application/vnd.dwolla.v1.hal+json",
        "resource-type": "customer",
      },
      destination: {
        href:
          "http://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4",
        type: "application/vnd.dwolla.v1.hal+json",
        "resource-type": "funding-source",
      },
    },
    amount: {
      currency: "USD",
      value: "1.01",
    },
  };
  generateClientTokenWithBody(body).then((cRes) => {
    res.status(200).render(`payin`, { blob: cRes.blob, token: cRes.token });
  });
});

app.get("/iav", function (req, res) {
  res.status(200).render("iav");
});

app.get("/add-bank", function (req, res) {
  res.status(200).render("add-bank");
});

app.get("/styles/:sheet", function (req, res) {
  res.sendFile(path.join(__dirname, `/static/styles/${req.params.sheet}`));
});

app.post("/tokenUrl", function (req, res) {
    generateClientTokenWithBody(req.body).then((cRes) => {
      res.send({ token: cRes.token });
    });
});

function generateClientToken(action, customerId) {
  const url = `/client-tokens`;
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
    .post(url, body)
    .then((response) => {
      return response.body;
    })
    .catch((error) => {
      return error;
    });
}

function generateClientTokenWithBody(body) {
  const url = `/client-tokens`;

  return dwolla
    .post(url, body)
    .then((response) => {
      return response.body;
    })
    .catch((error) => {
      return error;
    });
}


app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
