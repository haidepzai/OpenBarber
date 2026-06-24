# AGENT.md – OpenBarber

## Projektübersicht

OpenBarber ist ein **Reservierungsmanagementsystem für Friseure**. Kunden können Friseurbetriebe in Städten suchen, Termine buchen, Bewertungen abgeben, Betriebe favorisieren und kontaktieren. Friseure werden per E-Mail über neue Termine benachrichtigt.

---

## Architektur

```
openbarber/
├── Backend/          # Spring Boot REST-API (Java 17)
├── Frontend/         # React SPA
├── docker-compose.yml         # Produktion (Port 80 / 8080)
├── docker-compose.dev.yml     # Entwicklung (Port 3000 / 5432 / pgAdmin 5050)
└── pom.xml           # Maven Parent-POM
```

**Stack:** React 18 · Spring Boot 2.7.4 · PostgreSQL 16 · Docker  
**CI/CD:** GitLab CI (`.gitlab-ci.yml`) – Build-Stage für Backend (Maven) und Frontend (npm)

---

## Backend

### Technologien & Bibliotheken
| Bereich | Technologie |
|---|---|
| Framework | Spring Boot 2.7.4, Java 17 |
| Persistenz | Spring Data JPA, Hibernate, PostgreSQL |
| Sicherheit | Spring Security, JWT (jjwt 0.11.5) |
| E-Mail | Spring Mail + MJML-Templates (Thymeleaf) |
| API-Doku | Springfox Swagger 3.0 (`/swagger-ui/`) |
| Rate Limiting | Bucket4j + Caffeine Cache |
| Mapping | ModelMapper |
| Codegen | Lombok |

### Paketstruktur (`com.hdmstuttgart.mi.backend`)
```
controller/   – REST-Endpunkte
service/      – Geschäftslogik
repository/   – Spring Data JPA Repositories
model/        – JPA-Entitäten
  dto/        – Request/Response-DTOs
  enums/      – Aufzählungstypen
mapper/       – Entity ↔ DTO Konvertierung
config/       – Spring-Konfigurationen (Security, CORS, Swagger …)
exception/    – Eigene Exceptions & Exception-Handler
templates/    – E-Mail-Templates
```

### Domain-Modell (Entitäten)
- `Enterprise` – Friseurbetrieb (Logo, Bilder, Öffnungszeiten, Standort)
- `Employee` – Mitarbeiter eines Betriebs
- `Service` – Dienstleistung mit Dauer und Preis
- `Appointment` – Terminbuchung inkl. Bestätigungs-/Stornierungsflow
- `Review` – Bewertung eines Betriebs
- `User` – Kundenkonto (JWT-Auth)

### Wichtige Konfigurationen
- Konfiguration via `Backend/src/main/resources/application.yml`
- Secrets über `.env`-Datei unter `Backend/src/main/resources/.env` (nicht committen!)

Erforderliche Umgebungsvariablen:
```
SPRING_DATASOURCE_PASSWORD=<db-passwort>
JWT_SECRET=<mindestens 32 Zeichen>
MAIL_USERNAME=<smtp-user>
MAIL_PASSWORD=<smtp-passwort>
MJML_APP_ID=<mjml-id>
MJML_APP_KEY=<mjml-key>
APP_FRONTEND_URL=http://localhost:3000   # für CORS
```

### Build & Tests
```bash
# Build (im Backend/-Verzeichnis)
./mvnw clean package

# Tests ausführen
./mvnw test

# Nur Backend lokal starten (DB muss laufen)
./mvnw spring-boot:run
```

Testklassen befinden sich unter `Backend/src/test/` (z. B. `EmployeeServiceTest.java`).

---

## Frontend

### Technologien & Bibliotheken
| Bereich | Technologie |
|---|---|
| Framework | React 18, React Router v6 |
| UI-Komponenten | MUI 5 (Material UI) |
| HTTP-Client | Axios (mit JWT Bearer + Refresh-Token Interceptor) |
| Internationalisierung | i18next (Spracherkennung via Browser) |
| Karten | Google Maps API (`@react-google-maps/api`, `react-google-autocomplete`) |
| Terminplaner | DevExtreme React Scheduler |
| Formatter | Prettier |

