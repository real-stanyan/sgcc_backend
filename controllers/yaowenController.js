// controllers/yaowenController.js
import fs from "fs/promises";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "../data/YaoWen.json");

// ───────────── 读取一次，存到内存 ─────────────
let yaowenData = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

// ───────────── 所有要闻 ─────────────
export const ReturnAllYaoWen = (req, res) => {
  res.json(yaowenData);
};

// ───────────── 按 ID 查询 ─────────────
export const ReturnYaoWenByID = (req, res) => {
  const { id } = req.params; // /yaowen/:id
  const item = yaowenData.find((e) => String(e.id) === String(id));

  if (!item) return res.status(404).json({ error: "要闻未找到" });
  res.json(item);
};

// ───────────── 添加新要闻 ─────────────
export const AddNewYaoWen = async (req, res) => {
  try {
    const newItem = req.body;
    if (!newItem.id || !newItem.title) {
      return res.status(400).json({ error: "缺少必填字段" });
    }

    // 更新内存
    yaowenData.push(newItem);

    // 持久化到文件
    await fs.writeFile(DATA_PATH, JSON.stringify(yaowenData, null, 2), "utf-8");

    res.status(201).json(newItem);
  } catch (err) {
    console.error("写入要闻失败:", err);
    res.status(500).json({ error: "保存失败" });
  }
};
