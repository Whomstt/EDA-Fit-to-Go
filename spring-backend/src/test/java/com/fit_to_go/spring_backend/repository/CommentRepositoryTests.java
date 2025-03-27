package com.fit_to_go.spring_backend.repository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.fit_to_go.spring_backend.entity.Comment;
import com.fit_to_go.spring_backend.entity.Post;

@DataJpaTest
@ActiveProfiles("test")
class CommentRepositoryTests {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    private Post post1;
    private Post post2;

    @BeforeEach
    void setup() {
        post1 = new Post();
        post1.setTitle("Post 1");
        post1.setLikeCount(0);
        post1.setCommentCount(0);
        post1.setShareCount(0);
        postRepository.save(post1);

        post2 = new Post();
        post2.setTitle("Post 2");
        post2.setLikeCount(0);
        post2.setCommentCount(0);
        post2.setShareCount(0);
        postRepository.save(post2);

        Comment c1 = new Comment();
        c1.setPost(post1);
        c1.setComment("Comment 1 for Post 1");

        Comment c2 = new Comment();
        c2.setPost(post1);
        c2.setComment("Comment 2 for Post 1");

        Comment c3 = new Comment();
        c3.setPost(post2);
        c3.setComment("Comment for Post 2");

        commentRepository.saveAll(List.of(c1, c2, c3));
    }

    @Test
    void testFindByPostId_ForPost1() {
        List<Comment> comments = commentRepository.findByPostId(post1.getId());
        assertThat(comments).hasSize(2);
    }

    @Test
    void testFindByPostId_ForPost2() {
        List<Comment> comments = commentRepository.findByPostId(post2.getId());
        assertThat(comments).hasSize(1);
    }

    @Test
    void testFindByPostId_ForNonExistingPost() {
        List<Comment> comments = commentRepository.findByPostId(999L);
        assertThat(comments).isEmpty();
    }
}
