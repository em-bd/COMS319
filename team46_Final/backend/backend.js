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

var lastuid = 0;
var totproductid = 0;

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

    lastuid = results[results.length - 1].id + 1;

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
            "id": (lastuid++),
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

/**
 * GET request:
 * Gets all products in the database for
 * FarmersRUs.
 */
app.get("/products", async (rec, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");

    const query = {};

    const results = await db
        .collection("products")
        .find(query)
        .limit(100)
        .toArray();

    totproductid = results.length + 1;

    console.log(results);
    res.status(200);
    res.send(results);
})

/**
 * GET request:
 * Gets product of the specified ID
 * from the FarmersRUs database.
 */
app.get("/products/:id", async (req, res) => {
    const pid = Number(req.params.id);
    console.log("Product to find :", pid);

    await client.connect();
    console.log("Node connected successfulyl to GET-id MongoDB");
    const query = { "id": pid };

    const results = await db
        .collection("products")
        .findOne(query);

    console.log("Results :", results);
    if (!results)
        res.send("Not found").status(404);
    else
        res.send(results).status(200);
})

/**
 * PUT request:
 * Updates a product of the specified
 * ID to the FarmersRUs database.
 */
app.put("/products/:id", async (req, res) => {
    try {
        const pid = Number(req.params.id);
        console.log("Product to update: ", pid);
        console.log(req.body);

        await client.connect();
        console.log("Node connected successfulyl to GET-id MongoDB");

        const updateData = {
            $set: {
                "id": req.body.id,
                "src": req.body.src,
                "name": req.body.name,
                "alt": req.body.alt,
                "keywords": req.body.keywords,
                "rating": req.body.rating,
                "comments": req.body.comments,
                "price": req.body.price,
                "desc": req.body.desc,
                "specs": req.body.specs,
            }
        };

        const query = { "id": pid };
        const options = {};
        const results = await db
            .collection("products")
            .updateOne(query, updateData, options);

        // bad result:
        if (results.matchedCount === 0)
            return res.status(404).send({ message: 'Product not found' });

        // good result, send result back:
        res.send(results).status(200);
    } catch (error) {
        console.error("Error updating product price :", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

/**
 * DELETE request:
 * Deletes specified user from the
 * FarmersRUs database.
 */
app.delete("/users/:id", async (req, res) => {
    try {
        const uid = Number(req.params.id);

        await client.connect();
        console.log("User ID to delete :", uid);

        const query = { id : uid };

        // delete user:
        const results = await db
            .collection("users")
            .deleteOne(query);
        
        if (results.matchedCount === 0)
            res.status(404).send({ message: 'User not found' });

        res.status(200).send(results);
    } catch (error) {
        console.error("Error deleting product :", error);
        res.status(500).send({ message : 'Internal Server Error' });
    }
})