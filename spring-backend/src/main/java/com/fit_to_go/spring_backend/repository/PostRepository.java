package com.fit_to_go.spring_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fit_to_go.spring_backend.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByIdAsc();
}
