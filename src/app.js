const express = require("express");
const cors = require("cors");
const prisma = require("./model/prisma");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/get-data", async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const take = 100;
    const skip = (page - 1) * take;
    const data =
      await prisma.$queryRaw`Select za.seq, za.contract_number, a.documentNumber, a.name  from z_agreement_to_import_2023 za left join agreements a on za.contract_number = a.documentNumber LIMIT ${take} OFFSET ${skip}
      `;
    const pages =
      await prisma.$queryRaw`SELECT COUNT(*)/${take} pages FROM z_agreement_to_import_2023 za left join agreements a on za.contract_number = a.documentNumber`;
    res.status(200).json({ data, pages: Math.ceil(+pages[0].pages) });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
