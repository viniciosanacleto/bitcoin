import express from "express";
import router from "./routes";

export class API {
  run(port = 3000) {
    const app = express();

    app.use(express.json());
    app.use(router);

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
}
