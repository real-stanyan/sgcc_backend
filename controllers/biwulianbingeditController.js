import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "../data/Biwulianbing.json");

export const ReturnAllBiwulianbing = async (req, res) => {
  const file = await fs.readFile(DATA_PATH, "utf-8");
  return res.json(JSON.parse(file));
};

export const AddNewBiwulianbing = async (req, res) => {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const arr = JSON.parse(file);
    const newItem = req.body;
    arr.push(newItem);
    await fs.writeFile(DATA_PATH, JSON.stringify(arr, null, 2), "utf-8");
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "读取或写入失败" });
  }
};

export const DeleteBiwulianbingByID = async (req, res) => {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const arr = JSON.parse(file);
    const { id } = req.params;

    const index = arr.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "未找到对应项" });
    }

    const [removed] = arr.splice(index, 1);
    await fs.writeFile(DATA_PATH, JSON.stringify(arr, null, 2), "utf-8");
    return res.json(removed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "读取或写入失败" });
  }
};

export const GetBiwulianbingByID = async (req, res) => {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const arr = JSON.parse(file);
    const { id } = req.params;

    const item = arr.find((entry) => entry.id === id);
    if (!item) {
      return res.status(404).json({ error: "未找到对应记录" });
    }

    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "读取文件失败" });
  }
};

export const EditBiwulianbingByID = async (req, res) => {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const arr = JSON.parse(file);
    const { id } = req.params;
    const index = arr.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "未找到对应记录" });
    }

    // 合并请求体中的字段到原有条目上，保留 id 不变
    const updatedItem = {
      ...arr[index],
      ...req.body,
      id, // 确保 id 不被篡改
    };

    arr[index] = updatedItem;
    await fs.writeFile(DATA_PATH, JSON.stringify(arr, null, 2), "utf-8");

    return res.json(updatedItem);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "读取或写入失败" });
  }
};
