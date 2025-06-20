import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Aladin IA Assistant API is running" });
  });

  // Since we're using external APIs for authentication and data,
  // we don't need to implement the auth endpoints here.
  // The frontend will communicate directly with the external endpoints.

  const httpServer = createServer(app);

  return httpServer;
}
