CREATE TABLE IF NOT EXISTS users
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    first_name VARCHAR
(
    100
) NOT NULL,
    last_name VARCHAR
(
    100
) NOT NULL,
    email VARCHAR
(
    255
) UNIQUE NOT NULL,
    age INT,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW
(
)
    );
