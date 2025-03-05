package com.fit_to_go.spring_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fit_to_go.spring_backend.entity.Post;
import com.fit_to_go.spring_backend.kafka.PostEventPublisher;
import com.fit_to_go.spring_backend.repository.PostRepository;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostEventPublisher postEventPublisher;
    private final PostRepository postRepository;

    public PostController(PostEventPublisher postEventPublisher, PostRepository postRepository) {
        this.postEventPublisher = postEventPublisher;
        this.postRepository = postRepository;
    }

    @GetMapping("/all")
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByIdAsc();
    }

    private ResponseEntity<String> incrementPostCount(Long id, String type) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            postEventPublisher.publishPostEvent(id, type);
            return ResponseEntity.ok("Event published: " + type);
        } else {
            return ResponseEntity.notFound().build();  // Return 404 if the post is not found
        }
    }

    @PutMapping("{id}/increment/likecount")
    public ResponseEntity<String> incrementLikeCount(@PathVariable Long id) {
        return incrementPostCount(id, "likecount");
    }

    @PutMapping("{id}/increment/commentcount")
    public ResponseEntity<String> incrementCommentCount(@PathVariable Long id) {
        return incrementPostCount(id, "commentcount");
    }

    @PutMapping("{id}/increment/sharecount")
    public ResponseEntity<String> incrementShareCount(@PathVariable Long id) {
        return incrementPostCount(id, "sharecount");
    }
}
