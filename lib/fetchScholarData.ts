import axios from "axios";

export interface ScholarData {
  name: string;
  affiliation: string;
  publications: Array<{
    title: string;
    authors: string;
    year: string;
    citations: number;
  }>;
  totalCitations: number;
  hIndex: number;
  topics: string[];
}
export async function fetchScholarData(
  scholarName: string
): Promise<ScholarData> {
  const apiKey = process.env.NEXT_PUBLIC_SERPAPI_KEY;

  const response = await axios.get("https://serpapi.com/search.json", {
    params: {
      engine: "google_scholar",
      q: scholarName,
      api_key: apiKey,
    },
  });

  const data = response.data;

  const author = data.author;
  const articles = data.articles || [];

  return {
    name: author.name,
    affiliation: author.affiliations,
    totalCitations: parseInt(author.cited_by.table[0].citations.all || "0"),
    hIndex: parseInt(author.cited_by.table[1].h_index.all || "0"),
    topics: author.interests.map((i: any) => i.title),
    publications: articles.map((a: any) => ({
      title: a.title,
      authors: a.authors,
      year: a.year,
      citations: a.cited_by?.value || 0,
    })),
  };
}
