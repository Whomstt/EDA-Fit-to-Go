package com.fit_to_go.spring_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fit_to_go.spring_backend.entity.Comment;
import com.fit_to_go.spring_backend.entity.Post;
import com.fit_to_go.spring_backend.kafka.PostEventPublisher;
import com.fit_to_go.spring_backend.repository.CommentRepository;
import com.fit_to_go.spring_backend.repository.PostRepository;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostEventPublisher postEventPublisher;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public PostController(PostEventPublisher postEventPublisher, PostRepository postRepository, CommentRepository commentRepository) {
        this.postEventPublisher = postEventPublisher;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/all")
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByIdAsc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Comment> comments = commentRepository.findByPostId(id);
        return ResponseEntity.ok(comments);
    }

    private ResponseEntity<String> modifyPostCount(Long id, String action, String type) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            postEventPublisher.publishPostEvent(id, action, type);
            return ResponseEntity.ok("Event published: " + action + ":" + type);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("{id}/increment/likecount")
    public ResponseEntity<String> incrementLikeCount(@PathVariable Long id) {
        return modifyPostCount(id, "increment", "likecount");
    }

    @PutMapping("{id}/decrement/likecount")
    public ResponseEntity<String> decrementLikeCount(@PathVariable Long id) {
        return modifyPostCount(id, "decrement", "likecount");
    }

    @PutMapping("{id}/increment/sharecount")
    public ResponseEntity<String> incrementShareCount(@PathVariable Long id) {
        return modifyPostCount(id, "increment", "sharecount");
    }

    @PutMapping("{id}/increment/commentcount")
    public ResponseEntity<String> incrementCommentCount(@PathVariable Long id) {
        return modifyPostCount(id, "increment", "commentcount");
    }
}
