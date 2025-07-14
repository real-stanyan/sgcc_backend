import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "../data/KuaiXun.json");

// in-memory map to track last visit timestamp per item
const lastVisitTimestamps = new Map();
// threshold for de-duplication (ms)
const VISIT_THRESHOLD_MS = 1000;

export const ReturnAllKuaiXun = async (req, res) => {
  const file = await fs.readFile(DATA_PATH, "utf-8");
  return res.json(JSON.parse(file));
};

export const AddNewKuaiXun = async (req, res) => {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const arr = JSON.parse(file);
    const newItem = req.body;
    arr.push(newItem);
    await fs.writeFile(DATA_PATH, JSON.stringify(arr, null, 2), "utf-8");
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "保存失败" });
  }
};

export const ReturnKuaiXunByID = async (req, res) => {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const arr = JSON.parse(file);
    const item = arr.find((entry) => entry.id === req.params.id);
    if (!item) return res.status(404).json({ error: "要闻未找到" });

    const now = Date.now();
    const lastTs = lastVisitTimestamps.get(item.id) || 0;

    // only increment if past threshold
    if (now - lastTs > VISIT_THRESHOLD_MS) {
      item.visit_count = (item.visit_count || 0) + 1;
      await fs.writeFile(DATA_PATH, JSON.stringify(arr, null, 2), "utf-8");
      lastVisitTimestamps.set(item.id, now);
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "读取或写入失败" });
  }
};
