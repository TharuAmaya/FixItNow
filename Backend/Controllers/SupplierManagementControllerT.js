const Supplier = require("../Model/SupplierManagemenModelT");

const getAllSuppliers = async (req, res, necxt) => {
  let suppliers;
  //get all suppliers
  try {
    suppliers = await Supplier.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!suppliers) {
    return res.status(404).json({ message: "suppliers not found" });
  }
  //dispplay all users
  return res.status(200).json({ suppliers });
};

//insert details
const addSupplier = async (req, res) => {
  const {
    supId,
    supname,
    supphone,
    gmail,
    address,
    performanceScore,
    totalorders,
    joinedDate,
  } = req.body;
  let suppliers;

  try {
    suppliers = new Supplier({
      supId,
      supname,
      supphone,
      gmail,
      address,
      performanceScore,
      totalorders,
      joinedDate,
    });
    await suppliers.save();
  } catch (err) {
    console.log(err);
  }

  //not insert
  if (!suppliers) {
    return res.status(404).json({ message: "suppliers not insert" });
  }
  return res.status(200).json({ suppliers });
};

//get by id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let supplier;
  try {
    supplier = await Supplier.findById(id);
  } catch (err) {
    console.log(err);
  }
  //not available supplier
  if (!supplier) {
    return res.status(404).json({ message: "suppliers not enable" });
  }
  return res.status(200).json({ supplier });
};

//update details
const updateSupplier = async (req, res, next) => {
  const id = req.params.id;
  const {
    supId,
    supname,
    supphone,
    gmail,
    address,
    performanceScore,
    totalorders,
    joinedDate,
  } = req.body;

  let suppliers;
  try {
    suppliers = await Supplier.findByIdAndUpdate(id, {
      supId,
      supname,
      supphone,
      gmail,
      address,
      performanceScore,
      totalorders,
      joinedDate,
    });
    suppliers = await suppliers.save();
  } catch (err) {
    console.log(err);
  }
  if (!suppliers) {
    return res.status(404).json({ message: "suppliers not update" });
  }
  return res.status(200).json({ suppliers });
};

//delete ssupplier
const deleteSupplier = async (req, res, next) => {
  const id = req.params.id;

  let supplier;

  try {
    supplier = await Supplier.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!supplier) {
    return res.status(404).json({ message: "suppliers delete" });
  }
  return res.status(200).json({ supplier });
};

exports.getAllSuppliers = getAllSuppliers;
exports.addSupplier = addSupplier;
exports.getById = getById;
exports.updateSupplier = updateSupplier;
exports.deleteSupplier = deleteSupplier;
