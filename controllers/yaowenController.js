import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import yaowenData from "../data/YaoWen.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "../data/YaoWen.json");

export const ReturnAllYaoWen = (req, res) => {
  res.json(yaowenData);
};

export const AddNewYaoWen = async (req, res) => {
  try {
    // 1. 读取现有数据
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const arr = JSON.parse(file);

    // 2. 从请求体拿到新要闻
    const newItem = req.body;
    //    （建议在这里做一些校验，比如 newItem.id, title 等必须字段）

    // 3. 插入数组
    arr.push(newItem);

    // 4. 写回文件
    await fs.writeFile(
      DATA_PATH,
      JSON.stringify(arr, null, 2), // 格式化：2 个空格缩进
      "utf-8"
    );

    // 5. 返回新数据
    res.status(201).json(newItem);
  } catch (err) {
    console.error("写入要闻失败：", err);
    res.status(500).json({ error: "保存失败" });
  }
};

export const ReturnYaoWenByID = (req, res) => {
  const { id } = req.params;
  console.log(id);
  const item = yaowenData.find((entry) => entry.id === id);
  if (!item) {
    return res.status(404).json({ error: "要闻未找到" });
  }
  res.json(item);
};
