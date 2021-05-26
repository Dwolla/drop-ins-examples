
dwolla
  .post("customers", {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@doe.com",
  })
  .then((res) => console.log(res.headers.get("location")));
