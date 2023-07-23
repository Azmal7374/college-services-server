const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wlub5y3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


    const usersCollection = client.db("collegeServices").collection("users");
    const informationCollection = client.db("collegeServices").collection("information");

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection


    app.get("/users", async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      });


    app.post("/users", async (req, res) => {
        const user = req.body;
        console.log(user);
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        console.log("Existing user", existingUser);
        if (existingUser) {
          return res.send({ message: "User already exists" });
        }
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });


      app.post("/information", async (req, res) => {
        const newItem = req.body;


        const email = newItem.studentEmail;
        const name = newItem.collegeName;
        const query = {
          $and: [{ collegeName: { $eq: name } }, { studentEmail: { $eq: email } }],
        };
  
        const existingClass = await informationCollection.findOne(query);
  
        if (existingClass) {
          return res.send({ message: "Admission  already Done" });
        }

        const result = await informationCollection.insertOne(newItem);
        res.send(result);
      });





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
