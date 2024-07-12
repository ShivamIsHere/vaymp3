const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
  },
  tags: {
    type: String,
  },
  ShopPrice:{
    type: Number,
    required:[true, "Please enter shop's Marked price!"],
  },
  originalPrice: {
    type: Number,
    required: [true, "Please enter  product price!"],

  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  stock: [{
    size: {
      type: String,
      enum: ['Free Size', '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL','3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14', '14.5', '15', '15.5', '16'],
      required: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    required: {
      type: Boolean,
      default: true
    },
    isSelected:{
      type:Boolean,
      default:false
    }
  }], 
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  subCategory: {
    type: String,
  },
  neckType: {
    type: String,
    default:"",
  },
  shoeOccasions: {
    type: String,
    default:"",
  },
  accessorySubCategories: {
    type: String,
    default:"",
  },
  footwearSubCategories: {
    type: String,
    default:"",
  },
  sleeveType: {
    type: String,
  },
  
  brand: {
    type: String,
  },
  color: {
    type: String,
  },
  fabric: {
    type: String,
  },
  occasion: {
    type: String,
  },
  
  fit: {
    type: String,
  },
  currentCity:{
    type: String,
    default:"Phagwara"
  },
  currentZipCode:{
    type: Number,
    default:144411
  },
  listing: {
    type: String,
    default:"Product"
  },
  eventType:{
    type: String,
  },
  eventDescription: {
    type: String,
  },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  gender: { 
    type: String,
    required: [true, "Please Select gender"],
  },
  
 
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
        min: 1, 
        // default: 1,
      },
      
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      kuchviId: {
        type: String,
      },
      createdAt:{
        type: Date,
        default: Date.now(),
      }
    },
  ],
  ratings: {
    type: Number,
    default: 5,

  },
  adminCreated:{
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
