CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    likecount INT DEFAULT 0,
    commentcount INT DEFAULT 0,
    sharecount INT DEFAULT 0
);

INSERT INTO posts (title, likecount, commentcount, sharecount)
VALUES ('First Post', 5, 1, 1),
       ('Second Post', 3, 1, 8),
       ('Third Post', 7, 1, 3);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    comment VARCHAR(255)
);

INSERT INTO comments (post_id, comment)
VALUES (1, 'Great post!'),
       (2, 'I agree!'),
       (3, 'Interesting read!');
