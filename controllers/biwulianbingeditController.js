import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "Yanwenyao!123",
  database: "sgcc_database",
});

// 返回所有数据
export const ReturnAllBiwulianbing = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Biwulianbing");
    res.json(rows);
  } catch (err) {
    console.error("MySQL 查询失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 添加新数据
export const AddNewBiwulianbing = async (req, res) => {
  try {
    const {
      id,
      project,
      content,
      header_office,
      duration,
      date,
      manager,
      responsibler,
      contact, // 现在是一个数组或对象
      progress,
      CreatedAt,
    } = req.body;

    await pool.query(
      `INSERT INTO Biwulianbing
         (id, project, content, header_office,
          duration, date, manager, responsibler,
          contact, progress, CreatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        project,
        content,
        header_office,
        duration,
        date,
        manager,
        responsibler,
        JSON.stringify(contact), // 序列化为 JSON
        progress,
        CreatedAt,
      ]
    );

    res.status(201).json(req.body);
  } catch (err) {
    console.error("MySQL 插入失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 删除数据
export const DeleteBiwulianbingByID = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM Biwulianbing WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "未找到对应项" });
    res.json({ id });
  } catch (err) {
    console.error("MySQL 删除失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 根据ID返回数据
export const GetBiwulianbingByID = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM Biwulianbing WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "未找到对应记录" });
    res.json(rows[0]);
  } catch (err) {
    console.error("MySQL 查询失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 根据ID修改数据
export const EditBiwulianbingByID = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      project,
      content,
      header_office,
      duration,
      date,
      manager,
      responsibler,
      contact,
      progress,
      CreatedAt,
    } = req.body;

    // 1) normalize contact JSON
    const contactJson = JSON.stringify(contact);

    // 2) normalize CreatedAt into "YYYY-MM-DD HH:MM:SS"
    let createdAtFormatted = CreatedAt;
    if (typeof CreatedAt === "string") {
      const d = new Date(CreatedAt);
      createdAtFormatted = d.toISOString().slice(0, 19).replace("T", " ");
    }

    const sql = `
      UPDATE Biwulianbing SET
        project       = ?,
        content       = ?,
        header_office = ?,
        duration      = ?,
        date          = ?,
        manager       = ?,
        responsibler  = ?,
        contact       = ?,
        progress      = ?,
        CreatedAt     = ?
      WHERE id = ?
    `;
    const params = [
      project,
      content,
      header_office,
      duration,
      date,
      manager,
      responsibler,
      contactJson,
      progress,
      createdAtFormatted,
      id,
    ];

    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "未找到对应记录" });
    }
    res.json({ id, ...req.body });
  } catch (err) {
    console.error("MySQL 更新失败", err);
    res.status(500).json({ error: err.message });
  }
};
