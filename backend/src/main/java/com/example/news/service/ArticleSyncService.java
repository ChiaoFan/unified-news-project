package com.example.news.service;

import com.example.news.model.Article;
import com.example.news.model.ArticleEntity;
import com.example.news.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;


import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;

@Service
public class ArticleSyncService {
    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        // perform an initial sync when the app starts
        performSync();
    }

    private final GnewsService gnewsService;
    private final ArticleRepository repository;

    @Autowired
    public ArticleSyncService(GnewsService gnewsService, ArticleRepository repository) {
        this.gnewsService = gnewsService;
        this.repository = repository;
    }

    // run every 3 hours (cron: second minute hour day-of-month month day-of-week)
    @Scheduled(cron = "0 0 */3 * * *")
    public void sync() {
        performSync();
    }

    // helper used by scheduler and manual calls
    public void performSync() {
        try {
            System.out.println("starting article sync...");
            List<Article> fetched = gnewsService.fetchArticles("Germany");
            for (Article a : fetched) {
                repository.findByUrl(a.getUrl()).orElseGet(() -> {
                    ArticleEntity ent = new ArticleEntity();
                    ent.setTitle(a.getTitle());
                    ent.setDescription(a.getDescription());
                    ent.setUrl(a.getUrl());
                    ent.setImage(a.getImage());
                    if (a.getPublishedAt() != null) {
                        ent.setPublishedAt(ZonedDateTime.parse(a.getPublishedAt()));
                    }
                    if (a.getSource() != null) {
                        ent.setSourceName(a.getSource().getName());
                    }
                    return repository.save(ent);
                });
            }
            System.out.println("article sync complete, total stored: " + repository.count());
        } catch (Exception ex) {
            System.err.println("sync error: " + ex.getMessage());
        }
    }
//write a method that can manually trigger the sync, which can be called from a REST controller for testing purposes
    public String triggerManualSync() {
        performSync();
        return "Manual sync triggered. Check logs for details.";
    }

}
