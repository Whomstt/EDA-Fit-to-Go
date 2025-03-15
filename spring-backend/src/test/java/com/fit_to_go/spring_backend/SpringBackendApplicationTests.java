package com.fit_to_go.spring_backend;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fit_to_go.spring_backend.entity.Comment;
import com.fit_to_go.spring_backend.entity.Post;
import com.fit_to_go.spring_backend.kafka.PostEventPublisher;
import com.fit_to_go.spring_backend.repository.CommentRepository;
import com.fit_to_go.spring_backend.repository.PostRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fit_to_go.spring_backend.controller.PostController;

@WebMvcTest(PostController.class)
class SpringBackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostEventPublisher postEventPublisher;

    @MockBean
    private PostRepository postRepository;

    @MockBean
    private CommentRepository commentRepository;

    private static final ObjectMapper mapper = new ObjectMapper();

    @Test
    void testGetAllPosts() throws Exception {
        Post post1 = new Post();
        post1.setId(1L);
        Post post2 = new Post();
        post2.setId(2L);

        when(postRepository.findAllByOrderByIdAsc()).thenReturn(Arrays.asList(post1, post2));

        mockMvc.perform(get("/api/post/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testGetPostByIdFound() throws Exception {
        Post post = new Post();
        post.setId(1L);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        mockMvc.perform(get("/api/post/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testGetPostByIdNotFound() throws Exception {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/post/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testIncrementLikeCount() throws Exception {
        Post post = new Post();
        post.setId(1L);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        mockMvc.perform(put("/api/post/1/increment/likecount"))
                .andExpect(status().isOk())
                .andExpect(content().string("Event published: increment:likecount"));

        verify(postEventPublisher).publishPostEvent(1L, "increment", "likecount");
    }

    @Test
    void testAddComment() throws Exception {
        Post post = new Post();
        post.setId(1L);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        Comment commentRequest = new Comment();
        commentRequest.setComment("Test comment");

        Comment savedComment = new Comment();
        savedComment.setId(1L);
        savedComment.setComment("Test comment");
        savedComment.setPost(post);

        when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

        String json = mapper.writeValueAsString(commentRequest);

        mockMvc.perform(post("/api/post/1/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.comment").value("Test comment"));

        verify(postEventPublisher).publishPostEvent(1L, "increment", "commentcount");
        verify(postEventPublisher).publishCommentEvent(savedComment);
    }
}
