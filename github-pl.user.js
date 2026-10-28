// ==UserScript==
// @name         GitHub PL — nieoficjalne spolszczenie
// @namespace    https://github.com/AnonBOTpl/github-pl
// @version      1.1.1
// @description  Tłumaczy interfejs GitHub.com (i Gist) na język polski. Nie tłumaczy kodu, treści użytkowników ani commitów.
// @author       AnonBOTpl
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @resource     PL_DICT https://raw.githubusercontent.com/AnonBOTpl/github-pl/main/pl.json
// @updateURL    https://raw.githubusercontent.com/AnonBOTpl/github-pl/main/github-pl.user.js
// @downloadURL  https://raw.githubusercontent.com/AnonBOTpl/github-pl/main/github-pl.user.js
// @homepageURL  https://github.com/AnonBOTpl/github-pl
// @supportURL   https://github.com/AnonBOTpl/github-pl/issues
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  /* ======================================================================
   * 0. KONFIGURACJA I TRYB DEBUG
   * ==================================================================== */

  // Włącz tryb debug poleceniem w konsoli:
  //   localStorage.setItem('ghpl_debug', '1')
  // Wyłącz:
  //   localStorage.removeItem('ghpl_debug')
  const DEBUG = (() => {
    try {
      return localStorage.getItem("ghpl_debug") === "1";
    } catch (e) {
      return false;
    }
  })();

  const log = (...args) => {
    if (DEBUG) console.log("%c[GitHub PL]", "color:#58a6ff;font-weight:bold", ...args);
  };

  /* ======================================================================
   * 1. SŁOWNIK — wbudowany na start (z możliwością wydzielenia do pl.json)
   * ==================================================================== */

  // Wbudowany słownik bazowy (kopia pl.json w repozytorium). Dzięki temu
  // skrypt działa od razu po instalacji, bez zależności sieciowych.
  // Jeśli menedżer userscriptów wspiera @resource, spróbujemy doładować
  // (i nadpisać) świeższą wersję z pliku pl.json w repozytorium.
  // <DICT:BEGIN>
  const BUILTIN_DICT = {
    "common": {
      "Sign in": "Zaloguj się",
      "Sign up": "Zarejestruj się",
      "Sign out": "Wyloguj się",
      "Search or jump to...": "Szukaj lub przejdź do...",
      "Search": "Szukaj",
      "Type to search": "Wpisz, aby wyszukać",
      "Cancel": "Anuluj",
      "Save": "Zapisz",
      "Save changes": "Zapisz zmiany",
      "Submit": "Wyślij",
      "Close": "Zamknij",
      "Delete": "Usuń",
      "Edit": "Edytuj",
      "Update": "Aktualizuj",
      "Create": "Utwórz",
      "Loading": "Wczytywanie",
      "Loading...": "Wczytywanie...",
      "Yes": "Tak",
      "No": "Nie",
      "OK": "OK",
      "Learn more": "Dowiedz się więcej",
      "Read more": "Czytaj dalej",
      "Show more": "Pokaż więcej",
      "Show less": "Pokaż mniej",
      "View all": "Zobacz wszystko",
      "Back": "Wstecz",
      "Next": "Dalej",
      "Previous": "Poprzedni",
      "Copy": "Kopiuj",
      "Copied!": "Skopiowano!",
      "Copy to clipboard": "Kopiuj do schowka",
      "Dismiss": "Odrzuć",
      "Apply": "Zastosuj",
      "Filter": "Filtruj",
      "Filters": "Filtry",
      "Clear": "Wyczyść",
      "Sort": "Sortuj",
      "Settings": "Ustawienia",
      "Notifications": "Powiadomienia",
      "Your profile": "Twój profil",
      "Your repositories": "Twoje repozytoria",
      "Your projects": "Twoje projekty",
      "Your stars": "Twoje gwiazdki",
      "Your gists": "Twoje gisty",
      "Help": "Pomoc",
      "Docs": "Dokumentacja",
      "Feedback": "Opinia",
      "Status": "Status",
      "Contact": "Kontakt",
      "About": "Informacje",
      "Terms": "Warunki",
      "Privacy": "Prywatność",
      "Security": "Bezpieczeństwo",
      "Pricing": "Cennik",
      "Language": "Język",
      "Theme": "Motyw",
      "light": "jasny",
      "dark": "ciemny",
      "today": "dzisiaj",
      "yesterday": "wczoraj",
      "now": "teraz"
    },
    "nav": {
      "Pull requests": "Pull requesty",
      "Issues": "Zgłoszenia",
      "Marketplace": "Marketplace",
      "Explore": "Odkrywaj",
      "Sponsors": "Sponsorzy",
      "Topics": "Tematy",
      "Trending": "Popularne",
      "Collections": "Kolekcje",
      "Events": "Wydarzenia",
      "GitHub Sponsors": "GitHub Sponsors",
      "Open source": "Open source",
      "Solutions": "Rozwiązania",
      "Enterprise": "Enterprise",
      "Teams": "Zespoły",
      "Pricing plans": "Plany cenowe",
      "Create repository": "Utwórz repozytorium",
      "Import repository": "Importuj repozytorium",
      "New repository": "Nowe repozytorium",
      "New gist": "Nowy gist",
      "New organization": "Nowa organizacja",
      "New project": "Nowy projekt"
    },
    "dashboard": {
      "Home": "Strona główna",
      "Overview": "Przegląd",
      "Recent activity": "Ostatnia aktywność",
      "Top repositories": "Najważniejsze repozytoria",
      "Latest changes": "Najnowsze zmiany",
      "Discover repositories": "Odkrywaj repozytoria",
      "Explore repositories": "Odkrywaj repozytoria",
      "For you": "Dla Ciebie",
      "Following": "Obserwowani",
      "Recommended for you": "Polecane dla Ciebie",
      "Trending repositories": "Popularne repozytoria",
      "Sponsor": "Wesprzyj",
      "Show more activity": "Pokaż więcej aktywności",
      "created a repository": "utworzył(a) repozytorium",
      "starred": "dodał(a) gwiazdkę",
      "forked": "utworzył(a) forka z",
      "pushed to": "wypchnął(ęła) zmiany do"
    },
    "repo": {
      "Code": "Kod",
      "Issues": "Zgłoszenia",
      "Pull requests": "Pull requesty",
      "Discussions": "Dyskusje",
      "Actions": "Actions",
      "Projects": "Projekty",
      "Wiki": "Wiki",
      "Security": "Bezpieczeństwo",
      "Insights": "Statystyki",
      "Settings": "Ustawienia",
      "Star": "Dodaj gwiazdkę",
      "Unstar": "Usuń gwiazdkę",
      "Starred": "Oznaczone gwiazdką",
      "Fork": "Utwórz forka",
      "Forks": "Forki",
      "Forked from": "Forkowane z",
      "Watch": "Śledź",
      "Unwatch": "Przestań śledzić",
      "Watching": "Śledzący",
      "Notifications": "Powiadomienia",
      "Clone": "Klonuj",
      "Clone in GitHub Desktop": "Klonuj w GitHub Desktop",
      "Open in GitHub Desktop": "Otwórz w GitHub Desktop",
      "Open with GitHub Desktop": "Otwórz w GitHub Desktop",
      "Download ZIP": "Pobierz ZIP",
      "Code and automation": "Kod i automatyzacja",
      "Local": "Lokalnie",
      "Clone with HTTPS": "Klonuj przez HTTPS",
      "Use Git or checkout with SVN using the web URL.": "Użyj Gita lub pobierz przez SVN, korzystając z adresu URL.",
      "Releases": "Wydania",
      "Release": "Wydanie",
      "Packages": "Pakiety",
      "Contributors": "Współtwórcy",
      "Languages": "Języki",
      "Environments": "Środowiska",
      "Deployments": "Wdrożenia",
      "README": "README",
      "Readme": "Readme",
      "License": "Licencja",
      "branches": "gałęzi",
      "Branches": "Gałęzie",
      "branch": "gałąź",
      "Tags": "Tagi",
      "tags": "tagów",
      "Go to file": "Przejdź do pliku",
      "Add file": "Dodaj plik",
      "Add file via upload": "Dodaj plik przez przesłanie",
      "Create new file": "Utwórz nowy plik",
      "Upload files": "Prześlij pliki",
      "Find file": "Znajdź plik",
      "History": "Historia",
      "Commits": "Commity",
      "Commit history": "Historia commitów",
      "Latest commit": "Ostatni commit",
      "Switch branches/tags": "Przełącz gałęzie/tagi",
      "Compare": "Porównaj",
      "About": "Informacje",
      "Resources": "Zasoby",
      "No description, website, or topics provided.": "Nie podano opisu, strony ani tematów.",
      "Activity": "Aktywność",
      "Custom properties": "Właściwości niestandardowe",
      "Stars": "Gwiazdki",
      "Watchers": "Obserwujący repozytorium",
      "Report repository": "Zgłoś repozytorium",
      "This repository is archived": "To repozytorium jest zarchiwizowane",
      "Public": "Publiczne",
      "Private": "Prywatne",
      "Archived": "Zarchiwizowane",
      "Template": "Szablon",
      "Use this template": "Użyj tego szablonu",
      "Sync fork": "Synchronizuj forka",
      "This branch is up to date with": "Ta gałąź jest aktualna względem",
      "Compare & pull request": "Porównaj i utwórz pull request",
      "Contribute": "Współtwórz"
    },
    "issues": {
      "New issue": "Nowe zgłoszenie",
      "New Issue": "Nowe zgłoszenie",
      "Open": "Otwarte",
      "Closed": "Zamknięte",
      "Open issues": "Otwarte zgłoszenia",
      "Closed issues": "Zamknięte zgłoszenia",
      "Labels": "Etykiety",
      "Milestones": "Kamienie milowe",
      "Milestone": "Kamień milowy",
      "No milestone": "Brak kamienia milowego",
      "Assignees": "Przypisani",
      "Assign yourself": "Przypisz siebie",
      "No one assigned": "Nikt nie przypisany",
      "Linked pull requests": "Powiązane pull requesty",
      "Successfully merging a pull request may close this issue.": "Pomyślne scalenie pull requesta może zamknąć to zgłoszenie.",
      "Participants": "Uczestnicy",
      "Submit new issue": "Utwórz zgłoszenie",
      "Title": "Tytuł",
      "Comment": "Skomentuj",
      "Close issue": "Zamknij zgłoszenie",
      "Reopen issue": "Otwórz ponownie zgłoszenie",
      "Close with comment": "Zamknij z komentarzem",
      "Reopen and comment": "Otwórz ponownie i skomentuj",
      "Add your comment here": "Dodaj swój komentarz tutaj",
      "Leave a comment": "Zostaw komentarz",
      "Projects": "Projekty",
      "Development": "Powiązane",
      "Notifications": "Powiadomienia",
      "Subscribe": "Subskrybuj",
      "Unsubscribe": "Anuluj subskrypcję",
      "Lock conversation": "Zablokuj rozmowę",
      "This issue is locked": "To zgłoszenie jest zablokowane",
      "No branches or pull requests": "Brak gałęzi ani pull requestów"
    },
    "pulls": {
      "New pull request": "Nowy pull request",
      "Open": "Otwarte",
      "Closed": "Zamknięte",
      "Merged": "Scalony",
      "Draft": "Szkic",
      "Ready for review": "Gotowy do przeglądu",
      "Review": "Przegląd",
      "Reviewers": "Recenzenci",
      "Approve": "Zatwierdź",
      "Request changes": "Zgłoś uwagi",
      "Comment": "Skomentuj",
      "Merge pull request": "Scal pull request",
      "Squash and merge": "Scal (squash)",
      "Rebase and merge": "Rebase i scal",
      "Create a merge commit": "Utwórz commit scalający",
      "Confirm merge": "Potwierdź scalenie",
      "Close pull request": "Zamknij pull request",
      "Reopen pull request": "Otwórz ponownie pull request",
      "Conversation": "Rozmowa",
      "Commits": "Commity",
      "Checks": "Kontrole",
      "Files changed": "Zmienione pliki",
      "This branch has no conflicts with the base branch": "Ta gałąź nie ma konfliktów z gałęzią bazową",
      "Able to merge": "Można scalić",
      "This branch is out-of-date with the base branch": "Ta gałąź jest nieaktualna względem gałęzi bazowej",
      "Update branch": "Zaktualizuj gałąź",
      "base": "docelowa",
      "compare": "porównywana",
      "Changes from all commits": "Zmiany ze wszystkich commitów",
      "Add a comment": "Dodaj komentarz",
      "Start a review": "Rozpocznij przegląd",
      "Finish your review": "Zakończ przegląd",
      "Review changes": "Przejrzyj zmiany",
      "Comment only": "Tylko komentarz",
      "Diff view": "Widok różnic"
    },
    "actions": {
      "Actions": "Actions",
      "Workflows": "Workflowy",
      "All workflows": "Wszystkie workflowy",
      "New workflow": "Nowy workflow",
      "Runs": "Uruchomienia",
      "Workflow runs": "Uruchomienia workflowów",
      "Re-run all jobs": "Uruchom ponownie wszystkie zadania",
      "Re-run failed jobs": "Uruchom ponownie nieudane zadania",
      "Cancel workflow": "Anuluj workflow",
      "Jobs": "Zadania",
      "Job": "Zadanie",
      "Summary": "Podsumowanie",
      "Artifacts": "Artefakty",
      "Usage": "Użycie",
      "In progress": "W trakcie",
      "Queued": "W kolejce",
      "Success": "Sukces",
      "Failure": "Niepowodzenie",
      "Skipped": "Pominięto",
      "Cancelled": "Anulowano",
      "This workflow has a workflow_dispatch event trigger.": "Ten workflow ma wyzwalacz workflow_dispatch.",
      "Run workflow": "Uruchom workflow"
    },
    "settings": {
      "Settings": "Ustawienia",
      "Public profile": "Profil publiczny",
      "Account": "Konto",
      "Appearance": "Wygląd",
      "Accessibility": "Dostępność",
      "Notifications": "Powiadomienia",
      "Billing and plans": "Rozliczenia i plany",
      "Emails": "Adresy e-mail",
      "Password and authentication": "Hasło i uwierzytelnianie",
      "Sessions": "Sesje",
      "SSH and GPG keys": "Klucze SSH i GPG",
      "Organizations": "Organizacje",
      "Moderation": "Moderacja",
      "Repositories": "Repozytoria",
      "Codespaces": "Codespaces",
      "Packages": "Pakiety",
      "Pages": "Strony",
      "Webhooks": "Webhooki",
      "Deploy keys": "Klucze wdrożeniowe",
      "Secrets and variables": "Sekrety i zmienne",
      "Developer settings": "Ustawienia dewelopera",
      "Personal access tokens": "Osobiste tokeny dostępu",
      "OAuth Apps": "Aplikacje OAuth",
      "GitHub Apps": "Aplikacje GitHub",
      "Delete account": "Usuń konto",
      "Danger Zone": "Strefa zagrożenia",
      "Update profile": "Zaktualizuj profil",
      "Name": "Nazwa",
      "Bio": "Opis",
      "Company": "Firma",
      "Location": "Lokalizacja",
      "Website": "Strona internetowa",
      "Social accounts": "Konta społecznościowe",
      "Change password": "Zmień hasło",
      "Two-factor authentication": "Uwierzytelnianie dwuskładnikowe",
      "Enable two-factor authentication": "Włącz uwierzytelnianie dwuskładnikowe"
    },
    "profile": {
      "Followers": "Obserwujący",
      "Following": "Obserwowani",
      "Repositories": "Repozytoria",
      "Projects": "Projekty",
      "Packages": "Pakiety",
      "Stars": "Gwiazdki",
      "Overview": "Przegląd",
      "Edit profile": "Edytuj profil",
      "Follow": "Obserwuj",
      "Unfollow": "Przestań obserwować",
      "Block or report": "Zablokuj lub zgłoś",
      "Pinned": "Przypięte",
      "Customize your pins": "Dostosuj przypięte elementy",
      "Contribution activity": "Aktywność w kontrybucjach",
      "contributions in the last year": "kontrybucji w ostatnim roku",
      "Contribution graph": "Wykres kontrybucji",
      "Achievements": "Osiągnięcia",
      "Organizations": "Organizacje",
      "Highlights": "Wyróżnienia",
      "README profile": "Profil README"
    }
  };
  // <DICT:END>

  // Scalenie sekcji słownika w jedną płaską mapę { "English": "Polski" }.
  function flattenDict(sectioned) {
    const flat = Object.create(null);
    for (const section of Object.keys(sectioned)) {
      Object.assign(flat, sectioned[section]);
    }
    return flat;
  }

  let DICT = flattenDict(BUILTIN_DICT);

  // Spróbuj doładować świeższy pl.json przez @resource (bez requestów sieciowych
  // wykonywanych przez samą stronę — plik jest pobierany i cache'owany przez
  // menedżer userscriptów, zgodnie z zasadą "żadnych danych na zewnątrz").
  try {
    if (typeof GM_getResourceText === "function") {
      const raw = GM_getResourceText("PL_DICT");
      if (raw) {
        const parsed = JSON.parse(raw);
        DICT = Object.assign(DICT, flattenDict(parsed));
        log("Wczytano zewnętrzny pl.json przez @resource.");
      }
    }
  } catch (e) {
    log("Nie udało się wczytać zewnętrznego pl.json, używam wbudowanego słownika.", e);
  }

  /* ======================================================================
   * 2. ODMIANA LICZEBNIKÓW (polska gramatyka: 1 / 2-4 / 5+, poza 12-14)
   * ==================================================================== */

  function plural(n, one, few, many) {
    const abs = Math.abs(n);
    if (abs === 1) return one;
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
    return many;
  }

  /* ======================================================================
   * 3. WZORCE DYNAMICZNE (daty względne, liczniki)
   * ==================================================================== */

  // Parsuje liczniki: przecinek grupujący tysiące, k jako tysiące oraz
  // kropkę/przecinek dziesiętny. 1.2k jest prezentowane spójnie jako „1,2 tys.”.
  function parseCount(str) {
    const raw = String(str).trim().toLowerCase();
    const suffixed = raw.endsWith("k");
    const numberPart = suffixed ? raw.slice(0, -1) : raw;
    let normalized;
    if (suffixed && /^[0-9]+,[0-9]+$/.test(numberPart)) {
      normalized = numberPart.replace(",", ".");
    } else if (/^[0-9]{1,3}(,[0-9]{3})+$/.test(numberPart)) {
      normalized = numberPart.replace(/,/g, "");
    } else {
      normalized = numberPart.replace(/,/g, ".");
    }
    const numeric = Number(normalized);
    if (!Number.isFinite(numeric)) return null;
    const value = suffixed ? numeric * 1000 : numeric;
    const isInteger = !suffixed && Number.isInteger(value);
    let display;
    if (suffixed) {
      display = String(numeric).replace(".", ",") + " tys.";
    } else if (isInteger) {
      // Używamy twardej spacji jako separatora tysięcy, by liczba nie łamała się w UI.
      display = value >= 1000 ? String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") : String(value);
    } else {
      display = String(numeric).replace(".", ",");
    }
    return { value, isInteger, suffixed, display };
  }

  // Odmiana gramatyczna jest używana wyłącznie dla całkowitych liczników;
  // wartości dziesiętne i zapis k przyjmują dopełniacz liczby mnogiej.
  function countForm(count, one, few, many) {
    return count && count.isInteger ? plural(count.value, one, few, many) : many;
  }
  const countRe = "([\\d.,]+k?)";
  const MONTHS = { jan: "stycznia", feb: "lutego", mar: "marca", apr: "kwietnia", may: "maja", jun: "czerwca", jul: "lipca", aug: "sierpnia", sep: "września", oct: "października", nov: "listopada", dec: "grudnia" };
  const DYNAMIC_PATTERNS = [
    { re: /^on (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d{1,2})(?:, (\d{4}))?$/i, rawMatch: true, fn: (m) => `${Number(m[2])} ${MONTHS[m[1].slice(0, 3).toLowerCase()]}${m[3] ? ` ${m[3]}` : ""}` },
    { re: new RegExp("^" + countRe + "\\s+seconds?\\s+ago$", "i"), fn: (c) => `${c.display} ${countForm(c, "sekundę", "sekundy", "sekund")} temu` },
    { re: new RegExp("^" + countRe + "\\s+minutes?\\s+ago$", "i"), fn: (c) => `${c.display} ${countForm(c, "minutę", "minuty", "minut")} temu` },
    { re: new RegExp("^" + countRe + "\\s+hours?\\s+ago$", "i"), fn: (c) => `${c.display} ${countForm(c, "godzinę", "godziny", "godzin")} temu` },
    { re: new RegExp("^" + countRe + "\\s+days?\\s+ago$", "i"), fn: (c) => `${c.display} ${countForm(c, "dzień", "dni", "dni")} temu` },
    { re: new RegExp("^" + countRe + "\\s+weeks?\\s+ago$", "i"), fn: (c) => `${c.display} ${countForm(c, "tydzień", "tygodnie", "tygodni")} temu` },
    { re: new RegExp("^" + countRe + "\\s+months?\\s+ago$", "i"), fn: (c) => `${c.display} ${countForm(c, "miesiąc", "miesiące", "miesięcy")} temu` },
    { re: new RegExp("^" + countRe + "\\s+years?\\s+ago$", "i"), fn: (c) => `${c.display} ${countForm(c, "rok", "lata", "lat")} temu` },
    { re: new RegExp("^" + countRe + "\\s+commits?$", "i"), fn: (c) => `${c.display} ${countForm(c, "commit", "commity", "commitów")}` },
    { re: new RegExp("^" + countRe + "\\s+issues?$", "i"), fn: (c) => `${c.display} ${countForm(c, "zgłoszenie", "zgłoszenia", "zgłoszeń")}` },
    { re: new RegExp("^" + countRe + "\\s+open issues?$", "i"), fn: (c) => `${c.display} ${countForm(c, "otwarte zgłoszenie", "otwarte zgłoszenia", "otwartych zgłoszeń")}` },
    { re: new RegExp("^" + countRe + "\\s+pull requests?$", "i"), fn: (c) => `${c.display} ${countForm(c, "pull request", "pull requesty", "pull requestów")}` },
    { re: new RegExp("^" + countRe + "\\s+stars?$", "i"), fn: (c) => `${c.display} ${countForm(c, "gwiazdka", "gwiazdki", "gwiazdek")}` },
    { re: new RegExp("^" + countRe + "\\s+forks?$", "i"), fn: (c) => `${c.display} ${countForm(c, "fork", "forki", "forków")}` },
    { re: new RegExp("^" + countRe + "\\s+watching$", "i"), fn: (c) => `${c.display} ${countForm(c, "śledzący", "śledzących", "śledzących")}` },
    { re: new RegExp("^" + countRe + "\\s+contributors?$", "i"), fn: (c) => `${c.display} ${countForm(c, "współtwórca", "współtwórców", "współtwórców")}` },
    { re: new RegExp("^" + countRe + "\\s+branches?$", "i"), fn: (c) => `${c.display} ${countForm(c, "gałąź", "gałęzie", "gałęzi")}` },
    { re: new RegExp("^" + countRe + "\\s+releases?$", "i"), fn: (c) => `${c.display} ${countForm(c, "wydanie", "wydania", "wydań")}` },
    { re: new RegExp("^" + countRe + "\\s+tags?$", "i"), fn: (c) => `${c.display} ${countForm(c, "tag", "tagi", "tagów")}` },
    { re: new RegExp("^" + countRe + "\\s+repositories$", "i"), fn: (c) => `${c.display} ${countForm(c, "repozytorium", "repozytoria", "repozytoriów")}` },
    { re: new RegExp("^" + countRe + "\\s+followers?$", "i"), fn: (c) => `${c.display} ${countForm(c, "obserwujący", "obserwujących", "obserwujących")}` },
    { re: new RegExp("^" + countRe + "\\s+watchers?$", "i"), fn: (c) => `${c.display} ${countForm(c, "obserwujący repozytorium", "obserwujących repozytorium", "obserwujących repozytorium")}` },
    { re: new RegExp("^" + countRe + "\\s+following$", "i"), fn: (c) => `${c.display} ${countForm(c, "obserwowany", "obserwowanych", "obserwowanych")}` },
    { re: new RegExp("^" + countRe + "\\s+comments?$", "i"), fn: (c) => `${c.display} ${countForm(c, "komentarz", "komentarze", "komentarzy")}` },
    { re: new RegExp("^" + countRe + "\\s+files? changed$", "i"), fn: (c) => `${c.display} ${countForm(c, "zmieniony plik", "zmienione pliki", "zmienionych plików")}` }
  ];

  function translateDynamic(text) {
    // Większość tekstów nie jest licznikiem ani datą; odrzuć je bez regexów.
    let hasDigit = false;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= 48 && code <= 57) { hasDigit = true; break; }
    }
    if (!hasDigit && text.slice(0, 3).toLowerCase() !== "on ") return undefined;

    for (const pattern of DYNAMIC_PATTERNS) {
      const match = text.match(pattern.re);
      if (match) {
        if (pattern.rawMatch) return pattern.fn(match);
        const count = parseCount(match[1]);
        if (count) return pattern.fn(count);
      }
    }
    return undefined;
  }

  function translateString(text) {
    if (Object.prototype.hasOwnProperty.call(DICT, text)) return DICT[text];
    return translateDynamic(text);
  }

  /* ======================================================================
   * 4. WYKLUCZENIA — treści użytkownika, kod, nazwy własne
   * ==================================================================== */

  // Nie wykluczamy całego .react-directory-row ani .react-blob-print-hide:
  // wrappery mogą zawierać czas względny lub kontrolki Raw/Copy/Blame.
  const EXCLUDE_SELECTORS = [
    ".blob-code", // Kod wierszy pliku i diffu.
    ".markdown-body", // Markdown napisany przez użytkowników.
    ".commit-title", // Tytuł commita.
    ".commit-message", // Treść commita.
    "pre", // Bloki kodu.
    "code", // Fragmenty kodu.
    ".js-file-line", // Zawartość wierszy plików.
    ".comment-body", // Komentarze użytkowników.
    ".js-issue-title", // Tytuły issue/PR napisane przez użytkowników.
    ".markdown-title", // Tytuły markdown i treści użytkownika.
    "[data-hovercard-type]", // Nazwy kont i repo używane w hovercardach.
    ".repo", // Nazwa repozytorium.
    ".author", // Nazwy autorów.
    ".js-navigation-item .content span.css-truncate-target", // Nazwy plików w starym widoku.
    "[role=\"rowheader\"]", // Komórka nazwy pliku/katalogu; do weryfikacji na żywo.
    ".react-directory-filename-column", // Komórka nazwy pliku/katalogu; do weryfikacji na żywo.
    "[data-testid=\"issue-title\"]", // Tytuł issue; do weryfikacji na żywo.
    "[data-testid=\"issue-pr-title-link\"]", // Tytuł issue/PR na liście; do weryfikacji na żywo.
    "[data-testid=\"list-row-repo-name-and-number\"]", // Nazwa repo i numer issue/PR; do weryfikacji na żywo.
    ".react-code-text", // Tekst kodu w nowym widoku; do weryfikacji na żywo.
    ".react-file-line", // Zawartość linii pliku, bez kontrolek UI; do weryfikacji na żywo.
    ".branch-name", // Nazwa gałęzi; do weryfikacji na żywo.
    "[data-testid=\"branch-name\"]", // Nazwa gałęzi w komponentach React; do weryfikacji na żywo.
    ".commit-ref", // Nazwa gałęzi/tagu w odnośniku commit; do weryfikacji na żywo.
    "textarea", // Tekst wpisywany przez użytkownika.
    "input[type='text']", // Tekst wpisywany przez użytkownika.
    ".CodeMirror", // Edytor kodu.
    ".cm-editor", // Edytor kodu.
    "[contenteditable='true']", // Edytory rich-text.
    "script", // Kod strony.
    "style", // Arkusze stylów.
    "noscript" // Treść zapasowa.
  ];

  const EXCLUDE_SELECTOR = EXCLUDE_SELECTORS.join(",");

  function isExcludedElement(el, includeAncestors = false) {
    if (!el) return false;
    try {
      // closest() jest potrzebne tylko na granicy poddrzewa wejściowego;
      // wewnątrz walk() wystarcza matches() przy węzłach elementów.
      if (includeAncestors) return !!el.closest(EXCLUDE_SELECTOR);
      return el.matches(EXCLUDE_SELECTOR);
    } catch (e) {
      return false;
    }
  }

  /* ======================================================================
   * 5. SILNIK TŁUMACZENIA DOM-u
   * ==================================================================== */

  const translatedTextNodes = new WeakMap();
  const seenUntranslated = new Set();

  function reportUntranslated(text) {
    if (!DEBUG) return;
    if (seenUntranslated.has(text)) return;
    seenUntranslated.add(text);
    console.log(
      "%c[GitHub PL] brak tłumaczenia:%c %s",
      "color:#f85149;font-weight:bold",
      "color:inherit",
      JSON.stringify(text)
    );
  }

  // Tłumaczy pojedynczy węzeł tekstowy, zachowując otaczające białe znaki,
  // z dopasowaniem ścisłym po całym przyciętym tekście.
  function translateTextNode(node) {
    const original = node.nodeValue;
    // Pamiętamy także teksty bez tłumaczenia: skan ponowny nie uruchamia
    // dla nich słownika ani wzorców, ale nowa wartość Reacta zostanie sprawdzona.
    if (translatedTextNodes.get(node) === original) return;
    if (!original) {
      translatedTextNodes.set(node, original);
      return;
    }

    const m = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const [, leading, core, trailing] = m;
    if (!core) {
      translatedTextNodes.set(node, original);
      return;
    }

    const translated = translateString(core);
    if (translated !== undefined && translated !== core) {
      node.nodeValue = leading + translated + trailing;
      translatedTextNodes.set(node, node.nodeValue);
    } else {
      if (translated === undefined) reportUntranslated(core);
      translatedTextNodes.set(node, original);
    }
  }

  const ATTR_LIST = ["placeholder", "aria-label", "title", "alt"];

  function translateAttributes(el) {
    for (const attr of ATTR_LIST) {
      if (!el.hasAttribute(attr)) continue;
      const value = el.getAttribute(attr);
      if (!value) continue;
      const m = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const [, leading, core, trailing] = m;
      if (!core) continue;
      const translated = translateString(core);
      if (translated !== undefined && translated !== core) {
        el.setAttribute(attr, leading + translated + trailing);
      } else if (translated === undefined) {
        reportUntranslated(core);
      }
    }

    // input[type=submit] używa `value` jako widocznej etykiety przycisku.
    if (el.tagName === "INPUT" && (el.type === "submit" || el.type === "button")) {
      const value = el.value;
      if (value) {
        const m = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
        const [, leading, core, trailing] = m;
        if (core) {
          const translated = translateString(core);
          if (translated !== undefined && translated !== core) {
            el.value = leading + translated + trailing;
          } else if (translated === undefined) {
            reportUntranslated(core);
          }
        }
      }
    }
  }

  // Skan wejściowy sprawdza przodków tylko raz. W rekurencji teksty są
  // przetwarzane bez wywołań closest(); elementy sprawdzają tylko własny selector.
  function walk(node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement && isExcludedElement(node.parentElement, true)) return;
      translateTextNode(node);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (isExcludedElement(node, true)) return;
      walkElement(node, true);
      return;
    }
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) walkChildren(node);
  }

  function walkElement(el, alreadyChecked = false) {
    if (!alreadyChecked && isExcludedElement(el)) return;
    translateAttributes(el);

    // GitHub relative-time może renderować etykietę w dostępnym shadowRoot.
    if (el.localName === "relative-time" && el.shadowRoot) {
      walkChildren(el.shadowRoot);
      observer.observe(el.shadowRoot, { childList: true, subtree: true, characterData: true });
    }
    walkChildren(el);
  }

  function walkChildren(parent) {
    let child = parent.firstChild;
    while (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        translateTextNode(child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walkElement(child);
      } else if (child.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        walkChildren(child);
      }
      child = child.nextSibling;
    }
  }

  /* ======================================================================
   * 6. OBSERWACJA ZMIAN W DOM i NAWIGACJI GITHUBA (Turbo/PJAX)
   * ==================================================================== */

  const pendingNodes = new Set();
  let scheduled = false;
  const DEBOUNCE_MS = 60;

  function flushPending() {
    scheduled = false;
    const nodes = Array.from(pendingNodes);
    pendingNodes.clear();
    const queued = new Set(nodes);
    for (const node of nodes) {
      let ancestor = node.parentNode;
      let covered = false;
      while (ancestor) {
        if (queued.has(ancestor)) { covered = true; break; }
        ancestor = ancestor.parentNode;
      }
      if (!covered && node.isConnected) walk(node);
    }
  }

  function scheduleWalk(node) {
    pendingNodes.add(node);
    if (scheduled) return;
    scheduled = true;
    setTimeout(flushPending, DEBOUNCE_MS);
  }

  let lastFullRescan = 0;
  let fullRescanTimer = null;
  function fullRescan() {
    const elapsed = Date.now() - lastFullRescan;
    if (elapsed < 200) {
      if (fullRescanTimer) return;
      fullRescanTimer = setTimeout(() => {
        fullRescanTimer = null;
        fullRescan();
      }, 200 - elapsed);
      return;
    }
    lastFullRescan = Date.now();
    scheduleWalk(document.body);
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        scheduleWalk(mutation.target);
      }
      for (const added of mutation.addedNodes || []) {
        if (added.nodeType === Node.ELEMENT_NODE || added.nodeType === Node.TEXT_NODE) {
          scheduleWalk(added);
        }
      }
    }
  });

  function start() {
    walk(document.body);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    ["turbo:render", "turbo:load", "pjax:end"].forEach((evt) => {
      document.addEventListener(evt, () => {
        log(`Zdarzenie nawigacji: ${evt}`);
        setTimeout(fullRescan, 30);
      });
    });

    log(
      `Aktywny. Słownik: ${Object.keys(DICT).length} fraz. Tryb debug: ${DEBUG ? "WŁĄCZONY" : "wyłączony"}.`
    );
    if (!DEBUG) {
      log("Aby włączyć log nieprzetłumaczonych fraz: localStorage.setItem('ghpl_debug','1') i odśwież stronę.");
    }
  }

  if (document.body) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }

  // Udostępnij kilka rzeczy w konsoli na potrzeby debugowania/rozwoju.
  const debugApi = { plural, parseCount, translateString, DICT, EXCLUDE_SELECTORS };
  try {
    const pageWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    pageWindow.__githubPL = debugApi;
  } catch (e) {
    window.__githubPL = debugApi;
  }
})();
