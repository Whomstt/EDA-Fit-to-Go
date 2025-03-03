CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    likecount INT DEFAULT 0,
    commentcount INT DEFAULT 0,
    sharecount INT DEFAULT 0
);

INSERT INTO posts (likecount, commentcount, sharecount)
VALUES (0, 0, 0);