package com.fit_to_go.spring_backend.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fit_to_go.spring_backend.entity.Comment;
import com.fit_to_go.spring_backend.entity.Post;
import com.fit_to_go.spring_backend.repository.PostRepository;

@Service
public class PostEventListener {

    private final PostRepository postRepository;
    private static final Logger logger = LoggerFactory.getLogger(PostEventListener.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PostEventListener(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @KafkaListener(topics = {"post-events-topic", "comment-events-topic"}, groupId = "post-events-group")
    public void listenEvent(String message, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        logger.info("Received event from Kafka on topic {}: {}", topic, message);
        
        switch (topic) {
            case "post-events-topic" -> {
                // Handle post events as before
                String[] parts = message.split(":");
                Long postId = Long.valueOf(parts[0]);
                String action = parts[1];
                String type = parts[2];

                Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));

                switch (action.toLowerCase()) {
                    case "increment" -> {
                        switch (type.toLowerCase()) {
                            case "likecount" -> post.setLikeCount(post.getLikeCount() + 1);
                            case "sharecount" -> post.setShareCount(post.getShareCount() + 1);
                            case "commentcount" -> post.setCommentCount(post.getCommentCount() + 1);
                        }
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
            case "comment-events-topic" -> {
                try {
                    Comment comment = objectMapper.readValue(message, Comment.class);
                    logger.info("Processed comment event: {}", comment);
                } catch (com.fasterxml.jackson.core.JsonParseException | com.fasterxml.jackson.databind.JsonMappingException e) {
                    logger.error("JSON parsing/mapping error processing comment event", e);
                } catch (java.io.IOException e) {
                    logger.error("IO error processing comment event", e);
                }
            }
            default -> logger.warn("Received event from unknown topic: {}", topic);
        }
    }
}
