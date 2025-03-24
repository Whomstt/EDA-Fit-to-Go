package com.fit_to_go.spring_backend.controller;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fit_to_go.spring_backend.entity.Comment;
import com.fit_to_go.spring_backend.entity.Post;
import com.fit_to_go.spring_backend.kafka.PostEventPublisher;
import com.fit_to_go.spring_backend.repository.CommentRepository;
import com.fit_to_go.spring_backend.repository.PostRepository;

public class PostControllerTests {

    @Mock
    private PostEventPublisher postEventPublisher;

    @Mock
    private PostRepository postRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private PostController postController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(postController).build();
    }

    @Test
    public void testGetAllPosts() throws Exception {
        Post post1 = new Post();
        post1.setId(1L);
        Post post2 = new Post();
        post2.setId(2L);

        when(postRepository.findAllByOrderByIdAsc()).thenReturn(Arrays.asList(post1, post2));

        mockMvc.perform(get("/api/post/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));

        verify(postRepository, times(1)).findAllByOrderByIdAsc();
    }

    @Test
    public void testGetPostById() throws Exception {
        Post post = new Post();
        post.setId(1L);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        mockMvc.perform(get("/api/post/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));

        verify(postRepository, times(1)).findById(1L);
    }

    @Test
    public void testIncrementLikeCount() throws Exception {
        Post post = new Post();
        post.setId(1L);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        mockMvc.perform(put("/api/post/1/increment/likecount"))
                .andExpect(status().isOk())
                .andExpect(content().string("Event published: increment:likecount"));

        verify(postRepository, times(1)).findById(1L);
        verify(postEventPublisher, times(1)).publishPostEvent(1L, "increment", "likecount");
    }

    @Test
    public void testAddComment() throws Exception {
        Post post = new Post();
        post.setId(1L);

        Comment comment = new Comment();
        comment.setId(1L);
        comment.setComment("Test Comment");

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        mockMvc.perform(post("/api/post/1/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"comment\": \"Test Comment\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.comment").value("Test Comment"));

        verify(postRepository, times(1)).findById(1L);
        verify(commentRepository, times(1)).save(any(Comment.class));
        verify(postEventPublisher, times(1)).publishPostEvent(1L, "increment", "commentcount");
        verify(postEventPublisher, times(1)).publishCommentEvent(any(Comment.class));
    }
}
