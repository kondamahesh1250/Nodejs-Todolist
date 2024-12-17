require('dotenv').config();
var express = require("express");
var app = express();
var cors = require("cors");
var conn = require("./sql.js");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Endpoint to insert data into the todolist
app.post("/insertdata", (req, res) => {
    let { id, tdescription } = req.body;

    let query = "INSERT INTO todolist (id, tdescription) VALUES (?, ?)";
    conn.query(query, [id, tdescription], (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send({ success: true, message: "Successfully inserted" });
        }
    });
});

// Endpoint to load data from the todolist
app.get("/loaddata", (req, res) => {

    let query = "SELECT * FROM todolist";

    conn.query(query, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send(data);
        }
    });
});

// Endpoint to edit data in the todolist
app.post("/editdata", (req, res) => {

    let { id, tdescription } = req.body;

    let query = "UPDATE todolist SET tdescription = ? WHERE id = ?";

    conn.query(query, [tdescription, id], (err, data) => {
        if (err) {
            res.send({ success: false, message: 'Failed to update the task' });
        } else {
            res.send({ success: true, message: 'Updated successfully' });
        }
    });
});

// Endpoint to get the next available ID
app.get('/nextid', (req, res) => {

    let query = 'SELECT MAX(id) AS maxId FROM todolist';

    conn.query(query, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            const maxId = data[0]?.maxId;
            const nextId = maxId ? maxId + 1 : 1; // Start from 1 if no data exists
            res.send({ nextId });
        }
    });
});

// Endpoint to delete data from the todolist
app.delete("/deletedata/:id", (req, res) => {

    let id = req.params.id;

    let query = "DELETE FROM todolist WHERE id = ?";
    conn.query(query, [id], (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send({ success: true, message: "Successfully deleted" });
        }
    });
});

// Set the server to listen on port 3003
var port = process.env.PORT;
app.listen(port, () => {
    console.log("Server started successfully");
});
