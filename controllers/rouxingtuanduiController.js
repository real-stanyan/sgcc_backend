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
    const [rows] = await pool.query("SELECT * FROM Rouxingtuandui");
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
      manager,
      team_leader,
      area,
      team_sub_leader,
      research_titles,
      projects,
      team_heros,
      contact,
      team_members,
      CreatedAt,
    } = req.body;

    await pool.query(
      `INSERT INTO Rouxingtuandui
         (id, manager, team_leader, area,
          team_sub_leader, research_titles, projects,
          team_heros, contact, team_members, CreatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        manager,
        team_leader,
        area,
        JSON.stringify(team_sub_leader),
        JSON.stringify(research_titles),
        JSON.stringify(projects),
        JSON.stringify(team_heros),
        JSON.stringify(contact),
        JSON.stringify(team_members),
        CreatedAt,
      ]
    );

    res.status(201).json({
      id,
      manager,
      team_leader,
      area,
      team_sub_leader,
      research_titles,
      projects,
      team_heros,
      contact,
      team_members,
      CreatedAt,
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
      manager,
      team_leader,
      area,
      team_sub_leader,
      research_titles,
      projects,
      team_heros,
      contact,
      team_members,
      CreatedAt,
    } = req.body;

    // normalize JSON fields
    const teamSubJson = JSON.stringify(team_sub_leader);
    const researchJson = JSON.stringify(research_titles);
    const projectsJson = JSON.stringify(projects);
    const herosJson = JSON.stringify(team_heros);
    const contactJson = JSON.stringify(contact);
    const membersJson = JSON.stringify(team_members);

    // format CreatedAt
    let createdAtFormatted = CreatedAt;
    if (typeof CreatedAt === "string") {
      const d = new Date(CreatedAt);
      createdAtFormatted = d.toISOString().slice(0, 19).replace("T", " ");
    }

    const sql = `
      UPDATE Rouxingtuandui SET
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
      manager,
      team_leader,
      area,
      teamSubJson,
      researchJson,
      projectsJson,
      herosJson,
      contactJson,
      membersJson,
      createdAtFormatted,
      id,
    ];

    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "未找到对应记录" });
    }
    res.json({
      id,
      manager,
      team_leader,
      area,
      team_sub_leader,
      research_titles,
      projects,
      team_heros,
      contact,
      team_members,
      CreatedAt: createdAtFormatted,
    });
  } catch (err) {
    console.error("MySQL 更新失败", err);
    res.status(500).json({ error: err.message });
  }
};
