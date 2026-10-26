
import "dotenv/config";
import * as snowflake from "snowflake-sdk";

const required = [
  "SNOWFLAKE_ACCOUNT",
  "SNOWFLAKE_USERNAME",
  "SNOWFLAKE_PASSWORD",
  "SNOWFLAKE_AUTHENTICATOR",
  "SNOWFLAKE_WAREHOUSE",
  "SNOWFLAKE_DATABASE",
  "SNOWFLAKE_SCHEMA",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT!,
  username: process.env.SNOWFLAKE_USERNAME!,
  password: process.env.SNOWFLAKE_PASSWORD!,
  authenticator: process.env.SNOWFLAKE_AUTHENTICATOR!,
  role: process.env.SNOWFLAKE_ROLE,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
});

connection.connect((error) => {
  if (error) {
    console.error("Snowflake connection failed:", error.message);
    return;
  }

  console.log("Connected to Snowflake successfully!");

  connection.execute({
    sqlText: "USE SCHEMA NEON_ANALYTICS.RAW",
    complete: (schemaError) => {
      if (schemaError) {
        console.error(
          "Schema selection failed:",
          schemaError.message
        );

        connection.destroy(() => {});
        return;
      }

      console.log("Schema NEON_ANALYTICS.RAW selected successfully!");

      connection.execute({
        sqlText: `
          SELECT
            CURRENT_USER() AS CURRENT_USER,
            CURRENT_ACCOUNT() AS CURRENT_ACCOUNT,
            CURRENT_WAREHOUSE() AS CURRENT_WAREHOUSE,
            CURRENT_DATABASE() AS CURRENT_DATABASE,
            CURRENT_SCHEMA() AS CURRENT_SCHEMA
        `,
        complete: (queryError, statement, rows) => {
          if (queryError) {
            console.error("Query failed:", queryError.message);
          } else {
            console.log("Connection details:", rows);
          }

          connection.destroy((closeError) => {
            if (closeError) {
              console.error(
                "Connection close failed:",
                closeError.message
              );
              return;
            }

            console.log("Connection closed.");
          });
        },
      });
    },
  });
});
