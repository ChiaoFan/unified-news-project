"use client";

import { useState, useEffect } from "react";
import { Article, fetchArticles, searchArticles } from "../lib/gnews";

// async function loadArticles(): Promise<Article[]> {
//   // when executed on the server (Node) a relative path won't work; build
//   // an absolute URL using an env variable or localhost fallback.
//   const baseUrl = `http://localhost:8080/articles`;
//   const res = await fetch(baseUrl);
//   if (!res.ok) throw new Error("Failed to load");
//   return res.json();
// }

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchArticles();
      setArticles(data);
      setLoading(false);
    };
    loadArticles();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchArticles(searchQuery);
      setArticles(results);
    } catch (error) {
      console.error("Search failed:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSearchQuery("");
    setLoading(true);
    try {
      const data = await fetchArticles();
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles;

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-start justify-start py-4 px-8 bg-white dark:bg-black">
        <header className="w-full mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-zinc-50">
            Unified English News
          </h1>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            A dashboard aggregating English articles with your search.
          </p>
          
          <form onSubmit={handleSearch} className="mt-6 flex gap-2">
            <input
              type="text"
              placeholder="Search news by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 text-white px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-slate-300 text-slate-800 px-4 py-2 font-medium hover:bg-slate-400"
              >
                Reset
              </button>
            )}
          </form>
        </header>

        <section className="w-full">
          {articles.length === 0 ? (
            <p className="text-center text-slate-500">No articles available.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, articles.length).map((a) => (
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
