import yaowen from "../data/YaoWen.json" assert { type: "json" };

export const ReturnAllYaoWen = (req, res) => res.json(yaowen);
