package com.fit_to_go.spring_backend.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PostEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final Logger logger = LoggerFactory.getLogger(PostEventPublisher.class);

    public PostEventPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishPostEvent(Long postId, String type) {
        String message = postId + ":" + type;

        logger.info("Publishing event to Kafka: {}", message);

        kafkaTemplate.send("post-events-topic", message);
    }
}
