"use strict";

import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ejs from "ejs";

// Reconstruction de __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsDir = path.join(__dirname, "views");

// Petit helper pour parser les cookies
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((pair) => {
    const [name, ...rest] = pair.split("=");
    const trimmedName = name.trim();
    const value = rest.join("=").trim();
    if (trimmedName) {
      cookies[trimmedName] = decodeURIComponent(value);
    }
  });
  return cookies;
}

// Helper pour rendre une vue EJS
function renderView(res, viewName, data = {}, statusCode = 200) {
  const filePath = path.join(viewsDir, `${viewName}.ejs`);

  ejs.renderFile(filePath, data, {}, (err, html) => {
    if (err) {
      console.error("Erreur EJS :", err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Erreur interne du serveur");
      return;
    }

    res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // true => query object
  const pathName = parsedUrl.pathname;
  const query = parsedUrl.query;

  // 1) Cookies reçus
  const cookies = parseCookies(req.headers.cookie);
  let isAdmin = cookies.isAdmin === "true";

  // 2) Si un paramètre isAdmin est présent dans l'URL, il prend le dessus
  if (typeof query.isAdmin !== "undefined") {
    isAdmin = query.isAdmin === "true";
    // On stocke la nouvelle valeur dans un cookie
    // Max-Age en secondes (ici 1 heure)
    res.setHeader(
      "Set-Cookie",
      `isAdmin=${isAdmin}; Path=/; Max-Age=3600; HttpOnly`
    );
  }

  // Pour avoir l'URL courante dans les templates (pour les liens)
  const urlPath = pathName;

  // Exemple d'utilisation de fs.readFile (lecture d'un fichier texte)
  // juste pour illustrer le module fs
  if (pathName === "/readme-txt") {
    const filePath = path.join(__dirname, "README.txt");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Fichier introuvable");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(content);
    });
    return;
  }

  // Routing des pages EJS
  if (pathName === "/") {
    renderView(res, "home", {
      title: "Accueil",
      isAdmin,
      urlPath,
    });
  } else if (pathName === "/about") {
    renderView(res, "about", {
      title: "À propos",
      isAdmin,
      urlPath,
    });
  } else if (pathName === "/contact") {
    renderView(res, "contact", {
      title: "Contact",
      isAdmin,
      urlPath,
    });
  } else {
    // 404
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>404</h1><p>Page non trouvée</p>");
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, "localhost", () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});

