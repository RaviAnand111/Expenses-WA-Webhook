import express from "express";
import { webhookRouter } from "./routes/webhookRouter.js";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";

// configuring dotenv
dotenv.config();

const app = express();

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

app.listen(port, () => {
  console.log("listening on port");
});

app.use("/", webhookRouter);
/*
app.get("/", (req, res) => {
  console.log("home endpoint");
  res.status(200).send("GET working");
});

app.get("/webhook", (req, res) => {
  console.log(req);
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.APP_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", async (req, res) => {
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
      type: "text",
      text: {
        body: "Hi,this is daily check in expenses",
      },

    };

    const headers = {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      "Content-Type": "application/json",
    };

    try {
      const replyResponse = await axios.post(
        `${process.env.META_BASE_URL}/${process.env.API_VERSION}/${phoneNumberID}/messages`,
        body,
        { headers },
      );
      console.log(replyResponse, "reply response");
    } catch (error) {
      console.log(error, "Error");
    }

    res.status(200).send("reply sent");
  } else {
    res.status(404).send("No response");
  }

});
*/

/*type: "template",
template: {
  name: "hello_world",
  language: { code: "en_US" },
},*/
