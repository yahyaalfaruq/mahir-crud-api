const http = require("http");
const url = require("url");

let finances = [];
let nextId = 1;

const respondWithJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (pathname === "/api/finance" && method === "POST") {
    createFinance(req, res);
  } else if (pathname === "/api/finance" && method === "GET") {
    readFinance(res);
  } else if (pathname.startsWith("/api/finance/") && method === "GET") {
    const financeId = pathname.split("/")[3];
    readFinanceById(res, financeId);
  } else if (pathname.startsWith("/api/finance/") && method === "PUT") {
    const financeId = pathname.split("/")[3];
    updateFinance(req, res, financeId);
  } else if (pathname.startsWith("/api/finance/")) {
    const financeId = pathname.split("/")[3];
    deleteFinance(res, financeId);
  }
});

const createFinance = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { description, amount, type, date } = JSON.parse(body);
    const newFinance = {
      transaction_id: nextId++,
      description,
      amount,
      type,
      date,
    };
    finances.push(newFinance);
    respondWithJSON(res, 200, {
      message: "Transaksi berhasil ditambahkan",
      transaction_id: 1,
    });
  });
};

const readFinance = (res) => {
  respondWithJSON(res, 200, finances);
};

const readFinanceById = (res, id) => {
  const finance = finances.find((p) => p.transaction_id === parseInt(id));
  if (finance) {
    respondWithJSON(res, 200, finance);
  } else {
    respondWithJSON(res, 404, {
      error: "Deskripsi transaksi tidak boleh kosong",
    });
  }
};

const updateFinance = (req, res, id) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { description, amount, type, date } = JSON.parse(body);
    const finance = finances.find((p) => p.transaction_id === parseInt(id));
    if (finance) {
      (finance.description = description),
        (finance.amount = amount),
        (finance.type = type),
        (finance.date = date);
      respondWithJSON(res, 200, {
        message: "Transaksi berhasil diperbarui",
        finance_id: 1,
      });
    } else {
      respondWithJSON(res, 404, {
        error: "Deskripsi transaksi tidak boleh kosong",
      });
    }
  });
};

const deleteFinance = (res, id) => {
    const index = finances.findIndex((p) => p.transaction_id === parseInt(id));
    if (index !== -1) {
      finances.splice(index, 1);
      respondWithJSON(res, 200, {
        message: "Transaksi berhasil dihapus",
        finance_id: 1,
      });
    } else {
      respondWithJSON(res, 404, { error: "Deskripsi transaksi tidak boleh kosong" });
    }
  };

server.listen(3000, () => {
  console.log("server running http://localhost:30000");
});
