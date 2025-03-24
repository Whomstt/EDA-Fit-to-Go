package com.fit_to_go.spring_backend.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fit_to_go.spring_backend.entity.Comment;

@Service
public class PostEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private static final Logger logger = LoggerFactory.getLogger(PostEventPublisher.class);

    public PostEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishPostEvent(Long postId, String action, String type) {
        String message = postId + ":" + action + ":" + type;
        logger.info("Publishing event to Kafka: {}", message);
        kafkaTemplate.send("post-events-topic", message);
    }

    public void publishCommentEvent(Comment comment) {
        try {
            String commentMessage = objectMapper.writeValueAsString(comment);
            logger.info("Publishing comment event to Kafka: {}", commentMessage);
            kafkaTemplate.send("comment-events-topic", commentMessage);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            logger.error("Error serializing comment event", e);
        }
    }
}
