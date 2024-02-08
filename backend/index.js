const express = require("express");
const rootRouter = require("./routes/index.routes");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1", rootRouter);
app.use("/", (req, res) => {
    res.send("Express app hosted on vercel. Code at https://github.com/yashUcr773/e_wallet_app/tree/master/backend")
});
app.listen(PORT, () => console.log("server started on port", PORT));
