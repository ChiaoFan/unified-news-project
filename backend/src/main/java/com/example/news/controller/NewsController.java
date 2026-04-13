package com.example.news.controller;

import com.example.news.model.ArticleEntity;
import com.example.news.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NewsController {

    private final ArticleRepository repository;
    private final com.example.news.service.GnewsService gnewsService;
    private final com.example.news.service.ArticleSyncService articleSyncService;

    @Autowired
    public NewsController(ArticleRepository repository,
                          com.example.news.service.GnewsService gnewsService,
                          com.example.news.service.ArticleSyncService articleSyncService) {
        this.repository = repository;
        this.gnewsService = gnewsService;
        this.articleSyncService = articleSyncService;
    }

    @GetMapping("/articles")
    public List<com.example.news.model.Article> getArticles() {
        // return all articles sorted by most recent, converted to DTO
        return repository.findAll().stream()
                .sorted((a, b) -> b.getPublishedAt().compareTo(a.getPublishedAt()))
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/articles/search")
    public List<com.example.news.model.Article> searchArticles(@RequestParam("q") String query) {
        return gnewsService.fetchArticles(query);
    }


    public String triggerSync() {
        articleSyncService.performSync();
        return "sync triggered";
    }

    private com.example.news.model.Article toDto(ArticleEntity ent) {
        com.example.news.model.Article a = new com.example.news.model.Article();
        a.setTitle(ent.getTitle());
        a.setDescription(ent.getDescription());
        a.setUrl(ent.getUrl());
        a.setImage(ent.getImage());
        if (ent.getPublishedAt() != null) {
            a.setPublishedAt(ent.getPublishedAt().toString());
        }
        com.example.news.model.Article.Source src = new com.example.news.model.Article.Source();
        src.setName(ent.getSourceName());
        a.setSource(src);
        return a;
    }
}
