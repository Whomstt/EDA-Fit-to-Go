package com.fit_to_go.spring_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fit_to_go.spring_backend.repository.PostRepository;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("count/{field}")
    public int getFieldCount(@PathVariable String field) {
        return postRepository.findById(1L)
                .map(post -> switch (field) {
                    case "likes" -> post.getLikecount();
                    case "comments" -> post.getCommentcount();
                    case "shares" -> post.getSharecount();
                    default -> 0;
                })
                .orElse(0);
    }

    @PostMapping("increment/{field}")
    public void incrementField(@PathVariable String field) {
        postRepository.findById(1L).ifPresent(post -> {
            switch (field) {
                case "likes" -> post.setLikecount(post.getLikecount() + 1);
                case "comments" -> post.setCommentcount(post.getCommentcount() + 1);
                case "shares" -> post.setSharecount(post.getSharecount() + 1);
            }
            postRepository.save(post);
        });
    }
}
