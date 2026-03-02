import Image from "next/image";
import { Article } from "../lib/gnews";

async function loadArticles(): Promise<Article[]> {
  // when executed on the server (Node) a relative path won't work; build
  // an absolute URL using an env variable or localhost fallback.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/articles`);
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export default async function Home() {
  const articles: Article[] = await loadArticles();

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-start justify-start py-4 px-8 bg-white dark:bg-black">
        <header className="w-full mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-zinc-50">
            Unified German News
          </h1>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            A dashboard aggregating English articles about Germany.
          </p>
        </header>

        <section className="w-full">
          {articles.length === 0 ? (
            <p className="text-center text-slate-500">No articles available.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 60).map((a) => (
                <li
                  key={a.url}
                  className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm"
                >
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 hover:underline"
                    >
                      {a.title}
                    </a>
                    <p className="mt-2 flex-1 text-sm text-slate-700">
                      {a.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(a.publishedAt).toLocaleDateString()}</span>
                      <span>{a.source?.name}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
