const mongo_connection=require('./db');
const express = require('express')

mongo_connection().catch(err => console.log(err));;

const app = express()
const port = 5000

var cors = require('cors')

 
app.use(cors())
//middleware for (req.body).
app.use(express.json());

// Available Routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));


app.listen(port, () => {
  console.log(`iNotebook app listening at http://localhost:${port}`)
})