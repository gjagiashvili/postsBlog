import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.json());

var posts = [
  { id: 1, title: "Hello!" },
  { id: 2, title: "Good morning!" },
  { id: 3, title: "Hello world!" },
];
var comments = [
  { id: 1, postId: 1, text: "comment for 1 post" },
  { id: 2, postId: 2, text: "comment for 2 post" },
  { id: 3, postId: 3, text: "comment for 3 post" },
];
var postId = 1;

// 1. GET /posts:
app.get("/posts", (req, res) => {
  res.json(posts);
});

// 2. GET /posts/:id:
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundPost = posts.find((post) => post.id === id);
  res.json(foundPost);
});

// 3. POST /posts
app.post("/posts", (req, res) => {
  const { post, title } = req.body;
  const newPost = { id: posts.length + 1, post };
  posts.push(newPost);
  res.json(newPost);
});

// 4. PUT /posts/:id:

app.put("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;

  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ error: "post not found" });
  }

  posts[postIndex].title = title || posts[postIndex].title;
  res.json(posts[postIndex]);
});

// 5.DELETE /posts/:id:

app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = posts.findIndex((post) => post.id === id);
  if (searchIndex > -1) {
    posts.splice(searchIndex, 1);
    res.sendStatus(200);
  } else {
    res
      .status(404)
      .json({ error: `Post with id: ${id} not found. No Posts were deleted.` });
  }
});

// 6. GET /posts/:id/comments:

app.get("/posts/:id/comments", (req, res) => {
  const postId = parseInt(req.params.id);
  const postComments = comments.filter((comment) => comment.postId === postId);

  res.json(postComments);
});
// 7. POST /posts/:id/comments:

app.post("/posts/:id/comments", (req, res) => {
  const postId = parseInt(req.params.id);
  const { text } = req.body;

  const post = posts.find((post) => post.id === postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const newComment = { id: comments.length + 1, postId, text };
  comments.push(newComment);
  res.json(newComment);
});

// 8. PUT /posts/:postId/comments/:commentId:
app.put("/posts/:postId/comments/:commentId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const commentId = parseInt(req.params.commentId);
  const { text } = req.body;

  const post = posts.find((post) => post.id === postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const comment = comments.find((comment) => comment.id === commentId);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  comment.text = text;
  res.json(comment);
});
// 9. DELETE /posts/:postId/comments/:commentId:
app.delete("/posts/:postId/comments/:commentId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const commentId = parseInt(req.params.commentId);

  const post = posts.find((post) => post.id === postId);
  if (!post) {
    return res.status(404).json({ error: ".Post not found" });
  }

  const commentIndex = comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (commentIndex === -1) {
    return res.status(404).json({ error: ".comment not found" });
  }
  comments.splice(commentIndex, 1);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
