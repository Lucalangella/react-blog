const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 4000);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';
const DATA_FILE = path.join(__dirname, 'data', 'posts.json');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (!ALLOWED_ORIGIN) return callback(null, true);
      if (origin === ALLOWED_ORIGIN) return callback(null, true);
      return callback(new Error('CORS blocked'));
    },
    credentials: false,
  })
);

async function readPosts() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writePosts(posts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2) + '\n', 'utf8');
}

function validatePost(payload) {
  const required = ['title', 'excerpt', 'content', 'author', 'date'];
  const fieldErrors = {};

  for (const field of required) {
    if (!String(payload?.[field] || '').trim()) {
      fieldErrors[field] = `${field} is required`;
    }
  }

  if (payload?.status && !['draft', 'published'].includes(payload.status)) {
    fieldErrors.status = 'status must be "draft" or "published"';
  }

  return fieldErrors;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/posts', async (_req, res, next) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

app.get('/posts/:id', async (req, res, next) => {
  try {
    const posts = await readPosts();
    const id = Number(req.params.id);
    const post = posts.find((item) => Number(item.id) === id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found', code: 'NOT_FOUND' });
    }

    return res.json(post);
  } catch (error) {
    return next(error);
  }
});

app.post('/posts', async (req, res, next) => {
  try {
    const fieldErrors = validatePost(req.body);
    if (Object.keys(fieldErrors).length > 0) {
      return res.status(422).json({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        fieldErrors,
      });
    }

    const posts = await readPosts();
    const id = Date.now();
    const now = new Date().toISOString();

    const newPost = {
      id,
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      author: req.body.author,
      date: req.body.date,
      status: req.body.status || 'published',
      updatedAt: now,
    };

    posts.unshift(newPost);
    await writePosts(posts);
    return res.status(201).json(newPost);
  } catch (error) {
    return next(error);
  }
});

app.put('/posts/:id', async (req, res, next) => {
  try {
    const fieldErrors = validatePost(req.body);
    if (Object.keys(fieldErrors).length > 0) {
      return res.status(422).json({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        fieldErrors,
      });
    }

    const posts = await readPosts();
    const id = Number(req.params.id);
    const index = posts.findIndex((item) => Number(item.id) === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Post not found', code: 'NOT_FOUND' });
    }

    const updated = {
      ...posts[index],
      ...req.body,
      id,
      status: req.body.status || posts[index].status || 'published',
      updatedAt: new Date().toISOString(),
    };

    posts[index] = updated;
    await writePosts(posts);
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

app.delete('/posts/:id', async (req, res, next) => {
  try {
    const posts = await readPosts();
    const id = Number(req.params.id);
    const nextPosts = posts.filter((item) => Number(item.id) !== id);

    if (nextPosts.length === posts.length) {
      return res.status(404).json({ message: 'Post not found', code: 'NOT_FOUND' });
    }

    await writePosts(nextPosts);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
});

app.listen(PORT, () => {
  console.log(`Local API running on http://localhost:${PORT}`);
});
