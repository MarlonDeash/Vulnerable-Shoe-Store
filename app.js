const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Serve static files from 'public' directory under 'website' path
app.use('/website', express.static(path.join(__dirname, '/public')));

// Initialize database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Create products table and insert dummy data if not already present
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, description TEXT)', (err) => {
        if (err) console.error(err.message);
        console.log('Products table created or already exists.');
    });

    // Insert initial products data
    const insert = db.prepare("INSERT INTO products (name, description) VALUES (?, ?)");
    const products = [
        { name: "Running Shoes", description: "Perfect for jogging and running." },
        { name: "Hiking Boots", description: "Durable boots for rugged terrains." },
        { name: "Flip Flops", description: "Comfortable and stylish for the beach." },
        { name: "S3cr3t_K3y", description: "injections_are_fun" }
    ];
    products.forEach(product => {
        insert.run([product.name, product.description], err => {
            if (err) console.error(err.message);
        });
    });
    insert.finalize(() => {
        console.log('Initial products data inserted.');
    });
});

app.get('/search/:searchValue', (req, res) => {
    console.log("value: ", req.params.searchValue);

    const searchQuery = req.params.searchValue;
    let sql = `SELECT * FROM products WHERE name LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).send("An error occurred");
            console.error(err.message);
            return;
        }

        if (rows.length > 0) {


            var newList = [];

            console.log(rows.some(item => item.name === 'S3cr3t_K3y'));

            var index = rows.map(function (i) { return i.name; }).indexOf('S3cr3t_K3y');

            if(rows.some(item => item.name === 'S3cr3t_K3y')){
                res.send({rows: rows[index], injection: true});
            } else {
                res.send({rows, injection: false});
            }
        } else {
            res.send({message: "No products found."});
        }
    });
});

// 404 handler for any other requests
app.use((req, res) => {
  res.status(404).send('<h1>Error 404: Resource not found</h1>');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
