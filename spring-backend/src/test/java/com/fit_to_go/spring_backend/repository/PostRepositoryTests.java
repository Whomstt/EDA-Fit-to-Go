package com.fit_to_go.spring_backend.repository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.fit_to_go.spring_backend.entity.Post;

@DataJpaTest
@ActiveProfiles("test")
public class PostRepositoryTests {

    @Autowired
    private PostRepository postRepository;

    @BeforeEach
    public void setup() {
        Post p1 = new Post();
        p1.setTitle("Post A");
        p1.setLikeCount(1);
        p1.setCommentCount(2);
        p1.setShareCount(3);
        Post p2 = new Post();
        p2.setTitle("Post B");
        p2.setLikeCount(4);
        p2.setCommentCount(5);
        p2.setShareCount(6);
        postRepository.saveAll(List.of(p1, p2));
    }

    @Test
    void testFindAllByOrderByIdAsc() {
        List<Post> posts = postRepository.findAllByOrderByIdAsc();
        assertThat(posts).hasSize(2);
        assertThat(posts.get(0).getTitle()).isEqualTo("Post A");
        assertThat(posts.get(1).getTitle()).isEqualTo("Post B");
    }

    @Test
    void testSavePost() {
        Post newPost = new Post();
        newPost.setTitle("New Post");
        newPost.setLikeCount(7);
        newPost.setCommentCount(8);
        newPost.setShareCount(9);
        Post saved = postRepository.save(newPost);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("New Post");
    }

    @Test
    void testDeletePost() {
        Post p = postRepository.findAll().get(0);
        postRepository.delete(p);
        List<Post> remaining = postRepository.findAll();
        assertThat(remaining).hasSize(1);
    }
}
