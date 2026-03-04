package com.example.news.service;

import com.example.news.model.Article;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class GnewsService {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gnews.api.key}")
    private String apiKey;

    public List<Article> fetchArticles(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        String url = UriComponentsBuilder
                .fromHttpUrl("https://gnews.io/api/v4/search")
                .queryParam("q", query)
                .queryParam("lang", "en")
                .queryParam("token", apiKey)
                .build()
                .toUriString();
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
