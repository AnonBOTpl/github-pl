# GitHub PL — nieoficjalne spolszczenie interfejsu GitHuba

Userscript (Tampermonkey / Violentmonkey / Greasemonkey), który tłumaczy interfejs `github.com` oraz `gist.github.com` na język polski. Repozytorium projektu: [AnonBOTpl/github-pl](https://github.com/AnonBOTpl/github-pl).

> ⚠️ Projekt nieoficjalny, niezwiązany z GitHub, Inc. Tłumaczone są elementy interfejsu — nie treści repozytoriów, kod, commity ani komentarze użytkowników.

## Funkcje i ograniczenia

- Tłumaczenie tekstu DOM oraz atrybutów `placeholder`, `aria-label`, `title`, `alt` i `value` przycisków `input[type=submit/button]`.
- Dopasowanie ścisłe całego tekstu; dynamiczne aktualizacje tekstu są ponownie tłumaczone.
- Obsługa treści doładowanej przez Turbo/PJAX i `MutationObserver`; teksty już sprawdzone (także nieprzetłumaczone) są pomijane na kolejnych skanach, dopóki nie zmieni się `nodeValue`.
- Polskie formy liczebników; liczby z separatorami tysięcy i skrótem `k` (np. `1,234 stars`, `1.2k stars`).
- Wykluczenia obejmują kod, Markdown, pola edycji oraz nazwy plików, katalogów, repozytoriów, gałęzi, tytuły issue i PR. Lista wraz z komentarzami znajduje się w `EXCLUDE_SELECTORS` w `github-pl.user.js`.
- Skrypt działa lokalnie i nie wysyła danych do zewnętrznych usług.

`<relative-time>`: skrypt tłumaczy treść w zwykłym DOM oraz podejmuje próbę przejścia i obserwowania **otwartego** `shadowRoot`, jeśli komponent go udostępnia. Wzorzec obsługuje m.in. `3 days ago`, `on Oct 3` oraz `on Oct 3, 2023` (rok pozostaje w tłumaczeniu). Zamknięty shadow DOM jest niedostępny dla userscriptu; jeśli GitHub użyje takiego renderowania, ta treść może pozostać po angielsku. Selektory React oznaczone w kodzie komentarzem `do weryfikacji na żywo` wymagają sprawdzenia w rzeczywistych widokach GitHuba; szerokie wrappery `.react-directory-row` i `.react-blob-print-hide` nie są wykluczane, aby nie blokować czasu względnego ani kontrolek UI. W tym środowisku nie dało się zweryfikować zalogowanych stron repozytorium, issues, PR i profilu.

## Instalacja

1. Zainstaluj Tampermonkey lub Violentmonkey.
2. Otwórz `github-pl.user.js` z repozytorium [AnonBOTpl/github-pl](https://github.com/AnonBOTpl/github-pl) i zatwierdź instalację.
3. Odśwież `github.com`.

Menedżer userscriptów może automatycznie pobierać aktualizacje przez `@updateURL` i `@downloadURL`.

## Słownik i synchronizacja

`pl.json` jest **jedynym źródłem prawdy**. `BUILTIN_DICT` w `github-pl.user.js` jest generowany z tego pliku, aby skrypt działał również bez załadowanego zasobu zewnętrznego.

Po edycji `pl.json` uruchom z katalogu głównego projektu:

```sh
node scripts/sync-dict.js
```

Skrypt bez zależności aktualizuje zawartość pomiędzy znacznikami `// <DICT:BEGIN>` i `// <DICT:END>`. Wypisuje ostrzeżenia dla powtórzonych kluczy z różnymi wartościami oraz kolizji wartości pomiędzy sekcjami. Sprawdź ostrzeżenia, a potem zatwierdź razem `pl.json` i wygenerowany `github-pl.user.js`.

`@resource` jest pobierany i cache'owany przez menedżer userscriptów. Po zmianie `pl.json` zwiększ `@version` w nagłówku userscriptu, aby menedżer pobrał zaktualizowany zasób (i wygenerowany skrypt). Nie usuwaj wbudowanej kopii słownika.

### Debugowanie

W konsoli strony GitHuba:

```js
localStorage.setItem('ghpl_debug', '1')
```

Odśwież stronę, aby zobaczyć nieprzetłumaczone frazy. Możesz też sprawdzić API debugowania:

```js
window.__githubPL.translateString('1.2k stars')
window.__githubPL.parseCount('1,234')
```

Dostęp do `window.__githubPL` jest eksportowany przez `unsafeWindow`, z bezpiecznym fallbackiem do `window`.

Aby wyłączyć debugowanie:

```js
localStorage.removeItem('ghpl_debug')
```

### Zasady terminologii

- `Watch` dotyczy śledzenia aktywności repozytorium; `Follow` — obserwowania profilu. `Watchers` to „Obserwujący repozytorium”, a `Followers` — „Obserwujący”.
- `About` ma jedno tłumaczenie „Informacje” w całym słowniku, ponieważ silnik używa płaskiej mapy bez kontekstu sekcji.
- `Open` / `Closed` mają jednolite wartości „Otwarte” / „Zamknięte”; konkretna forma gramatyczna jest dobierana w kontekstowych frazach dynamicznych.
- Nie dodawaj samodzielnego `on` ani ogólnego `New`: ich przekład zależy od kontekstu. Daty względne obsługują konkretne wzorce.

## Testy ręczne przed PR

Sprawdź stronę główną, repozytorium (lista plików zawierająca np. `Docs`, `Settings`, `License`), listę issue, PR i profil. Upewnij się, że angielskie nazwy użytkownika, repozytorium, branchy, plików i tytułów pozostają niezmienione; dodaj treść do `.markdown-body` i `pre`; sprawdź zmianę tekstu `Open` → `Closed` → `Merged` oraz liczniki `1 star`, `2 stars`, `12 stars`, `22 stars`, `1,234 stars`, `1.2k stars`.

## Współtworzenie

Zasady, glosariusz i procedura synchronizacji znajdują się w [`CONTRIBUTING.md`](./CONTRIBUTING.md). Zgłoszenia błędów powinny zawierać adres strony, reprodukcję i — jeśli to możliwe — zrzut ekranu.

## Licencja

[MIT](./LICENSE) — używaj, kopiuj, modyfikuj, twórz forki.
