"use client";

import { useState, useEffect } from "react";
import { Article, fetchArticles, searchArticles } from "../lib/gnews";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LanguageIcon from "@mui/icons-material/Language";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
        setErrorMessage("");
      } catch (error) {
        console.error("Initial load failed:", error);
        setErrorMessage("Could not load news. Please check backend connection.");
      } finally {
        setLoading(false);
      }
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
      setErrorMessage("");
    } catch (error) {
      console.error("Search failed:", error);
      setArticles([]);
      setErrorMessage("Search failed. Please try another keyword.");
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
      setErrorMessage("");
    } catch (error) {
      console.error("Reset failed:", error);
      setErrorMessage("Could not reload latest news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 5 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ color: "text.primary", mb: 0.5 }}>
              Chiao's Unified News Dashboard
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Read the latest global news in one place, powered by GNews API.
            </Typography>
          </Box>

          <Stack
            component="form"
            onSubmit={handleSearch}
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
          >
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news by keyword"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.paper",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9A9A9A" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              startIcon={<RestartAltIcon />}
              sx={{ borderColor: "primary.main", color: "primary.main" }}
            >
              Reset
            </Button>
          </Stack>

          {errorMessage ? <Alert severity="warning">{errorMessage}</Alert> : null}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          ) : articles.length === 0 ? (
            <Alert severity="info">No articles available.</Alert>
          ) : (
            <>
              <Chip
                icon={<LanguageIcon />}
                label={`${articles.length} articles`}
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: "background.paper",
                  color: "#9A9A9A",
                }}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2.5,
                }}
              >
                {articles.map((article) => (
                  <Card key={article.url} elevation={0} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    {article.image ? (
                      <CardMedia component="img" image={article.image} alt={article.title} sx={{ height: 210 }} />
                    ) : null}

                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.25, flex: 1 }}>
                      <Link
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{
                          fontWeight: 700,
                          lineHeight: 1.3,
                          fontSize: "1.2rem",
                          color: "primary.main",
                          "&:active": { color: "primary.dark" },
                        }}
                      >
                        {article.title}
                      </Link>

                      <Typography
                        sx={{
                          color: "text.primary",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.description || "Open the article to read more."}
                      </Typography>

                      <Stack direction="row" justifyContent="space-between" sx={{ mt: "auto", pt: 1 }}>
                        <Typography variant="caption" sx={{ color: "#9A9A9A" }}>
                          {article.source?.name || "Unknown source"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6B6B6B" }}>
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString()
                            : "Unknown date"}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
