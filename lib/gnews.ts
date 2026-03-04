// this module exports the Article type so frontend and backend use a common shape
export interface Article {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
}

// fetch articles from our Java backend service
export async function fetchArticles(): Promise<Article[]> {
  // adjust host/port if running elsewhere or via proxy
  const url = process.env.BACKEND_URL || "http://localhost:8080/articles";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// search articles by keyword using GNews API
export async function searchArticles(keyword: string): Promise<Article[]> {
  if (!keyword || keyword.trim().length === 0) {
    return [];
  }
  const baseUrl = process.env.BACKEND_URL || "http://localhost:8080";
  const url = new URL("/articles/search", baseUrl);
  url.searchParams.set("q", keyword);
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Search request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
