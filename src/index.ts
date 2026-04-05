import "dotenv/config";
import { app } from "./app.js";

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables.");
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
