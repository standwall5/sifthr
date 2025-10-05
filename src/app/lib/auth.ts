import { betterAuth } from "better-auth";
import { Db, MongoClient, MongoInvalidArgumentError } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined.");
}

const client = new MongoClient(MONGODB_URI);
const db = client.db("sifthr-database");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: "",
      clientSecret: "",
    },
    google: {
      clientId: "",
      clientSecret: "",
    },
  },
  user: {
    additionalFields: {
      age: {
        type: "number",
        required: true,
      },
      isAdmin: {
        type: "boolean",
        defaultValue: false, // Most users are not admin
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  plugins: [nextCookies()],
});
