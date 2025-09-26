const Technician = require("../Model/TechnicianModel");

// Get all technicians
const getAllTechnicians = async (req, res, next) => {
  let technicians;
  try {
    technicians = await Technician.find();
  } catch (error) {
    console.log("Error fetching technicians:", error);
    return res.status(500).json({ message: "Error fetching technicians" });
  }
  if (!technicians || technicians.length === 0) {
    return res.status(404).json({ message: "No technicians found" });
  }
  return res.status(200).json({ technicians });
};

// Create technician
const createTechnician = async (req, res, next) => {
  const { technicianId, name, skills, availability, workload, createdAt } = req.body;

  let newTech;
  try {
    newTech = new Technician({
      technicianId,
      name,
      skills,
      availability,
      workload,
      createdAt,
    });
    await newTech.save();
  } catch (error) {
    console.log("Error creating technician:", error);
    return res.status(500).json({ message: "Error creating technician" });
  }
  if (!newTech) {
    return res.status(400).json({ message: "Technician creation failed" });
  }
  return res.status(201).json({ message: "Technician created successfully", technician: newTech });
};

// Get one by technicianId
const getTechnicianById = async (req, res, next) => {
  const id = req.params.id;

  let tech;
  try {
    tech = await Technician.findOne({ technicianId: id });
  } catch (error) {
    console.log("Error fetching technician:", error);
    return res.status(500).json({ message: "Error fetching technician" });
  }
  if (!tech) {
    return res.status(404).json({ message: "Technician not found" });
  }
  return res.status(200).json({ technician: tech });
};

// Update by technicianId
const updateTechnician = async (req, res, next) => {
  const id = req.params.id;
  const { name, skills, availability, workload, createdAt } = req.body;

  let tech;
  try {
    tech = await Technician.findOneAndUpdate(
      { technicianId: id },
      { name, skills, availability, workload, createdAt },
      { new: true }
    );
  } catch (error) {
    console.log("Error updating technician:", error);
    return res.status(500).json({ message: "Error updating technician" });
  }
  if (!tech) {
    return res.status(404).json({ message: "Technician not found" });
  }
  return res.status(200).json({ message: "Technician updated successfully", technician: tech });
};

// Delete by technicianId
const deleteTechnician = async (req, res, next) => {
  const id = req.params.id;

  let tech;
  try {
    tech = await Technician.findOneAndDelete({ technicianId: id });
  } catch (error) {
    console.log("Error deleting technician:", error);
    return res.status(500).json({ message: "Error deleting technician" });
  }
  if (!tech) {
    return res.status(404).json({ message: "Technician not found" });
  }
  return res.status(200).json({ message: "Technician deleted successfully", technician: tech });
};

exports.createTechnician = createTechnician;
exports.getAllTechnicians = getAllTechnicians;
exports.getTechnicianById = getTechnicianById;
exports.updateTechnician = updateTechnician;
exports.deleteTechnician = deleteTechnician;
