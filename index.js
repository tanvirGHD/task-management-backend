const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y15rh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();



    const usersCollection = client.db("task-management").collection("users");


            // create user 
            app.post("/users", async (req, res) => {
               const user = req.body;
               const query = { uid: user.uid };
               const existingUser = await usersCollection.findOne(query);
               if (!existingUser) {
                   const result = await usersCollection.insertOne(user);
                   res.json({ message: "User Registered Successfully!", result });
               } else {
                   res.json({ message: "User Already Exists!" });
               }
           });
   
           // login user 
           app.get("/users/:uid", async (req, res) => {
               const uid = req.params.uid;
               const user = await usersCollection.findOne({ uid });
               res.json(user);
           });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);



app.get('/', async(req, res) => {
     res.send('running........')
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

