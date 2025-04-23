const app = require("./API/app");
const connectDb = require("./API/utils/dbConfig");

app.get("/test", (req, res) => {
  res.json("test passed");
});

const Host = "0.0.0.0";

const startServer = async () => {
  try {
    await connectDb();
    app.listen(process.env.PORT, Host, (err) => {
      if (err) {
        console.error("Error while connecting to the server", err);
        return;
      } else {
        console.log(
          `Server connected to the PORT ${process.env.PORT} on ${process.env.NODE_ENV}`
        );
      }
    });
  } catch (err) {
    console.error("❌ Error starting server:", err.message);
    process.exit(1);
  }
};

startServer();
