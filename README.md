# OpinionBoard

OpinionBoard is a small web app where people share short opinions and vote them up or down. Posts are anonymous-style: you only enter a name, a title and the opinion text. The frontend is built with React 19 and TypeScript, and the data is stored by a separate Express backend.

## Highlights

- Share an opinion with a name, a title and a text of 10 to 300 characters
- Validation with a list of errors; the form keeps what you typed when something is wrong
- Upvote and downvote with instant feedback: the counter changes before the server answers
- Buttons are disabled while a request is running, and the submit button shows its own pending state
- Shared state through React context, so any component can read and change opinions

## Built With

- React 19
- TypeScript
- Vite
- Express (backend, plain JavaScript)
- Vercel for the frontend and Render for the backend

## How It Works

The app uses the form features of React 19:

| Feature | Where | What it does |
|---|---|---|
| `useActionState` | `NewOpinion.tsx` | Runs the validation and the submit as a form action, and returns errors and entered values |
| `useFormStatus` | `Submit.tsx` | Reads the pending state of the parent form without extra props |
| `useOptimistic` | `Opinion.tsx` | Shows the new vote count immediately and settles it when the request finishes |
| `use` with context | `Opinions.tsx`, `Opinion.tsx`, `NewOpinion.tsx` | Reads the opinions context |
| Context as a provider | `opinions-context.tsx` | `<OpinionsContext value={...}>` without `.Provider` |

All requests to the backend live in `opinions-context.tsx`. Components never call `fetch` directly.

## Run Locally

You need Node.js 18 or newer and npm. The frontend and the backend run at the same time, so use two terminals.

**Backend**

```
cd backend
npm install
npm start
```

The API starts at http://localhost:3000.

**Frontend** (from the project root)

```
npm install
npm run dev
```

The app opens at http://localhost:5173.

## Environment Variables

| Name | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | Address of the backend, without a slash at the end |

For a different backend locally, create a `.env` file in the project root:

```
VITE_API_URL=https://your-backend.onrender.com
```

The backend reads `PORT` from the environment and falls back to 3000.

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/opinions` | Returns all opinions, newest first |
| `POST` | `/opinions` | Creates an opinion from `userName`, `title` and `body` |
| `POST` | `/opinions/:id/upvote` | Adds one vote |
| `POST` | `/opinions/:id/downvote` | Removes one vote |

The backend waits one second before answering write requests, so pending and optimistic states are easy to see.

## Deployment

1. **Backend on Render.** Create a Web Service from the repository with these settings: root directory `backend`, build command `npm install`, start command `npm start`.
2. **Frontend on Vercel.** Import the same repository, keep the project root, and add `VITE_API_URL` with the Render address.
3. Redeploy the frontend after changing the variable, because Vite adds `VITE_` values during the build.

Every push to `main` redeploys both services.

## Project Layout

```
backend/
  app.js              Express server
  db.json             stored opinions
src/
  components/
    Header.tsx        page header
    NewOpinion.tsx    form for a new opinion
    Opinions.tsx      list of opinions
    Opinion.tsx       one opinion with voting
    Submit.tsx        submit button with a pending state
  store/
    opinions-context.tsx   state and requests
  config.ts           backend address
  types.ts            shared types
  App.tsx             root component
  main.tsx            entry point
  index.css           global styles
index.html
tsconfig.json
vite.config.js
```

## Limitations

- The backend keeps data in `db.json` and has no database. On the free Render plan the file system is not persistent, so opinions and votes reset when the service restarts.
- The free Render plan puts the service to sleep after a period of inactivity, so the first request can take up to a minute.
- There are no accounts. Anyone can vote on any opinion as many times as they like.
