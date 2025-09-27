const express = require("express");
const router = express.Router();

const purchase = require("../Model/PurchaseManagementModelT");

//insert controller
const PurchaseController = require("../Controllers/PurchaseManagementControllerT");

router.get("/", PurchaseController.getAllPurchaseorders);
router.post("/", PurchaseController.addPurchase);
router.get("/:id", PurchaseController.getByIdPurchase);
router.put("/:id", PurchaseController.updateOrder);
router.delete("/:id", PurchaseController.deletePurchase);

//exports
module.exports = router;
