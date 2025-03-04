package com.fit_to_go.spring_backend.controller;

import java.util.Comparator;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
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
        return postRepository.findAll()
                            .stream()
                            .sorted(Comparator.comparingLong(Post::getId))
                            .toList();
    }


    @PutMapping("{id}/increment/{type}")
    public Post incrementCount(@PathVariable Long id, @PathVariable String type) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        switch (type.toLowerCase()) {
            case "likecount" -> post.setLikeCount(post.getLikeCount() + 1);
            case "commentcount" -> post.setCommentCount(post.getCommentCount() + 1);
            case "sharecount" -> post.setShareCount(post.getShareCount() + 1);
            default -> throw new RuntimeException("Invalid type");
        }
        return postRepository.save(post);
    }
}
