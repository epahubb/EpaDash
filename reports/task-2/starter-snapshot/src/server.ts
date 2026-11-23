import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  // Do not print secrets or environment variables.
  console.log(`EpaDash API listening on port ${env.PORT}`);
});
