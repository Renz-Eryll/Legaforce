import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV } from "./env.js";

const aj = arcjet({
  key: ARCJET_KEY || "test-key",
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: NODE_ENV === "production" ? "LIVE" : "DRY_RUN" }),
    detectBot({
      mode: NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 10,
      capacity: 20,
    }),
  ],
});

export default aj;
