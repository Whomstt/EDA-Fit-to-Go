package com.fit_to_go.spring_backend.entity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class PostTests {

    @Test
    void testGettersAndSetters() {
        Post post = new Post();
        List<Comment> comments = new ArrayList<>();

        post.setId(1L);
        assertEquals(1L, post.getId());

        post.setTitle("Test Title");
        assertEquals("Test Title", post.getTitle());

        post.setLikeCount(10);
        assertEquals(10, post.getLikeCount());

        post.setCommentCount(5);
        assertEquals(5, post.getCommentCount());

        post.setShareCount(3);
        assertEquals(3, post.getShareCount());

        post.setComments(comments);
        assertEquals(comments, post.getComments());
    }
}
