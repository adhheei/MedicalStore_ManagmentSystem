import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter medicine name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please enter category'],
    },
    brand: {
      type: String,
      default: 'Generic',
    },
    price: {
      type: Number,
      required: [true, 'Please enter price per unit'],
    },
    stock: {
      type: Number,
      required: [true, 'Please enter available stock'],
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please specify expiry date'],
    },
    batchNumber: {
      type: String,
      required: [true, 'Please enter batch number'],
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;