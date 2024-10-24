const http = require("http");
const url = require("url");

let attendances = [];

let nextId = 1;

const respondWithJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let { pathname } = parsedUrl;
  const method = req.method;

  if (pathname === "/api/attendance" && method === "POST") {
    createAttendance(req, res);
  } else if (pathname === "/api/attendance" && method === "GET") {
    readAttendance(res);
  } else if (pathname.startsWith("/api/attendance/") && method === "PUT") {
    const attendanceId = pathname.split("/")[3];
    updateAttendance(req, res, attendanceId);
  } else if (pathname.startsWith("/api/attendance/") && method === "DELETE") {
    const attendanceId = pathname.split("/")[3];
    deleteAttendance(res, attendanceId);
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

const createAttendance = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { student, name, date, status } = JSON.parse(body);
    const newAttendance = {
      attendance_id: nextId++,
      student,
      name,
      date,
      status,
    };
    attendances.push(newAttendance);
    respondWithJSON(res, 200, {
      message: "Absensi berhasil ditambahkan",
      attendance_id: 1,
    });
  });
};

const readAttendance = (res) => {
  respondWithJSON(res, 200, attendances);
};

const updateAttendance = (req, res, id) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { student, name, date, status } = JSON.parse(body);
    const attendance = attendances.find(
      (p) => p.attendance_id === parseInt(id)
    );
    if (attendance) {
      (attendance.student = student),
        (attendance.name = name),
        (attendance.date = date),
        (attendance.status = status);
      respondWithJSON(res, 200, { message: "Absensi berhasil diperbarui" });
    } else {
      respondWithJSON(res, 404, { message: "Absensi tidak ditemukan" });
    }
  });
};

const deleteAttendance = (res, id) => {
  const index = attendances.findIndex((p) => p.attendance_id === parseInt(id));
  if (index !== -1) {
    attendances.splice(index, 1);
    respondWithJSON(res, 200, { message: "Absensi berhasil dihapus" });
  } else {
    respondWithJSON(res, 404, { message: "Absensi tidak ditemukan" });
  }
};

server.listen(3000, () => {
  console.log("Serever running http://localhost:3000");
});
