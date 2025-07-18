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
    const [rows] = await pool.query(
      "SELECT * FROM Biwulianbing ORDER BY i ASC"
    );
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
      i,
      project,
      content,
      header_office,
      duration,
      date,
      manager,
      responsibler,
      contact,
      progress,
    } = req.body;

    await pool.query(
      `INSERT INTO Biwulianbing
         (id, i, project, content, header_office,
          duration, date, manager, responsibler,
          contact, progress)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        i,
        project,
        content,
        header_office,
        duration,
        date,
        manager,
        responsibler,
        JSON.stringify(contact), // 序列化为 JSON
        progress,
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
      i,
      project,
      content,
      header_office,
      duration,
      date,
      manager,
      responsibler,
      contact,
      progress,
    } = req.body;

    // 1) normalize contact JSON
    const contactJson = JSON.stringify(contact);

    const sql = `
      UPDATE Biwulianbing SET
        project       = ?,
        i             = ?,
        content       = ?,
        header_office = ?,
        duration      = ?,
        date          = ?,
        manager       = ?,
        responsibler  = ?,
        contact       = ?,
        progress      = ?,
      WHERE id = ?
    `;
    const params = [
      project,
      i,
      content,
      header_office,
      duration,
      date,
      manager,
      responsibler,
      contactJson,
      progress,
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

// 数据升序：将 i 与 i-1 交换
export const IncreaseBiwulianbingOrderByI = async (req, res) => {
  const i = parseInt(req.params.i, 10);
  if (isNaN(i) || i <= 1) return res.status(400).json({ error: "invalid i" });
  const prev = i - 1;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // 用 0 做占位（i 从 1 开始）
    await conn.query("UPDATE Biwulianbing SET i = 0 WHERE i = ?", [prev]);
    await conn.query("UPDATE Biwulianbing SET i = ? WHERE i = ?", [prev, i]);
    await conn.query("UPDATE Biwulianbing SET i = ? WHERE i = 0", [i]);
    await conn.commit();
    res.json({ success: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
};

// 数据降序：将 i 与 i+1 交换
export const DecreaseBiwulianbingOrderByI = async (req, res) => {
  const i = parseInt(req.params.i, 10);
  if (isNaN(i)) return res.status(400).json({ error: "invalid i" });

  const next = i + 1;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    // 用 0 做占位
    await conn.query("UPDATE Biwulianbing SET i = 0 WHERE i = ?", [next]);
    await conn.query("UPDATE Biwulianbing SET i = ? WHERE i = ?", [next, i]);
    await conn.query("UPDATE Biwulianbing SET i = ? WHERE i = 0", [i]);
    await conn.commit();
    res.json({ success: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
};
