import Medicine from '../models/medicineModel.js';

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private (Pharmacist & Admin)
export const getMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json(medicines);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new medicine
// @route   POST /api/medicines
// @access  Private (Pharmacist & Admin)
export const addMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    next(error);
  }
};

// @desc    Update medicine stock or details
// @route   PUT /api/medicines/:id
// @access  Private (Pharmacist & Admin)
export const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!medicine) {
      res.status(404);
      throw new Error('Medicine not found');
    }

    res.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete medicine item
// @route   DELETE /api/medicines/:id
// @access  Private (Admin only)
export const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      res.status(404);
      throw new Error('Medicine not found');
    }

    await medicine.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Medicine removed' });
  } catch (error) {
    next(error);
  }
};