### Verzeichnisstruktur (`Frontend/src/`)
```
api/          – apiClient.js (Axios-Instanz + alle API-Funktionen)
components/   – Wiederverwendbare UI-Komponenten
pages/        – Seitenkomponenten (Route-Level)
context/      – React Contexts (Auth, GoogleMaps, TokenStorage)
actions/      – Redux-ähnliche Action-Funktionen
config/       – Konstanten (API-Endpunkte, Timeouts)
hooks/        – Custom React Hooks
layout/       – Layout-Komponenten
themes/       – MUI-Theme-Definitionen
i18n.js       – i18next-Konfiguration
```

### Seiten
| Datei | Beschreibung |
|---|---|
| `LandingPage.jsx` | Startseite mit Suche |
| `FilterPage.jsx` | Suchergebnisliste |
| `DetailPage.jsx` | Betriebsdetailansicht |
| `SchedulerPage.jsx` | Terminbuchungskalender |
| `AppointmentConfirmation.jsx` | Buchungsbestätigung |
| `CancelAppointment.jsx` | Termin stornieren |
| `EditEnterprisePage.jsx` | Betrieb verwalten (Friseur-Dashboard) |
| `ResetPasswordPage.jsx` | Passwort zurücksetzen |

### Umgebungsvariablen (`.env`)
```
REACT_APP_BACKEND_URL=http://localhost:8080/api
REACT_APP_GOOGLE_API=<Google API Key>
REACT_APP_GOOGLE_BASE_URI=https://maps.googleapis.com/maps/api
REACT_APP_GOOGLE_PLACES=https://maps.googleapis.com/maps/api/places
REACT_APP_GOOGLE_GEOCODE=https://maps.googleapis.com/maps/api/geocode
REACT_APP_BACKUP_IMAGE=<Fallback-Bild-URL>
GENERATE_SOURCEMAP=false
```

### Build & Tests
```bash
# Im Frontend/-Verzeichnis
npm ci               # Dependencies installieren
npm start            # Dev-Server starten (Port 3000)
npm run build        # Produktionsbuild
npm test             # Tests ausführen
npm run prettier     # Code formatieren
```

---

## Lokale Entwicklung

### Schnellstart mit Docker (empfohlen)
```bash
# Produktion (Frontend :80, Backend :8080)
docker-compose -f docker-compose.yml up

# Entwicklung (DB :5432, pgAdmin :5050, Frontend :3000)
docker-compose -f docker-compose.dev.yml up -d
```

### Seed-Daten
Das Backend lädt beim Start automatisch Testdaten (`Backend/src/main/resources/data.sql`).  
Seed-Passwort für alle Testnutzer: **`OpenBarber123!`**

### Hinweis: mvnw auf Unix
Falls `./mvnw` nicht ausführbar ist (Windows-Zeilenenden):
```bash
vim mvnw   # :set fileformat=unix → :wq!
```

---

## Authentifizierung

- JWT-basiert: Access Token + Refresh Token
- Token-Refresh erfolgt automatisch im `apiClient.js`-Interceptor bei HTTP 401
- Bei fehlgeschlagenem Refresh: Tokens werden gelöscht, Redirect auf `/`
- Geschützte API-Endpunkte erwarten `Authorization: Bearer <token>`

---

## Konventionen & Hinweise für KI-Agenten

- **Backend-Änderungen** immer im Paket `com.hdmstuttgart.mi.backend` platzieren
- **DTOs** für alle API-Requests/Responses verwenden – Entitäten nie direkt exponieren
- **Neue REST-Endpunkte** in bestehende Controller-Klassen einfügen; Service-Logik in den `service/`-Layer
- **Frontend-API-Aufrufe** ausschließlich über `Frontend/src/api/apiClient.js` (kein direktes axios-Aufrufen in Komponenten)
- **Keine Secrets** in den Code committen – alle sensiblen Werte über `.env`-Dateien
- **Prettier** vor dem Commit auf geänderte `.js`/`.jsx`-Dateien ausführen: `npm run prettier`
- **Tests** nach Backend-Änderungen: `./mvnw test`
- **Swagger UI** ist unter `http://localhost:8080/swagger-ui/` erreichbar (lokal)
