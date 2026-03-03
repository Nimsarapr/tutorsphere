import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple In-Memory Storage
const users: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth APIs
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const id = Math.random().toString(36).substr(2, 9);
    const newUser = { id, name, email, password, role: role || 'student' };
    users.push(newUser);
    
    res.json({ id, name, email, role: newUser.role });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
