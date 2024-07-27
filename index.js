const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

// configuring dotenv
dotenv.config();

const app = express();

const port = 3000;

app.listen(port, () => {
  console.log("listening on port");
});

app.get("/", (req, res) => {
  console.log("home endpoing");
  res.status(200).send("GET working");
});

app.get("/webhook", (req, res) => {
  const mode = req.query("hub.mode");
  const challenge = req.query("hub.challenge");
  const token = req.query("hub.verify_token");

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.APP_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  console.log("webhook");
  const body_param = req.body;

  console.log(JSON.stringify(body_param), "body");

  const { entry } = body_param;
  const { value } = entry[0]?.changes[0];
  const { metadata, messaging_product, messages } = value;

  if (value && messages) {
    const phoneNumberID = metadata?.phone_number_id;
    const from = messages[0]?.from;
    const textBody = messages[0]?.text?.body;

    let body = {
      messaging_product: messaging_product,
      to: from,
      type: "template",
      text: {
        body: "Hi,this is daily check in expenses",
      },
      /*template: {
        name: "hello world",
        language: { code: "en_US" },
      },
      */
    };

    const headers = {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      "Content-Type": "application/json",
    };

    axios.post(
      `${process.env.META_BASE_URL}/${API_VERSION}/${phoneNumberID}/messages`,
      body,
      { headers },
    );

    res.status(200).send("reply sent");
  } else {
    res.status(404).send("No response");
  }
});
