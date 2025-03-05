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

        String[] messageParts = message.split(":");
        Long postId = Long.valueOf(messageParts[0]);
        String type = messageParts[1];

        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        switch (type.toLowerCase()) {
            case "likecount" -> post.setLikeCount(post.getLikeCount() + 1);
            case "commentcount" -> post.setCommentCount(post.getCommentCount() + 1);
            case "sharecount" -> post.setShareCount(post.getShareCount() + 1);
            default -> throw new RuntimeException("Invalid event type");
        }

        logger.info("Updated post: {}", post);

        postRepository.save(post);
    }
}
