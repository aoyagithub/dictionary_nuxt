const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const instance = axios.create({
  baseURL: "https://od-api.oxforddictionaries.com",
  headers: {
    Accept: "application/json",
    app_id: process.env.APPID,
    app_key: process.env.APPKEY,
  },
});

app.post("/", (req, res) => {
  const lang = "en-us";
  const input = req.body.params.word;
  try {
    instance
      .get(`/api/v2/entries/${lang}/${input}`)
      .then((result) => {
        res.status(200).send(result.data);
      })
      .catch((err) => res.send(err));
  } catch (err) {
    console.error(err);
  }
});

export default app;
