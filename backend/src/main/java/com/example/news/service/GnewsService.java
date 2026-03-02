package com.example.news.service;

import com.example.news.model.Article;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class GnewsService {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gnews.api.key}")
    private String apiKey;

    public List<Article> fetchArticles(String query, int max) {
        // GNews caps at 100 results; avoid requesting more than that.
        int effective = Math.min(max, 100);
        String url = String.format(
                "https://gnews.io/api/v4/search?q=%s&lang=en&max=%d&token=%s",
                query, effective, apiKey);
        try {
            GnewsResponse response = restTemplate.getForObject(url, GnewsResponse.class);
            if (response == null || response.getArticles() == null) {
                return List.of();
            }
            return Arrays.asList(response.getArticles());
        } catch (Exception ex) {
            // log and return empty list to avoid bubbling 500
            System.err.println("error fetching from Gnews: " + ex.getMessage());
            return List.of();
        }
    }
}
