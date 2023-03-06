const app = require("./app");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const port = process.env.PORT || 5000;

connectDb();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
