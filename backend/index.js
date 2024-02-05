const express = require("express");
const rootRouter = require("./routes/index.routes");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1", rootRouter);
app.listen(PORT, () => console.log("server started on port", PORT));
