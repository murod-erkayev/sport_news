const pool = require("./db");

const tables = [
  `DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type_enum') THEN
        CREATE TYPE media_type_enum AS ENUM ('image', 'video', 'audio');
      END IF;
    END $$;`,

  `DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status_enum') THEN
        CREATE TYPE report_status_enum AS ENUM ('pending', 'approved', 'rejected');
      END IF;
    END $$;`,

  `CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL, 
        code VARCHAR(255)
    );`,

  `CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        tag_name VARCHAR(50) NOT NULL, 
        description VARCHAR(255)
    );`,

  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(255),
    is_active BOOLEAN,
    created_at DATE
);`,

  `CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255),
    description VARCHAR(255),
    parent_id INT,
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE SET NULL
);`,

  `CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    news_id BIGINT,
    category_id INT,
    author_id INT,
    status VARCHAR(50),
    published_at DATE,
    source VARCHAR(255),
    lang_id INT,
    CONSTRAINT fk_news_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_news_language FOREIGN KEY (lang_id) REFERENCES languages(id) ON DELETE SET NULL
);`,

  `CREATE TABLE IF NOT EXISTS news_with_langs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    summary_news VARCHAR(255),
    lang_id INT,
    CONSTRAINT fk_news_lang FOREIGN KEY (lang_id) REFERENCES languages(id) ON DELETE CASCADE
);`,

  `CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    news_id INT,
    media_type media_type_enum NOT NULL, 
    media_url VARCHAR(255) NOT NULL,
    uploaded_at DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_media_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    news_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reply_comment_id INT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    views BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_reply FOREIGN KEY (reply_comment_id) REFERENCES comments(id) ON DELETE SET NULL
);
`,
  `CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    news_id INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status report_status_enum DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    news_id INT NOT NULL,
    user_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_likes_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`,
  `CREATE TABLE IF NOT EXISTS views (
    id SERIAL PRIMARY KEY,
    news_id INT NOT NULL,
    user_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_views_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    CONSTRAINT fk_views_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS news_tags (
    id BIGSERIAL PRIMARY KEY,
    news_id INT,
    tag_id INT,
    CONSTRAINT fk_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    CONSTRAINT fk_tags FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
`,
  `CREATE TABLE IF NOT EXISTS authors (
    id BIGSERIAL PRIMARY KEY,
    user_id int,
    is_approved BOOLEAN DEFAULT FALSE,
    is_editor BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id INT,
    news_id INT,
    msg_type VARCHAR(50) NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);
`,
];

module.exports = async () => {
  for (const query of tables) {
    await pool.query(query);
  }
};
