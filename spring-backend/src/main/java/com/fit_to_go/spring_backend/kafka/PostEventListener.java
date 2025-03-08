package com.fit_to_go.spring_backend.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fit_to_go.spring_backend.entity.Post;
import com.fit_to_go.spring_backend.repository.PostRepository;

@Service
public class PostEventListener {

    private final PostRepository postRepository;
    private static final Logger logger = LoggerFactory.getLogger(PostEventListener.class);

    public PostEventListener(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @KafkaListener(topics = "post-events-topic", groupId = "post-events-group")
    public void listenPostEvent(String message) {
        logger.info("Received event from Kafka: {}", message);
        
        String[] parts = message.split(":");
        Long postId = Long.valueOf(parts[0]);
        String action = parts[1];
        String type = parts[2];

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

        switch (action.toLowerCase()) {
            case "increment" -> {
                switch (type.toLowerCase()) {
                    case "likecount" -> post.setLikeCount(post.getLikeCount() + 1);                }
            }
            case "decrement" -> {
                switch (type.toLowerCase()) {
                    case "likecount" -> post.setLikeCount(post.getLikeCount() - 1);
                }
            }
            default -> throw new RuntimeException("Invalid action: " + action);
        }

        postRepository.save(post);
        logger.info("Updated post: {}", post);
    }
}
