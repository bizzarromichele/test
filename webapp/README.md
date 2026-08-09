# Il Fanta secondo Michele Bizzarro

Web app privata per Fanta Piroetta 2026/27.

## Beta live
https://dnvdlronlejcjqjvrzix.supabase.co/functions/v1/fanta-app

## Funzioni beta
- registrazione e login con username/password
- massimo 10 account
- 492 giocatori con prezzi del listone Leghe FC ricostruito dai video
- mercato con ricerca, filtri e ordinamento
- rosa personale con budget 250 e vincoli 3P/8D/8C/6A
- salvataggio dati per singolo utente
- formazione su campo con moduli consentiti dalla lega
- analisi con Fanta Rating e indice bonus beta

## Architettura
- GitHub: repository e sviluppo
- Supabase Auth/Postgres/RLS: autenticazione e dati separati per utente
- Supabase Edge Function: hosting della beta e endpoint di registrazione

Gli indici bonus sono stime beta e non probabilità certe. Saranno raffinati con storico 2025/26, titolarità, rigori, assist, calendario e infortuni.
