import { materialRequestStorage } from "../storage/material-request-storage";
import { Router } from "express";

export function registerMaterialRequestRoutes(app: Router) {
  app.get("/api/material-requests", async (req, res) => {
    const requests = await materialRequestStorage.getAll();
    res.json(requests);
  });

  app.post("/api/material-requests", async (req, res) => {
    const request = await materialRequestStorage.create(req.body);
    res.json(request);
  });

  app.put("/api/material-requests/:id", async (req, res) => {
    const updated = await materialRequestStorage.update(req.params.id, req.body);
    res.json(updated);
  });

  app.delete("/api/material-requests/:id", async (req, res) => {
    await materialRequestStorage.delete(req.params.id);
    res.json({ success: true });
  });
}
