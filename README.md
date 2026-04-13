# Unified News Project

Unified News Project is a full-stack news aggregation app built with Next.js, Spring Boot, and PostgreSQL. The backend fetches articles from GNews on startup and every 3 hours, stores them in Postgres, and serves them to the frontend.

## Architecture

The application runs as 3 services:

- **Frontend**: Next.js 
- **Backend**: Spring Boot 
- **Database**: PostgreSQL 15 

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Spring Boot 3.1 (Java 21)
- PostgreSQL 15
- Docker Compose

## Quick Start (Docker)

### Prerequisites

- Docker Desktop (or Docker Engine + Compose)
- GNews API key from [https://gnews.io](https://gnews.io)

### 1) Create required Docker volume (first run only)

```bash
docker volume create news_pgdata
```

### 2) Create environment file

Create `.env` in project root:

```bash
GNEWS_API_KEY=your_api_key_here
```

### 3) Build and start services

```bash
docker compose up --build
```

Detached mode:

```bash
docker compose up --build -d
```

### 4) Access services

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

### 5) Stop services

```bash
docker compose down
```

## Local Development (Without Docker)

### Prerequisites

- Node.js 18+
- Java 21+
- Maven 3.9+
- PostgreSQL running locally

### 1) Backend configuration

Copy the template and set values:

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties
```

In `backend/src/main/resources/application.properties`, configure:

- `GNEWS_API_KEY`
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`

### 2) Start backend

```bash
cd backend
mvn spring-boot:run
```

### 3) Start frontend

From project root:

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:3000` in local dev mode.

## API Endpoints

Base URL (Docker): `http://localhost:8080`

- `GET /articles` → returns stored articles (most recent first, max 60)
- `GET /articles/search?q=<query>` → fetches live results from GNews

Example:

```bash
curl "http://localhost:8080/articles/search?q=technology"
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GNEWS_API_KEY` | Yes | API key used by backend to fetch news |

## Useful Commands

From project root:

```bash
# start all services
docker compose up --build

# stop and remove containers
docker compose down

# view running containers
docker ps

# stream compose logs
docker compose logs -f
```

Frontend only:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Troubleshooting

- **Missing API key**: ensure `.env` exists and contains `GNEWS_API_KEY=...`
- **Port conflicts**: check if ports `3000`, `8080`, or `5432` are already in use
- **Database persistence**: data is stored in Docker volume `news_pgdata`

## Project Structure

- `app/` — Next.js frontend pages and styles
- `backend/` — Spring Boot backend service
- `docker-compose.yml` — multi-service local orchestration
