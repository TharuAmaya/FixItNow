const express =require("express");
const router =express.Router();

//insert model
const Suplier=require("../Model/SupplierManagemenModelT");

//insert controller
const SupplierController=require("../Controllers/SupplierManagementControllerT");

router.get("/", SupplierController.getAllSuppliers);
router.post("/", SupplierController.addSupplier);
router.get("/:id", SupplierController.getById);
router.put("/:id", SupplierController.updateSupplier);
router.delete("/:id", SupplierController.deleteSupplier);

//exports
module.exports=router;

