package com.fit_to_go.spring_backend.kafka;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.fit_to_go.spring_backend.entity.Post;
import com.fit_to_go.spring_backend.repository.PostRepository;

public class PostEventListenerTests {

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostEventListener postEventListener;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        postEventListener = new PostEventListener(postRepository);
    }

    @Test
    public void testListenPostIncrementLikeCountEvent() {
        Post post = new Post();
        post.setId(1L);
        post.setLikeCount(5);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        String message = "1:increment:likecount";
        postEventListener.listenEvent(message, "post-events-topic");

        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).save(post);
        assert post.getLikeCount() == 6;
    }

    @Test
    public void testListenPostDecrementLikeCountEvent() {
        Post post = new Post();
        post.setId(1L);
        post.setLikeCount(5);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        String message = "1:decrement:likecount";
        postEventListener.listenEvent(message, "post-events-topic");

        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).save(post);
        assert post.getLikeCount() == 4;
    }

    @Test
    public void testListenPostIncrementShareCountEvent() {
        Post post = new Post();
        post.setId(2L);
        post.setShareCount(3);

        when(postRepository.findById(2L)).thenReturn(Optional.of(post));

        String message = "2:increment:sharecount";
        postEventListener.listenEvent(message, "post-events-topic");

        verify(postRepository, times(1)).findById(2L);
        verify(postRepository, times(1)).save(post);
        assert post.getShareCount() == 4;
    }

    @Test
    public void testListenPostIncrementCommentCountEvent() {
        Post post = new Post();
        post.setId(3L);
        post.setCommentCount(7);

        when(postRepository.findById(3L)).thenReturn(Optional.of(post));

        String message = "3:increment:commentcount";
        postEventListener.listenEvent(message, "post-events-topic");

        verify(postRepository, times(1)).findById(3L);
        verify(postRepository, times(1)).save(post);
        assert post.getCommentCount() == 8;
    }

    @Test
    public void testListenPostDecrementInvalidTypeEvent() {
        Post post = new Post();
        post.setId(4L);
        post.setLikeCount(10);
        post.setShareCount(5);

        when(postRepository.findById(4L)).thenReturn(Optional.of(post));

        String message = "4:decrement:sharecount";

        try {
            postEventListener.listenEvent(message, "post-events-topic");
            assert false : "Expected RuntimeException for invalid type in decrement action";
        } catch (RuntimeException e) {
            assert e.getMessage().contains("Invalid type");
        }

        verify(postRepository, times(1)).findById(4L);
        verify(postRepository, never()).save(any());
    }

    @Test
    public void testListenCommentEvent() throws Exception {
        String commentJson = "{\"id\":1,\"comment\":\"Test Comment\"}";

        postEventListener.listenEvent(commentJson, "comment-events-topic");

        verify(postRepository, never()).findById(any());
        verify(postRepository, never()).save(any());
    }

    @Test
    public void testListenCommentEventJsonParsingError() {
        String invalidJson = "invalid-json-format";

        postEventListener.listenEvent(invalidJson, "comment-events-topic");

        verify(postRepository, never()).findById(any());
        verify(postRepository, never()).save(any());
    }

    @Test
    public void testListenUnknownTopic() {
        String message = "test-message";

        postEventListener.listenEvent(message, "unknown-topic");

        verify(postRepository, never()).findById(any());
        verify(postRepository, never()).save(any());
    }

    @Test
    public void testInvalidPostAction() {
        String message = "1:invalid:likecount";

        when(postRepository.findById(1L)).thenReturn(Optional.of(new Post()));

        try {
            postEventListener.listenEvent(message, "post-events-topic");
            assert false : "Expected RuntimeException for invalid action";
        } catch (RuntimeException e) {
            assert e.getMessage().contains("Invalid action: invalid");
        }

        verify(postRepository, times(1)).findById(1L);
    }

    @Test
    public void testInvalidPostTypeForIncrement() {
        String message = "1:increment:invalid";

        when(postRepository.findById(1L)).thenReturn(Optional.of(new Post()));

        try {
            postEventListener.listenEvent(message, "post-events-topic");
            assert false : "Expected RuntimeException for invalid type";
        } catch (RuntimeException e) {
            assert e.getMessage().contains("Invalid type: invalid");
        }

        verify(postRepository, times(1)).findById(1L);
    }

    @Test
    public void testPostNotFound() {
        String message = "999:increment:likecount";

        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        try {
            postEventListener.listenEvent(message, "post-events-topic");
            assert false : "Expected RuntimeException for post not found";
        } catch (RuntimeException e) {
            assert e.getMessage().contains("Post not found");
        }

        verify(postRepository, times(1)).findById(999L);
    }
}
