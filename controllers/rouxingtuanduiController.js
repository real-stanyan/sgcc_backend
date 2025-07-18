import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "Yanwenyao!123",
  database: "sgcc_database",
});

// 返回所有数据
export const ReturnAllRouxingtuandui = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Rouxingtuandui ORDER BY i ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("MySQL 查询失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 根据ID返回数据
export const GetRouxingtuanduiByID = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Rouxingtuandui WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "未找到对应记录" });
    res.json(rows[0]);
  } catch (err) {
    console.error("MySQL 查询失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 添加新数据
export const AddNewRouxingtuandui = async (req, res) => {
  try {
    const {
      id,
      i,
      manager,
      team_leader,
      area,
      team_sub_leader,
      research_titles,
      projects,
      team_heros,
      contact,
      team_members,
    } = req.body;

    await pool.query(
      `INSERT INTO Rouxingtuandui
         (id, i, manager, team_leader, area,
          team_sub_leader, research_titles, projects,
          team_heros, contact, team_members)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        i,
        manager,
        team_leader,
        area,
        JSON.stringify(team_sub_leader),
        JSON.stringify(research_titles),
        JSON.stringify(projects),
        JSON.stringify(team_heros),
        JSON.stringify(contact),
        JSON.stringify(team_members),
      ]
    );

    res.status(201).json({
      id,
      i,
      manager,
      team_leader,
      area,
      team_sub_leader,
      research_titles,
      projects,
      team_heros,
      contact,
      team_members,
    });
  } catch (err) {
    console.error("MySQL 插入失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 删除数据
export const DeleteRouxingtuanduiByID = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM Rouxingtuandui WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "未找到对应项" });
    res.json({ id });
  } catch (err) {
    console.error("MySQL 删除失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 根据ID修改数据
export const EditRouxingtuanduiByID = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      i,
      manager,
      team_leader,
      area,
      team_sub_leader,
      research_titles,
      projects,
      team_heros,
      contact,
      team_members,
    } = req.body;

    // normalize JSON fields
    const teamSubJson = JSON.stringify(team_sub_leader);
    const researchJson = JSON.stringify(research_titles);
    const projectsJson = JSON.stringify(projects);
    const herosJson = JSON.stringify(team_heros);
    const contactJson = JSON.stringify(contact);
    const membersJson = JSON.stringify(team_members);

    const sql = `
      UPDATE Rouxingtuandui SET
        i               = ?,
        manager         = ?,
        team_leader     = ?,
        area            = ?,
        team_sub_leader = ?,
        research_titles = ?,
        projects        = ?,
        team_heros      = ?,
        contact         = ?,
        team_members    = ?,
        CreatedAt       = ?
      WHERE id = ?
    `;
    const params = [
      i,
      manager,
      team_leader,
      area,
      teamSubJson,
      researchJson,
      projectsJson,
      herosJson,
      contactJson,
      membersJson,
      id,
    ];

    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "未找到对应记录" });
    }
    res.json({
      id,
      i,
      manager,
      team_leader,
      area,
      team_sub_leader,
      research_titles,
      projects,
      team_heros,
      contact,
      team_members,
    });
  } catch (err) {
    console.error("MySQL 更新失败", err);
    res.status(500).json({ error: err.message });
  }
};

// 数据升序：将 i 与 i-1 交换
export const IncreaseRouxingtuanduiOrderByI = async (req, res) => {
  const i = parseInt(req.params.i, 10);
  if (isNaN(i) || i <= 1) return res.status(400).json({ error: "invalid i" });
  const prev = i - 1;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // 用 0 做占位（i 从 1 开始）
    await conn.query("UPDATE Rouxingtuandui SET i = 0 WHERE i = ?", [prev]);
    await conn.query("UPDATE Rouxingtuandui SET i = ? WHERE i = ?", [prev, i]);
    await conn.query("UPDATE Rouxingtuandui SET i = ? WHERE i = 0", [i]);
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
export const DecreaseRouxingtuanduiOrderByI = async (req, res) => {
  const i = parseInt(req.params.i, 10);
  if (isNaN(i)) return res.status(400).json({ error: "invalid i" });

  const next = i + 1;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    // 用 0 做占位
    await conn.query("UPDATE Rouxingtuandui SET i = 0 WHERE i = ?", [next]);
    await conn.query("UPDATE Rouxingtuandui SET i = ? WHERE i = ?", [next, i]);
    await conn.query("UPDATE Rouxingtuandui SET i = ? WHERE i = 0", [i]);
    await conn.commit();
    res.json({ success: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
};
