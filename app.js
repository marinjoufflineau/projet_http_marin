"use strict";

import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeBills } from "./dab.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =========================
   CONFIGURATION
========================= */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "tp-express-secret",
    resave: false,
    saveUninitialized: false,
  })
);

/* =========================
   VARIABLES GLOBALES VUES
========================= */

app.use((req, res, next) => {
  res.locals.isAdmin = req.session.isAdmin === true;
  res.locals.login = req.session.login || null;
  res.locals.currentPath = req.path;
  next();
});

/* =========================
   ROUTES PRINCIPALES
========================= */

app.get("/", (req, res) => {
  res.render("home", { title: "Accueil" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "À propos" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

/* =========================
   ROUTE DYNAMIQUE USER
========================= */

app.get("/user/:name", (req, res) => {
  res.render("home", {
    title: "Utilisateur",
    message: `Bienvenue ${req.params.name}`,
  });
});

/* =========================
   LOGIN ADMIN
========================= */

app.get("/login", (req, res) => {
  res.render("login", { title: "Connexion", error: null });
});

app.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login === "admin" && password === "admin") {
    req.session.isAdmin = true;
    req.session.login = login;
    return res.redirect("/");
  }

  res.render("login", {
    title: "Connexion",
    error: "Identifiants invalides (admin/admin)",
  });
});

/* =========================
   LOGOUT
========================= */

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

/* =========================
   DAB (GET + POST)
========================= */

app.get("/dab", (req, res) => {
  res.render("dab", { title: "Distributeur", result: null });
});

app.post("/dab", (req, res) => {
  const amount = req.body.amount;
  const result = computeBills(amount);

  res.render("dab", {
    title: "Distributeur",
    amount,
    result,
  });
});

app.get("/dab/:amount", (req, res) => {
  const amount = req.params.amount;
  const result = computeBills(amount);

  res.render("dab", {
    title: "Distributeur",
    amount,
    result,
  });
});

/* =========================
   PAGE ERREUR TEST
========================= */

app.get("/error", (req, res, next) => {
  next(new Error("Erreur volontaire déclenchée."));
});

/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

/* =========================
   ERREUR GLOBALE
========================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Erreur",
    message: err.message,
  });
});

/* =========================
   SERVEUR
========================= */

app.listen(8080, () => {
  console.log("Serveur Express lancé sur http://localhost:8080");
});