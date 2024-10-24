const http = require("http");
const url = require("url");

let events = [];
let nextId = 1;

const respondWithJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  if (pathname === "/api/events" && method === "POST") {
    createEvents(req, res);
  } else if (pathname === "/api/events" && method === "GET") {
    readEvents(res);
  } else if (pathname.startsWith("/api/events/") && method === "GET") {
    const eventId = pathname.split("/")[3];
    readEventsById(res, eventId)
  } else if (pathname.startsWith("/api/events/") && method === "PUT") {
    const eventId = pathname.split("/")[3];
    updateEvents(req, res, eventId);
  } else if (pathname.startsWith("/api/events/") && method === "DELETE") {
    const eventId = pathname.split("/")[3];
    deleteEvents(res, eventId);
  }
});

const createEvents = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { name, date, location, description } = JSON.parse(body);
    const newEvent = {
      event_id: nextId++,
      name,
      date,
      location,
      description,
    };
    events.push(newEvent);
    respondWithJSON(res, 200, {
      message: "Agenda kegiatan berhasil ditambahkan",
      event_id: 1,
    });
  });
};

const readEvents = (res) => {
  respondWithJSON(res, 200, events);
};

const readEventsById = (res, id) => {
    const event = events.find((p) => p.event_id === id);
    if(event) {
        respondWithJSON(res, 200, event);
    } else {
        respondWithJSON(res, 404, {error: "Nama kegiatan tidak boleh kosong"})
    }
}

const updateEvents = (req, res, id) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { name, date, location, description } = JSON.parse(body);
    const event = events.find((p) => p.event_id === parseInt(id));
    if (event) {
      (event.name = name),
        (event.date = date),
        (event.location = location),
        (event.description = description);
      respondWithJSON(res, 200, {
        message: "Agenda kegiatan berhasil diperbarui",
        event_id: 1,
      });
    } else {
      respondWithJSON(res, 200, { error: "Nama kegiatan tidak boleh kosong" });
    }
  });
};

const deleteEvents = (res, id) => {
  const index = events.findIndex((p) => p.event_id === parseInt(id));
  if (index !== -1) {
    events.splice(index, 1);
    respondWithJSON(res, 200, { 
        message: "Agenda kegiatan berhasil dihapus",
        event_id: 1
     });
  } else {
    respondWithJSON(res, 200, { error: "Nama kegiatan tidak boleh kosong" });
  }
};

server.listen(3000, () => {
  console.log("server running http://localhost:3000");
});
