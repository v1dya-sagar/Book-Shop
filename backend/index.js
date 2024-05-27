import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// initiate db connection locally
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "test",
});

// ensure db connection
if(db){
  console.log("DB COnnected");
}


app.get("/", (req, res) => {
  res.json("hello");
});



// retrieve the book data from the mysql database
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books;";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(data);
    return res.json(data);
    
  });
});


// get the book data from front end and insert it into the table
app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?);";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

// for deleting use the book id from the front end and delete the entry in the db
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = " DELETE FROM books WHERE id = ? ;";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

// for updating an existing row in the db using the book id
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE `id` = ?;";
// new values form the req(frontend)
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values,bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});