import axios from "axios";
import * as fs from "fs";
import * as XLSX from "xlsx";
import { readdir } from "node:fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

XLSX.set_fs(fs);

const EXPENSEJSON = {
  Date: new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }),
  Food: 0,
  Commute: 0,
  Household: 0,
  Loan: 0,
  description: "description",
};

const validateWebhook = async (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  await addNewSheet();

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.APP_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  } else {
    res.sendStatus(400);
  }
};

const webhookTrigger = async (req, res) => {
  // getting the data out of body
  const body_param = req.body;
  const { entry } = body_param;
  const { value } = entry[0]?.changes[0];
  const { metadata, messaging_product, messages } = value;

  // if value is there and the user has sent a message then reply the pre determined message
  if (value && messages) {
    const phoneNumberID = metadata?.phone_number_id;
    const from = messages[0]?.from;
    const textBody = messages[0]?.text?.body;

    const messageAr = textBody.split(' ');
    const command = messageAr?.[0].toLowerCase();
    if(command === "add"){
               
    }

    let body = {
      messaging_product: messaging_product,
      to: from,
      type: "text",
      text: {
        body: "Hi,this is daily check in expenses",
      },

      /*type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" },
      },*/
    };

    const headers = {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      "Content-Type": "application/json",
    };

    try {
      /*const replyResponse = await axios.post(
        `${process.env.META_BASE_URL}/${process.env.API_VERSION}/${phoneNumberID}/messages`,
        body,
        { headers },
      );
      console.log(replyResponse, "reply response");
      */
    } catch (error) {
      console.log(error, "Error");
    }

    res.status(200).send("reply sent");
  } else {
    res.status(404).send("No response");
  }
};

const addNewSheet = async () => {
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      {
        Date: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        Food: 100,
        Commute: 200,
        Household: 0,
        Loan: 0,
        description: "description",
      },
    ]);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Define the directory and file paths
    const dir = join(__dirname, "../sheets");
    const filePath = join(dir, "11Aug2024.xlsx");

    XLSX.utils.book_append_sheet(workbook, worksheet, "11-August-2024");
    XLSX.writeFile(workbook, filePath, { bookType: "xlsx" });
  } catch (err) {
    console.log(err, "ERROR");
  }
};

export { validateWebhook, webhookTrigger };
