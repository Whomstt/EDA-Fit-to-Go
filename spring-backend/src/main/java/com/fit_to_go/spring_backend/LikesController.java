package com.fit_to_go.spring_backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/likes")
public class LikesController {

    private int likeCount = 100; // Example static count

    @GetMapping
    public int getLikeCount() {
        return likeCount;
    }
}
