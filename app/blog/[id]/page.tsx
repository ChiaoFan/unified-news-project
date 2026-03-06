interface Article {
  id: string;
    url: string;
  title: string;
  description: string;
  image: string;
}

interface PageParams {
  id: string;
}

export default async function ArticlePage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params;

  const rest = await fetch(`http://localhost:8080/articles`, {
    cache: "force-cache"
  });
  const news: Article[] = await rest.json();

  return (<div><h1>Article {resolvedParams.id}</h1>
  
  <div>{news.map( (n: Article) => (
    <div key={n.url}>
      <h2>{n.title}</h2>
      <p>{n.description}</p>
      <img
                      src={n.image}
                      alt={n.title}
                      className="h-40 w-full object-cover"
                    />
    </div>
  ))}</div>
  
  
  </div>)


}