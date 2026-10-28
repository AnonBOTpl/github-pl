# Współtworzenie GitHub PL

Dziękujemy za pomoc w poprawianiu tłumaczeń i zgodności userscriptu z interfejsem GitHuba.

## Zmiana słownika

1. Edytuj `pl.json` — to jedyne źródło prawdy. Nie poprawiaj ręcznie wygenerowanego obiektu `BUILTIN_DICT`.
2. Po zmianie uruchom z katalogu głównego:

   ```sh
   node scripts/sync-dict.js
   ```

   Skrypt aktualizuje słownik w `github-pl.user.js` pomiędzy `// <DICT:BEGIN>` i `// <DICT:END>`. Zgłasza w konsoli powtórzone klucze z różnymi wartościami oraz kolizje tego samego angielskiego tekstu pomiędzy sekcjami. Przed wysłaniem PR usuń niezamierzone rozbieżności.
3. Zwiększ `@version` userscriptu po zmianie `pl.json`. Menedżery userscriptów cache'ują `@resource`, więc bez nowej wersji mogą nadal używać starego słownika.
4. Uruchom `node --check github-pl.user.js` i przeprowadź testy ręczne opisane w README.

## Glosariusz

| Termin źródłowy | Tłumaczenie | Użycie / decyzja |
|---|---|---|
| About | Informacje | Jedna wartość w całym słowniku; silnik spłaszcza sekcje i nie rozróżnia kontekstu. |
| Open / Closed | Otwarte / Zamknięte | Jednolite, bezkolizyjne wartości dla statusów. W pełnych frazach dobieraj rodzaj do rzeczownika, np. „otwarte zgłoszenie”. |
| Starred | Oznaczone gwiazdką | Status elementu oznaczonego gwiazdką, nie obserwowanie profilu. |
| Submit new issue | Utwórz zgłoszenie | Etykieta działania tworzącego nowe zgłoszenie. |
| Squash and merge | Scal (squash) | Zachowujemy nazwę techniki squash; nie dodajemy drugiego „i połącz”. |
| Development | Powiązane | Sekcja issue/PR z powiązanymi elementami deweloperskimi. |
| Trending | Popularne | Krótka etykieta nawigacyjna. |
| Watch / Unwatch | Śledź / Przestań śledzić | Ustawienie powiadomień o aktywności repozytorium. |
| Watchers | Obserwujący repozytorium | Osoby śledzące powiadomienia repozytorium; odróżnia etykietę Watchers od Followers. |
| Follow / Unfollow | Obserwuj / Przestań obserwować | Relacja między profilami. |
| Followers | Obserwujący | Liczby followers odmieniają się jako „1 obserwujący”, „2 obserwujących”, „5 obserwujących”; bez dopisku „profil”. |
| New | brak ogólnego wpisu | Rodzaj zależy od rzeczownika („nowe zgłoszenie”, „nowy projekt”); tłumacz pełne frazy. |
| on | brak ogólnego wpisu | Tłumacz wyłącznie w kontekstowym wzorcu daty, nigdy jako samodzielne słowo. |

W słowniku nie należy używać identycznych angielskich kluczy dla różnych znaczeń, jeśli ich tłumaczenia muszą się różnić. Obecny silnik ma płaski słownik, więc kolizje sekcji nie są rozstrzygane przez kontekst.

## Bezpieczeństwo i zakres tłumaczeń

Nie tłumaczymy tekstu użytkownika, kodu, zawartości plików, nazw repozytoriów, gałęzi, plików i katalogów ani tytułów issue/PR. Nowe wyjątki dodawaj do `EXCLUDE_SELECTORS` w `github-pl.user.js`, wraz z komentarzem opisującym chronioną treść. Zmiany DOM muszą zachować ochronę dla potomków wykluczonych kontenerów.

Nie dodawaj zależności, zewnętrznych API tłumaczących ani żądań wysyłających dane użytkownika. Projekt ma działać w czystym JavaScripcie.

## Testy ręczne

- Strona główna, repozytorium, Issues, pull request i profil.
- W repozytorium pliki/katalogi o nazwach `Docs`, `Settings` i `License` oraz nazwy repozytoriów i branchy pozostają bez zmian.
- Dodanie/zmiana treści wewnątrz `.markdown-body` i `pre` nie tłumaczy tej treści.
- W istniejącym węźle tekstowym sprawdź `Open` → `Closed` → `Merged`.
- Liczniki: `1 star`, `2 stars`, `12 stars`, `22 stars`, `1,234 stars` (twarda spacja w wyniku), `1.2k stars`, `12k stars`.
- Daty: `on Oct 3` → `3 października`; `on Oct 3, 2023` → `3 października 2023`.
- Rescan 20 tys. nieprzetłumaczonych węzłów: sprawdź, że ponowny skan nie wykonuje ponownie słownika/wzorców dla niezmienionych węzłów.
- Nie powinno być błędów w konsoli.

## Pull requesty i issue

W zgłoszeniu błędu dodaj stronę, kroki reprodukcji i zrzut ekranu, jeśli to możliwe. W PR dołącz zmieniony `pl.json`, wynik synchronizacji w `github-pl.user.js` i informację o wykonanych testach.
