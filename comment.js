const http = require("http");
const url = require("url");

let comments = [];
let nextId = 1;

const respondWithJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (pathname === "/api/comments" && method === "POST") {
    createComments(req, res);
  } else if (pathname === "/api/comments" && method === "GET") {
    readComments(res);
  } else if (pathname.startsWith("/api/comments/") && method === "GET") {
    const commentId = pathname.split("/")[3];
    readCommentsById(res, commentId);
  } else if (pathname.startsWith("/api/comments/") && method === "PUT") {
    const commentId = pathname.split("/")[3];
    updateComments(req, res, commentId);
  } else if (pathname.startsWith("/api/comments/") && method === "DELETE") {
    const commentId = pathname.split("/")[3];
    deleteComments(res, commentId);
  }
});

const createComments = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { content, author, created_at } = JSON.parse(body);
    const newComment = {
      comment_id: nextId++,
      content,
      author,
      created_at: new Date().toISOString(),
    };
    comments.push(newComment);
    respondWithJSON(res, 200, {
      message: "Komentar berhasil ditambahkan",
      comment_id: 1,
    });
  });
};

const readComments = (res) => {
  respondWithJSON(res, 200, comments);
};

const readCommentsById = (res, id) => {
  const comment = comments.find((p) => p.comment_id === id);
  if (comment) {
    respondWithJSON(res, 200, comment);
  } else {
    respondWithJSON(res, 404, { error: "Isi komentar tidak boleh kosong" });
  }
};

const updateComments = (req, res, id) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { content, author, created_at } = JSON.parse(body);
    const comment = comments.find((p) => p.comment_id === parseInt(id));
    if (comment) {
      (comment.content = content),
        (comment.author = author),
        (comment.created_at = created_at);
      respondWithJSON(res, 200, {
        message: "Komentar berhasil diperbarui",
        comment_id: 1,
      });
    } else {
      respondWithJSON(res, 404, { error: "Isi komentar tidak boleh kosong" });
    }
  });
};

const deleteComments = (res, id) => {
  const index = comments.findIndex((p) => p.comment_id === parseInt(id));
  if (index !== -1) {
    comments.splice(index, 1);
    respondWithJSON(res, 200, {
      message: "Komentar berhasil dihapus",
      comment_id: 1,
    });
  } else {
    respondWithJSON(res, 404, { error: "Isi komentar tidak boleh kosong" });
  }
};

server.listen(3000, () => {
  console.log("server running http://localhost:3000)");
});
