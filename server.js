
/* =========================================
   QAVELYNT SERVER
   Central Backend Infrastructure
   Version 1.0.0
========================================= */

"use strict";

const http = require("node:http");

const CONFIG = {
  name: "QAVELYNT",
  version: "1.0.0",
  port: Number(process.env.PORT) || 3000,
  maxBodySize: 20000,
  maxQuestionLength: 5000,
  maxExperts: 8
};

// 45 SPECIALISTS

const EXPERTS = [
  "Technology",
  "Programming",
  "Artificial Intelligence",
  "Cybersecurity",
  "Engineering",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Medicine",
  "Health",
  "Psychology",
  "Education",
  "Mathematics",
  "Astronomy",
  "Space Science",
  "Business",
  "Economics",
  "Finance",
  "Marketing",
  "Entrepreneurship",
  "Law",
  "Politics",
  "History",
  "Geography",
  "Philosophy",
  "Literature",
  "Writing",
  "Art",
  "Graphic Design",
  "Architecture",
  "Music",
  "Film",
  "Photography",
  "Sports",
  "Nutrition",
  "Environment",
  "Agriculture",
  "Robotics",
  "Electronics",
  "Communication",
  "Languages",
  "Research",
  "Innovation",
  "Project Management"
].map((name, index) => ({
  id: index + 1,
  name,
  active: true
}));

// RESPONSE HELPERS

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });

  res.end(JSON.stringify(data));
}

// READ REQUEST BODY

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;

    req.on("data", chunk => {
      size += chunk.length;

      if (size > CONFIG.maxBodySize) {
        reject(new Error("Request too large"));
        req.destroy();
        return;
      }

      body += chunk.toString("utf8");
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

// VALIDATE SPECIALISTS

function selectExperts(ids = []) {
  if (!Array.isArray(ids)) return [];

  const unique = [...new Set(ids.map(Number))];

  return unique
    .slice(0, CONFIG.maxExperts)
    .map(id => EXPERTS.find(e => e.id === id))
    .filter(Boolean);
}

// AI PROVIDER CONNECTION
// Configure a real provider here later.
// Never expose API keys to the browser.

async function generateAIResponse(request) {
  const apiKey = process.env.AI_API_KEY;
  const providerUrl = process.env.AI_API_URL;
  const model = process.env.AI_MODEL;

  if (!apiKey || !providerUrl || !model) {
    return {
      configured: false,
      answer: null
    };
  }

  // Provider-specific request format
  // must be configured before activation.

  return {
    configured: true,
    answer: null,
    message: "AI provider adapter is not implemented yet."
  };
}

// API ROUTES

async function handleRequest(req, res) {
  const url = new URL(
    req.url,
    `http://${req.headers.host || "localhost"}`
  );

  if (req.method === "GET" && url.pathname === "/api/health") {
    return send(res, 200, {
      platform: CONFIG.name,
      version: CONFIG.version,
      status: "online",
      experts: EXPERTS.length,
      aiConfigured: Boolean(
        process.env.AI_API_KEY &&
        process.env.AI_API_URL &&
        process.env.AI_MODEL
      )
    });
  }

  if (req.method === "GET" && url.pathname === "/api/experts") {
    return send(res, 200, {
      total: EXPERTS.length,
      experts: EXPERTS
    });
  }

  if (req.method === "POST" && url.pathname === "/api/ai") {
    let data;

    try {
      data = await readBody(req);
    } catch (error) {
      return send(res, 400, {
        error: error.message
      });
    }

    const question = String(data.question || "").trim();

    if (!question) {
      return send(res, 400, {
        error: "Question is required."
      });
    }

    if (question.length > CONFIG.maxQuestionLength) {
      return send(res, 413, {
        error: "Question is too long."
      });
    }

    const experts = selectExperts(
      (data.experts || []).map(e => e.id)
    );

    if (!experts.length) {
      return send(res, 400, {
        error: "At least one valid specialist is required."
      });
    }

    const aiResult = await generateAIResponse({
      question,
      experts,
      history: Array.isArray(data.history)
        ? data.history.slice(-20)
        : []
    });

    if (!aiResult.configured) {
      return send(res, 503, {
        error: "AI provider is not configured yet.",
        experts: experts.map(e => e.name)
      });
    }

    return send(res, 501, {
      error: "AI provider adapter needs implementation.",
      experts: experts.map(e => e.name)
    });
  }

  return send(res, 404, {
    error: "Route not found."
  });
}

// SERVER

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(error => {
    console.error("QAVELYNT error:", error);

    if (!res.headersSent) {
      send(res, 500, {
        error: "Internal server error."
      });
    }
  });
});

server.listen(CONFIG.port, "0.0.0.0", () => {
  console.log("--------------------------------");
  console.log("QAVELYNT SERVER");
  console.log("Version:", CONFIG.version);
  console.log("Port:", CONFIG.port);
  console.log("Experts:", EXPERTS.length);
  console.log("Status: Running");
  console.log("--------------------------------");
});
