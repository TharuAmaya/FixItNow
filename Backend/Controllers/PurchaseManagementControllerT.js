const Purchase = require("../Model/PurchaseManagementModelT");
const Notification = require("../Model/Notification");

const getAllPurchaseorders = async (req, res, next) => {
  let purchases;

  try {
    purchases = await Purchase.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!purchases) {
    return res.status(404).json({ message: "orders are not found" });
  }
  //dispplay all orders
  return res.status(200).json({ purchases });
};

//insert
const addPurchase = async (req, res) => {
  const { orderId, supplierId, items, status, createdAt } = req.body;
  let purchases;

  try {
    purchases = new Purchase({
      orderId,
      supplierId,
      items,
      status,
      createdAt,
    });
    await purchases.save();
    //Create notification for supplier
    await Notification.create({
      message: `New Purchase Order ${orderId} created.`,
      link: "/supplierorder",
      role: "supplier",
    });
  } catch (err) {
    console.log(err);
  }

  if (!purchases) {
    return res.status(404).json({ message: "Order not inserted" });
  }
  return res.status(200).json({ purchases });
};
//  get Purchase Order by ID
const getByIdPurchase = async (req, res, next) => {
  const id = req.params.id;

  let purchase;
  try {
    purchase = await Purchase.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!purchase) {
    return res.status(404).json({ message: "Order not found" });
  }
  return res.status(200).json({ purchase });
};

// Update Purchase Order
const updateOrder = async (req, res, next) => {
  const id = req.params.id;
  const { orderId, supplierId, items, status, createdAt } = req.body;

  let purchases;
  try {
    purchases = await Purchase.findByIdAndUpdate(
      id,
      { orderId, supplierId, items, status, createdAt },
      { new: true } // returns updated doc
    );
  } catch (err) {
    console.log(err);
  }

  if (!purchases) {
    return res.status(404).json({ message: "Order not updated" });
  }
  return res.status(200).json({ purchases });
};

//  Delete Purchase Order
const deletePurchase = async (req, res, next) => {
  const id = req.params.id;

  let purchase;
  try {
    purchase = await Purchase.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!purchase) {
    return res.status(404).json({ message: "Order not deleted" });
  }
  return res.status(200).json({ purchase });
};

exports.getAllPurchaseorders = getAllPurchaseorders;
exports.addPurchase = addPurchase;
exports.getByIdPurchase = getByIdPurchase;
exports.updateOrder = updateOrder;
exports.deletePurchase = deletePurchase;
