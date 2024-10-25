const http = require("http");
const url = require("url");

let elections = [];
let nextId = 1;

const respondWithJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  const method = req.method;

  if (pathname === "/api/election" && method === "POST") {
    createElection(req, res);
  } else if (pathname === "/api/election" && method === "GET") {
    readElection(res);
  } else if (pathname.startsWith("/api/election/") && method === "GET") {
    const electionId = pathname.split("/")[3];
    readElectionById(res, electionId);
  } else if (pathname.startsWith("/api/election/") && method === "PUT") {
    const electionId = pathname.split("/")[3];
    updateEletion(req, res, electionId);
  } else if (pathname.startsWith("/api/election/") && method === "DELETE") {
    const electionId = pathname.split("/")[3];
    deleteElection(res, electionId);
  }
});

const createElection = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { candidate_name, votes } = JSON.parse(body);
    const newElection = {
      election_id: nextId++,
      candidate_name,
      votes,
    };
    elections.push(newElection);
    respondWithJSON(res, 200, {
      message: "Kandidat berhasil ditambahkan",
      election_id: 1,
    });
  });
};

const readElection = (res) => {
  respondWithJSON(res, 200, elections);
};

const readElectionById = (res, id) => {
  const election = elections.find((p) => p.election_id === parseInt(id));
  if (election) {
    respondWithJSON(res, 200, election);
  } else {
    respondWithJSON(res, 404, { error: "Nama kandidat tidak boleh kosong" });
  }
};

const updateEletion = (req, res, id) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { candidate_name, votes } = JSON.parse(body);
    const election = elections.find((p) => p.election_id === parseInt(id));
    if (election) {
      election.candidate_name = candidate_name;
      election.votes = votes;
      respondWithJSON(res, 200, {
        message: "Informasi kandidat berhasil diperbarui",
        election_id: 1,
      });
    } else {
      respondWithJSON(res, 404, { error: "Nama kandidat tidak boleh kosong" });
    }
  });
};

const deleteElection = (res, id) => {
  const index = elections.findIndex((p) => p.election_id === parseInt(id));
  if (index !== -1) {
    elections.splice(index, 1);
    respondWithJSON(res, 200, {
      message: "Kandidat berhasil dihapus",
      election_id: 1,
    });
  } else {
    respondWithJSON(res, 404, { error: "Nama kandidat tidak boleh kosong" });
  }
};

server.listen(3000, () => {
  console.log("server running http://localhost:30000");
});
