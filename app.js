"use strict";

import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeBills } from "./dab.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

// Variables globales pour toutes les vues
app.use((req, res, next) => {
  res.locals.isAdmin = req.session.isAdmin === true;
  res.locals.login = req.session.login || null;
  next();
});

// ---- ROUTES ----
app.get("/", (req, res) => {
  res.render("home", { title: "Accueil" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "À propos" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

// Route dynamique
app.get("/user/:name", (req, res) => {
  res.render("home", {
    title: "Utilisateur",
    message: `Bienvenue ${req.params.name}`,
  });
});

// ---- LOGIN ----
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

  res.status(401).render("login", {
    title: "Connexion",
    error: "Identifiants invalides (admin/admin)",
  });
});

// ---- LOGOUT ----
app.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ---- DAB ----
app.get("/dab", (req, res) => {
    res.render("dab", {
      title: "Distributeur de billets",
      amount: "",
      result: null,
    });
  });
  
  app.post("/dab", (req, res) => {
    const { amount } = req.body;
    return res.redirect(`/dab/${encodeURIComponent(amount)}`);
  });
  
app.get("/dab/:amount", (req, res) => {
  const result = computeBills(req.params.amount);

  res.render("dab", {
    title: "Distributeur de billets",
    amount: req.params.amount,
    result,
  });
});

// ---- PAGE ERREUR (visible dans le menu) ----
app.get("/error", (req, res) => {
  throw new Error("Ceci est une erreur test.");
});

// ---- 404 ----
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page introuvable" });
});

// ---- 500 (handler d'erreur Express) ----
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", {
    title: "Erreur",
    message: err.message || "Erreur interne",
  });
});

app.listen(8080, () => {
  console.log("Serveur Express lancé sur http://localhost:8080");
});
