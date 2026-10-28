#!/usr/bin/env node
"use strict";

// Regeneruje BUILTIN_DICT z autorytatywnego pl.json; działa wyłącznie w Node.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const jsonPath = path.join(root, "pl.json");
const scriptPath = path.join(root, "github-pl.user.js");
const source = fs.readFileSync(jsonPath, "utf8");

// Mały parser do kontroli powtórzonych kluczy przed JSON.parse (który
// standardowo po cichu zachowuje tylko ostatnią wartość).
function checkDuplicateKeys(text) {
  let i = 0;
  const warnings = [];
  const ws = () => { while (/\s/.test(text[i] || "")) i++; };
  function string() {
    const start = i++;
    while (i < text.length) {
      if (text[i] === "\\") { i += 2; continue; }
      if (text[i++] === '"') break;
    }
    return JSON.parse(text.slice(start, i));
  }
  function value(pathParts) {
    ws();
    if (text[i] === "{") {
      i++;
      const seen = new Map();
      const obj = {};
      ws();
      while (text[i] !== "}") {
        ws();
        const key = string();
        ws(); i++; // colon
        const child = value(pathParts.concat(key));
        const serialized = JSON.stringify(child);
        if (seen.has(key) && seen.get(key).serialized !== serialized) {
          warnings.push(`Powtórzony klucz z różnymi wartościami: ${pathParts.concat(key).join(".")} (${seen.get(key).serialized} vs ${serialized})`);
        }
        seen.set(key, { serialized });
        obj[key] = child;
        ws();
        if (text[i] === ",") { i++; ws(); } else break;
      }
      i++; // }
      return obj;
    }
    if (text[i] === "[") {
      i++;
      const arr = [];
      ws();
      while (text[i] !== "]") {
        arr.push(value(pathParts));
        ws();
        if (text[i] === ",") { i++; ws(); } else break;
      }
      i++;
      return arr;
    }
    if (text[i] === '"') return string();
    const start = i;
    while (i < text.length && !/[\s,}\]]/.test(text[i])) i++;
    return JSON.parse(text.slice(start, i));
  }
  value([]);
  return warnings;
}

for (const warning of checkDuplicateKeys(source)) console.warn(`[sync-dict] OSTRZEŻENIE: ${warning}`);
const dict = JSON.parse(source);
const flat = new Map();
for (const [section, entries] of Object.entries(dict)) {
  for (const [english, polish] of Object.entries(entries)) {
    if (flat.has(english) && flat.get(english).polish !== polish) {
      console.warn(`[sync-dict] OSTRZEŻENIE: kolizja klucza ${JSON.stringify(english)}: ${flat.get(english).section}=${JSON.stringify(flat.get(english).polish)}, ${section}=${JSON.stringify(polish)}`);
    } else if (!flat.has(english)) {
      flat.set(english, { section, polish });
    }
  }
}

const script = fs.readFileSync(scriptPath, "utf8");
const begin = "  // <DICT:BEGIN>";
const end = "  // <DICT:END>";
const startAt = script.indexOf(begin);
const endAt = script.indexOf(end);
if (startAt < 0 || endAt < 0 || endAt < startAt || script.indexOf(begin, startAt + begin.length) >= 0) {
  throw new Error("Nie znaleziono poprawnej, pojedynczej pary znaczników DICT:BEGIN/DICT:END.");
}
const literal = `  // <DICT:BEGIN>\n  const BUILTIN_DICT = ${JSON.stringify(dict, null, 2).replace(/\n/g, "\n  ")};\n  // <DICT:END>`;
const updated = script.slice(0, startAt) + literal + script.slice(endAt + end.length);
fs.writeFileSync(scriptPath, updated);
console.log(`[sync-dict] Zaktualizowano BUILTIN_DICT (${flat.size} unikalnych fraz).`);
