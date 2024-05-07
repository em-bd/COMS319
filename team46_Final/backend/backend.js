/**
 * Authors: Em Bradley-DeHaan,
 *          Samuel Craft
 * ISU Netids: emmieb@iastate.edu
 *          craftsam@iastate.edu
 * Date: April 27th, 2024
 */

const { MongoClient } = require("mongodb");

var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "secomsfinal";
const client = new MongoClient(url);
const db = client.db(dbName);

var id = 0;

/**
 * GET request:
 * Read all users contained within
 * the FarmersRUs database.
 */
app.get("/users", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");

    const query = {};

    const results = await db
        .collection("users")
        .find(query)
        .limit(100)
        .toArray();

    id = results.length + 1;

    console.log(results);
    res.status(200);
    res.send(results);
});

/**
 * POST request:
 * Used for registering a new user
 * into the database.
 */
app.post("/users", async (req, res) => {
    try {
        await client.connect();
        const values = Object.values(req.body);
        console.log("Node connected successfully to POST MongoDB");

        const newDocument = {
            "id": (id++),
            "username": values[0],
            "password": values[1],
            "priv": values[2]
        }

        console.log(newDocument);

        // POST new user:
        const results = await db
            .collection("users")
            .insertOne(newDocument);
        res.status(200);
        res.send(results);

    } catch (error) {
        console.error();
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

app.get("/products", async (rec, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");

    const query = {};

    const results = await db
        .collection("products")
        .find(query)
        .limit(100)
        .toArray();

    id = results.length + 1;

    console.log(results);
    res.status(200);
    res.send(results);
})

/**
 * GET id request:
 * Reads product with that specific id
 */
app.get("/:collection/:id", async (req, res) => {
    const productID = Number(req.params.id);
    const collection = String(req.params.collection);
    console.log("Product to find :", productID);

    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = { "id": productID };
    const results = await db
        .collection(collection)
        .findOne(query);

    console.log("Results :", results);
    if (!results)
        res.send("Not found").status(404);
    else
        res.send(results).status(200);
});