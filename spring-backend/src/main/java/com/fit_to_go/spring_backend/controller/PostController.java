package com.fit_to_go.spring_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fit_to_go.spring_backend.entity.Post;
import com.fit_to_go.spring_backend.repository.PostRepository;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/all")
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
