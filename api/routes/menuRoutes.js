const express = require("express");
const router = express.Router();

const {
    getAllMenu,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu
} = require("../controllers/menuController");

// Routing Endpoint CRUD Menu
router.get("/", getAllMenu);
router.get("/:id", getMenuById);
router.post("/", createMenu);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);

module.exports = router;