const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion } = require("mongodb");
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.na3b9ip.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("toyHouse");
    const toysCollection = db.collection("category");

    const data = client.db("toyHouse");
    const tabsCollection = data.collection("Tabs");


    app.post("/postToy", async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      console.log(body);
      const result = await toysCollection.insertOne(body);
      console.log(result);
      res.send(result);
      // if (result?.insertedId) {
      //   return res.status(200).send(result);
      // } else {
      //   return res.status(404).send({
      //     message: "can not insert try again leter",
      //     status: false,
      //   });
      // }
    });

    app.get("/alltoys", async (req, res) => {
      const result = await toysCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    app.get("/mytoys/:email", async (req, res) => {
      //console.log(req.params.id);
      const result = await toysCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });


    app.get("/mytoys", async (req, res) => {
      const result = await toysCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    app.get("/tabtoys/:text", async (req, res) => {
      //console.log(req.params.text);
      if (req.params.text == "wooden" || req.params.text== "softtoy" || req.params.text == "plush") {
        const result = await tabsCollection
        .find({
          category: req.params.text})
        .toArray();
        //console.log(result);
      return res.send(result);
      }
      const result = await tabsCollection
        .find({})
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toy house is running");
});

app.listen(port, () => {
  console.log(`toy house Server is running on port ${port}`);
});
