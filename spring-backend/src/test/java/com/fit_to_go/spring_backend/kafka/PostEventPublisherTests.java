package com.fit_to_go.spring_backend.kafka;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fit_to_go.spring_backend.entity.Comment;

class PostEventPublisherTests {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PostEventPublisher postEventPublisher;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        postEventPublisher = new PostEventPublisher(kafkaTemplate, objectMapper);
    }

    @Test
    void testPublishPostEvent() {
        Long postId = 1L;
        String action = "increment";
        String type = "likecount";

        postEventPublisher.publishPostEvent(postId, action, type);

        String expectedMessage = postId + ":" + action + ":" + type;
        verify(kafkaTemplate, times(1)).send("post-events-topic", expectedMessage);
    }

    @Test
    void testPublishCommentEvent() throws JsonProcessingException {
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setComment("Test comment");

        String commentMessage = "{\"id\":1,\"comment\":\"Test comment\"}";
        when(objectMapper.writeValueAsString(comment)).thenReturn(commentMessage);

        postEventPublisher.publishCommentEvent(comment);

        verify(kafkaTemplate, times(1)).send("comment-events-topic", commentMessage);
    }

    @Test
    void testPublishCommentEventWithSerializationError() throws JsonProcessingException {
        Comment comment = new Comment();

        when(objectMapper.writeValueAsString(any(Comment.class))).thenThrow(new JsonProcessingException("Test Exception") {});

        postEventPublisher.publishCommentEvent(comment);

        verify(kafkaTemplate, never()).send(anyString(), anyString());
    }
}
