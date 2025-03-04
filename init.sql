CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    likecount INT DEFAULT 0,
    commentcount INT DEFAULT 0,
    sharecount INT DEFAULT 0
);

INSERT INTO posts (title, likecount, commentcount, sharecount)
VALUES ('First Post', 5, 6, 1);

INSERT INTO posts (title, likecount, commentcount, sharecount)
VALUES ('Second Post', 3, 4, 8);
