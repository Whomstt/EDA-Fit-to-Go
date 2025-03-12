package com.fit_to_go.spring_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fit_to_go.spring_backend.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
}
