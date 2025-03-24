package com.fit_to_go.spring_backend.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class CommentTests {

    @Test
    void testGettersAndSetters() {
        Comment comment = new Comment();
        Post post = new Post();

        comment.setId(1L);
        assertEquals(1L, comment.getId());

        comment.setPost(post);
        assertEquals(post, comment.getPost());

        comment.setComment("This is a test comment");
        assertEquals("This is a test comment", comment.getComment());
    }
}
