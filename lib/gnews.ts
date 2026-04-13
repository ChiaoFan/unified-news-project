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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  console.log("baseUrl" + baseUrl);
  const url = new URL("/articles", baseUrl);
  const res = await fetch(url.toString());
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const url = new URL("/articles/search", baseUrl);
  url.searchParams.set("q", keyword);
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Search request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
