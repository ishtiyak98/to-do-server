const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId  } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.c0cq6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("My_Todo_App").collection("taskList");

    app.post("/my-task", async(req, res)=>{
        const newTask = req.body;
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
    })

    app.delete("/my-task/delete/:id", async(req, res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
    })

    app.get("/my-task/:email", async(req, res)=>{
        const email = req.params.email;
        const query = { email: email };
        const output = await taskCollection.find(query).toArray();
        res.send(output);
    })
  } 
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("To-Do Server");
});

app.listen(port, () => {
  console.log("listening from port: ", port);
});
