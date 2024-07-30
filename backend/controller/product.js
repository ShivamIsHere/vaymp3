const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Kuchvi = require("../model/kuchvi");
const Order = require("../model/order");

const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

router.post(
  "/create-product",
  // isAuthenticated,
  // isAdmin("Admin"),
  
  catchAsyncErrors(async (req, res, next) => {

    try {
      const shopId = req.body.shopId;
      if (!shopId) {
        return next(new ErrorHandler("Shop Id is required!", 400));
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      let images = [];

      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
      

      // Validate other data fields here
      const { name, category, ShopPrice,originalPrice, discountPrice, stock,gender,color } = req.body;
      // console.log(req.body)
      if (!name  || !category ||!ShopPrice||!originalPrice ||  !discountPrice || !stock || !gender || !color|| !images) {
        // console.log("object1111",originalPrice)
        
        return next(new ErrorHandler("Invalid product data. Please provide all required fields.", 400));

      }

      const imagesLinks = [];
    
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
    
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    
      const productData = { ...req.body, images: imagesLinks };
      productData.shop = shop;

      const product = await Product.create(productData);
//       console.log("object",abc)
// console.log("productdata",productData)
// console.log("product",product)

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

router.patch("/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {  listing } = req.body;

    console.log('Received ID:', id);
    console.log('Received listing type:', listing);

    const product = await Product.findByIdAndUpdate(
      id,
      { listing: listing },
      { new: true }
    );

    if (!product) {
      console.log('Product not found');
      return res.status(404).send('Product not found');
    }

    console.log('Updated product:', product);
    res.send(product);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});



// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  
    catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      const pro= products.filter((p)=>p.listing!="Event" && p.shop.shopIsActive===false)

      const filteredProducts = pro.filter(product =>
        product.stock.some(stockItem => stockItem.quantity > 0)
      );

      res.status(201).json({
        success: true,
        products: filteredProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//delete products from shop
router.delete(
  "/delete-shop-product/:id",
  isAuthenticated,
  isAdmin("Admin"),
  
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      console.log('Product ID:', productId); // Debugging statement

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id", 404));
      }

      for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
        console.log("Image deleted from cloudinary:", result);
      }

      if (typeof product.remove !== 'function') {
        return next(new ErrorHandler("Cannot delete product. Remove method not available.", 500));
      }

      await product.remove();

      console.log("Product deleted from database:", productId);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return next(new ErrorHandler("Error deleting product", 500));
    }
  })
);

router.get(
  '/get-all-products',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 40; // Adjust as needed

      let sortBy = "";
      let sortOrder = -1;

      if (req.query.sortBy === "priceHighToLow") {
        sortBy = "discountPrice";
      } else if (req.query.sortBy === "priceLowToHigh") {
        sortBy = "discountPrice";
        sortOrder = 1;
      } else if (req.query.sortBy === "latest") {
        sortBy = "-createdAt";
      } else {
        sortBy = "originalPrice";
      }

      const filters = {
        'shop.shopIsActive': false,
        'listing': "Product"
      };

      if (req.query.category) {
        filters.category = { $in: req.query.category.split(',') };
      }
      if (req.query.subCategory) {
        filters.subCategory = { $in: req.query.subCategory.split(',') };
      }
      if (req.query.sleeveType) {
        filters.sleeveType = { $in: req.query.sleeveType.split(',') };
      }
      if (req.query.neckType) {
        filters.neckType = { $in: req.query.neckType.split(',') };
      }
      if (req.query.color) {
        filters.color = { $in: req.query.color.split(',') };
      }
      if (req.query.fit) {
        filters.fit = { $in: req.query.fit.split(',') };
      }
      if (req.query.fabric) {
        filters.fabric = { $in: req.query.fabric.split(',') };
      }
      if (req.query.gender) {
        filters.gender = { $in: req.query.gender.split(',') };
      }
      if (req.query.occasion) {
        filters.occasion = { $in: req.query.occasion.split(',') };
      }
      if (req.query.shoeOccasions) {
        filters.shoeOccasions = { $in: req.query.shoeOccasions.split(',') };
      }
      if (req.query.accessorySubCategories) {
        filters.accessorySubCategories = { $in: req.query.accessorySubCategories.split(',') };
      }
      if (req.query.footwearSubCategories) {
        filters.footwearSubCategories = { $in: req.query.footwearSubCategories.split(',') };
      }
      if (req.query.size) {
        filters['stock.size'] = { $in: req.query.size.split(',') };
      }
      if (req.query.customerRating) {
        const ratingRanges = req.query.customerRating.split(',');
        const ratingFilters = ratingRanges.map((range) => {
          const [minRating, maxRating] = range.split('-').map(parseFloat);
          return { ratings: { $gte: minRating, $lte: maxRating } };
        });
        filters.$or = ratingFilters;
      }
      if (req.query.priceRange) {
        const priceRanges = req.query.priceRange.split(',');
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        priceRanges.forEach((range) => {
          const [min, max] = range.split('-').map(parseFloat);
          minPrice = Math.min(minPrice, min);
          maxPrice = Math.max(maxPrice, max);
        });
        filters.discountPrice = { $gte: minPrice, $lte: maxPrice };
      }
      const allProducts = await Product.find(filters)
      const proi= allProducts.filter((p)=>p.listing!="Event")
      // Filter out products with zero quantity in all sizes
      const pros = proi.filter(product => {
        return product.stock.some(stockItem => stockItem.quantity > 0);
      });

      const totalProducts = await Product.countDocuments(filters);
      const paginatedProducts = await Product.find(filters)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * perPage)
        .limit(perPage);
        
      res.status(200).json({
        success: true,
        pro:pros,
        products: paginatedProducts,
        totalProducts: totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / perPage),
      });
      console.log("prroooo",pros.length)

    } catch (error) {
      console.error('Error:', error);
      return next(new ErrorHandler(error, 400));
    }
  })
);














router.get(
  "/get-all-searched-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, page = 1, limit = 5, color, size, brand, neckType, sleeveType, subCategory, fabric, occasion, fit, gender, customerRating, priceRange, sortBy, shoeOccasions, accessorySubCategories, footwearSubCategories,shoeSizes } = req.query;
      let words = query.toLowerCase().split(" ");
       let avail=query.toLowerCase().includes("t shirt")|| query.toLowerCase().includes("t-shirt")|| query.toLowerCase().includes("tshirt")|| query.toLowerCase().includes("t shirts")|| query.toLowerCase().includes("tshirts")|| query.toLowerCase().includes("t-shirtes")|| query.toLowerCase().includes("t shirtes")|| query.toLowerCase().includes("tshirtes");
       let avail2 = words.some(word => ["shirt", "shirts", "Shirt", "Shirts", "Shirt's", "Shirts'", "Shirt'"].some(validWord => word.toLowerCase() === validWord.toLowerCase()));
 
       console.log("query22222",query,avail2)
      //  console.log("query22222",avail2,query)

       const stopWords = [
        "for", "in", "the", "and", "a", "of", "to", "is", "on", "at", "by", "with",
        "from", "as", "about", "into", "through", "during", "before", "after",
        "over", "between", "under", "above", "below", "up", "down", "out", "off",
        "over", "under", "again", "further", "then", "once", "here", "there",
        "when", "where", "why", "how", "all", "any", "both", "each", "few", "more",
        "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
        "than", "too", "very", "s", "t", "can", "will", "just", "don", "should",
        "now","xy"
      ];
      
      words = words.filter(word => !stopWords.includes(word.toLowerCase()));
      

      const quer = words.join(" ");
      // console.log("req.query", req.query);
      

      // Fetch all products
      let filteredProducts = await Product.find({ 'shop.shopIsActive': false }).sort({ createdAt: -1 });

      filteredProducts = filteredProducts.filter(product =>
        product.listing !== "Event"
      );
      let l1=filteredProducts.length;
      // console.log(filteredProducts);
      console.log("11111111111111111", filteredProducts.length);

      // Apply gender filter
      // Apply gender filter
const genderKeywords = [
  "female", "females", "women", "woman", "womans", "womens", "women's", "womens'", "women'", "woman'", "womans'", "woman's",
  "ladies", "ladie's", "lady", "girl", "gurl", "girls", "ladki", "ldki", "gurls","lady'","lady's","ladys'","ladies'","ladies's",
];

const maleKeywords = [
  "male", "males", "mans", "boys", "men", "mens", "men's", "man's", "mens'", "mans'", "guys", "ladka", "boy", "man"
];

words = words.filter(keyword => {
  if (genderKeywords.includes(keyword.toLowerCase())) {
    filteredProducts = filteredProducts.filter(val => 
      val.gender?.toLowerCase() === "women" || 
      val.gender?.toLowerCase() === "girls" || 
      val.gender?.toLowerCase().includes('girl') || 
      val.gender?.toLowerCase() === "boys & girls"
    );
    console.log("aaaaaaaaaaaaaaaaaaaa", filteredProducts.length);
    return false; // Remove the keyword from words array after filtering
  } else if (maleKeywords.includes(keyword.toLowerCase())) {
    filteredProducts = filteredProducts.filter(val => 
      val.gender?.toLowerCase() === "men" || 
      val.gender?.toLowerCase() === "boys & girls" || 
      val.gender?.toLowerCase().includes('boy') || 
      val.gender?.toLowerCase().includes('boys')
    );
    console.log("bbbbbbbbbbbbbbbbbbbbbbbq", filteredProducts.length);
    return false; // Remove the keyword from words array after filtering
  }
  return true; // Keep the keyword if it does not match
});

// Apply category filter
const shoesCategoryKeywords = [
  "shoes", "shoe", "shoe's", "shoe'", "shoes'", "joota", "juta", "jhoota", "jutta", "slipper", "slippers", "sliper", "slipers"
];

const accessoriesCategoryKeywords = [
  "accessories", "sunglasses", "jhumka", "jumka", "caps", "earrings", "watches", "belts",
  "bracelets", "bags", "purse", "wallets", "trolley", "hat", "scarfs", "stoles",
  "leatherbelts", "smartwatches", "digitalwatches", "analogwatches", "hairbands", "gloves", "drivinggloves"
];

const clothesCategoryKeywords = [
  "clothes", "dresses", "cloths", "cloth", "kapra", "dress"
];

words = words.filter(keyword => {
  if (shoesCategoryKeywords.includes(keyword.toLowerCase())) {
    filteredProducts = filteredProducts.filter(val => val.category?.toLowerCase() === "shoes");
    console.log("22222222222222222", filteredProducts.length);
    return false; // Remove the keyword from words array after filtering
  } else if (accessoriesCategoryKeywords.includes(keyword.toLowerCase())) {
    filteredProducts = filteredProducts.filter(val => val.category?.toLowerCase() === "accessories");
    console.log("333333333333333", filteredProducts.length);
    return false; // Remove the keyword from words array after filtering
  } else if (clothesCategoryKeywords.includes(keyword.toLowerCase())) {
    filteredProducts = filteredProducts.filter(val => val.category?.toLowerCase() !== "accessories" && val.category?.toLowerCase() !== "shoes");
    console.log("44444444444444444", filteredProducts.length);
    return false; // Remove the keyword from words array after filtering
  }
  return true; // Keep the keyword if it does not match
});

      // Apply keyword filtering with remaining words
      const clothesKeywords = [
        "blouses", "tank tops", "sweaters", "hoodies", "jeans", "trousers", "shorts",
        "skirts", "leggings", "jackets", "coats", "blazers", "vests", "raincoats",
        "maxi", "cocktail", "sundresses", "sports bras", "gym tops", "yoga pants", "track pants",
        "running shorts", "pajamas", "robes", "sweatpants", "lounge tops", "half pants", "bras", "panties", "boxers",
        "briefs", "undershirts", "suits", "tuxedos"
      ];
      
      const shoesKeywords = [
        "flip flops", "slide sandals", "house slippers", "thong slippers", "gladiator sandals", "sport sandals", "wedge sandals", "heeled sandals",
        "flat sandals", "sneakers", "running shoes", "loafers", "oxfords", "brogues", "boots", "heels", "flats",
        "moccasins", "derbies", "espadrilles", "crocs"
      ];
      
      // Filter products based on clothesKeywords
      words = words.filter(keyword => {
        if (clothesKeywords.includes(keyword.toLowerCase())) {
          filteredProducts = filteredProducts.filter(product => product.subCategory?.toLowerCase().includes(keyword.toLowerCase()));
          return false; // Remove the keyword from words array after filtering
        }
        return true; // Keep the keyword if it does not match
      });
      
      // Filter products based on shoesKeywords
      words = words.filter(keyword => {
        if (shoesKeywords.includes(keyword.toLowerCase())) {
          filteredProducts = filteredProducts.filter(product => product.footwearSubCategories?.toLowerCase().includes(keyword.toLowerCase()));
          return false; // Remove the keyword from words array after filtering
        }
        return true; // Keep the keyword if it does not match
      });
      
      console.log("Filtered Products after keyword check:", filteredProducts.length);
      console.log("Remaining words after filtering:", words);
      
      // Apply keyword filtering with remaining words
      const filterByWord = (product, word) => {
        const productProperties = [
          product?.subCategory,
          product?.category,
          product?.size,
          product?.color,
          product?.fabric,
          product?.occasion,
          product?.fit,
          product?.sleeveType,
          product?.neckType,
          // product?.tags,
          product?.brand,
          product?.shoeOccasions,
          product?.accessorySubCategories,
          product?.footwearSubCategories,
          product?.shoeSizes,
        ];
        return productProperties.some(prop => prop && prop.toLowerCase().includes(word.toLowerCase()));
      };
      
      console.log("Filtered Products length before filtering by remaining words:", filteredProducts.length);
      
      words.forEach((word, index) => {
        console.log(`Filtering with word (${index}): ${word}`);
        const filtered = filteredProducts.filter(product => filterByWord(product, word));
        console.log(`Filtered length after word (${index}): ${filtered.length}`);
        
        if (filtered.length > 0) {
          filteredProducts = filtered;
          console.log(`Updated filteredProducts after word (${index}): ${filteredProducts.length}`);
        }
         else if (!avail && !avail2 && filtered.length == 0) {
          // Only update filteredProducts to an empty array if neither avail nor avail2 is true
          filteredProducts = filtered;
        }
      });
      
      console.log("Filtered Products after filtering by remaining words:", filteredProducts.length);
      
      
      console.log("Filtered Products after filtering by remaining words:", filteredProducts.length);
      
      console.log("777777777777777", filteredProducts.length);

      if(avail){
        // console.log("lllkjl23",filteredProducts[0])
        const a1=filteredProducts.filter((val)=>{
          console.log("lllll67",val.subCategory,val)
          return val?.subCategory?.includes("T-shirts")
        })
        console.log("lllkjl899",a1.length)
        filteredProducts=a1;
      }

      if(avail2){
        // console.log("lllkjl23",filteredProducts[0])
        const a2=filteredProducts.filter((val)=>{
          // console.log("lllll67",val.subCategory,val)
          return val?.subCategory?.includes("Shirts")
        })
        console.log("lllkjl899",a2.length)
        filteredProducts=a2;
      }
      let l2 = filteredProducts.length;
      let l3 = (l1 === l2) ? 0 : l2;

      // Apply additional filters
      if (color) {
        const colorsArray = color.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          colorsArray.some(selectedColor =>
            product.color?.toLowerCase() === selectedColor.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after color filter:", filteredProducts.length);
  
      if (subCategory) {
        const subCategoryArray = subCategory.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          subCategoryArray.some(selectedSubCategory =>
            product.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after subCategory filter:", filteredProducts.length);

      if (neckType) {
        const neckTypeArray = neckType.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          neckTypeArray.some(selectedNeckType =>
            product.neckType?.toLowerCase() === selectedNeckType.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after neckType filter:", filteredProducts.length);

      if (sleeveType) {
        const sleeveTypeArray = sleeveType.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          sleeveTypeArray.some(selectedSleeveType =>
            product.sleeveType?.toLowerCase() === selectedSleeveType.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after sleeveType filter:", filteredProducts.length);

      if (shoeSizes) {
        const sizesArray = shoeSizes.split(',').map(s => s.trim());
        filteredProducts = filteredProducts.filter(product =>
          sizesArray.some(selectedSize =>
            product.stock.some(stockItem => stockItem.size.toLowerCase() === selectedSize)
          )
        );
      }

      if (size) {
        const sizesArray = size.split(',').map(s => s.trim());
        filteredProducts = filteredProducts.filter(product =>
          sizesArray.some(selectedSize =>
            product.stock.some(stockItem => stockItem.size.toLowerCase() === selectedSize.toLowerCase())
          )
        );
      }

      console.log("Filtered Products Count after size filter:", filteredProducts.length);

      if (brand) {
        const brandsArray = brand.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          brandsArray.some(selectedBrand =>
            product.brand?.toLowerCase() === selectedBrand.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after brand filter:", filteredProducts.length);

      if (fit) {
        const fitsArray = fit.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          fitsArray.some(selectedFit =>
            product.fit?.toLowerCase() === selectedFit.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after fit filter:", filteredProducts.length);

      if (occasion) {
        const occasionsArray = occasion.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          occasionsArray.some(selectedOccasion =>
            product.occasion?.toLowerCase() === selectedOccasion.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after occasion filter:", filteredProducts.length);

      if (shoeOccasions) {
        const shoeOccasionsArray = shoeOccasions.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          shoeOccasionsArray.some(selectedShoeOccasion =>
            product.shoeOccasions?.toLowerCase() === selectedShoeOccasion.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after shoeOccasions filter:", filteredProducts.length);

      if (accessorySubCategories) {
        const accessorySubCategoriesArray = accessorySubCategories.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          accessorySubCategoriesArray.some(selectedAccessorySubCategory =>
            product.accessorySubCategories?.toLowerCase() === selectedAccessorySubCategory.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after accessorySubCategories filter:", filteredProducts.length);

      if (footwearSubCategories) {
        const footwearSubCategoriesArray = footwearSubCategories.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          footwearSubCategoriesArray.some(selectedFootwearSubCategory =>
            product.footwearSubCategories?.toLowerCase() === selectedFootwearSubCategory.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after footwearSubCategories filter:", filteredProducts.length);

      if (fabric) {
        const fabricsArray = fabric.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          fabricsArray.some(selectedFabric =>
            product.fabric?.toLowerCase() === selectedFabric.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after fabric filter:", filteredProducts.length);

      if (gender) {
        const gendersArray = gender.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          gendersArray.some(selectedGender =>
            product.gender?.toLowerCase() === selectedGender.toLowerCase()
          )
        );
      }

      console.log("Filtered Products Count after gender filter:", filteredProducts.length);

      if (customerRating) {
        const ratingRanges = customerRating.split(',');
        filteredProducts = filteredProducts.filter(product =>
          ratingRanges.some(range => {
            if (range === "3-and-below") {
              return product.ratings <= 3;
            } else if (range === "3-to-4") {
              return product.ratings >= 3
            } else if (range === "4-and-above") {
              return product.ratings >= 4;
            }
            return false;
          })
        );
      }

      console.log("Filtered Products Count after customerRating filter:", filteredProducts.length);

      if (priceRange) {
        const priceRanges = priceRange.split(',');
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        priceRanges.forEach((range) => {
          const [min, max] = range.split('-').map(parseFloat);
          minPrice = Math.min(minPrice, min);
          maxPrice = Math.max(maxPrice, max);
        });
        filteredProducts = filteredProducts.filter(product =>
          product.discountPrice >= minPrice && product.discountPrice <= maxPrice
        );
        console.log("Filtered Products Count after priceRange filter:", filteredProducts.length);
        
      }

      
      console.log("Filtered Products Count after removing 'Event' listings:", filteredProducts.length);

      // Filter out products with zero quantity in all sizes
      filteredProducts = filteredProducts.filter(product =>
        product.stock.some(stockItem => stockItem.quantity > 0)
      );
      console.log("Filtered Products Count after filtering zero quantity:", filteredProducts.length);
      // console.log("Filtered Products Count after filtering zero quantity:", l3);

      // Apply sorting
      if (sortBy) {
        const sortFields = {
          'price-asc': { discountPrice: 1 },
          'price-desc': { discountPrice: -1 },
          'rating-asc': { ratings: 1 },
          'rating-desc': { ratings: -1 },
          'date-asc': { createdAt: 1 },
          'date-desc': { createdAt: -1 }
        };
        const sortOrder = sortFields[sortBy] || { createdAt: -1 };
        filteredProducts = filteredProducts.sort((a, b) => {
          for (let field in sortOrder) {
            if (a[field] < b[field]) return sortOrder[field] === 1 ? -1 : 1;
            if (a[field] > b[field]) return sortOrder[field] === 1 ? 1 : -1;
          }
          return 0;
        });
      }

      console.log("Final Filtered Products Count:", filteredProducts.length);

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      console.log("Paginated Products Count:", paginatedProducts.length);

      res.status(200).json({
        success: true,
        message: `Total ${filteredProducts.length} Products found!`,
        products: paginatedProducts,
        totalProducts: filteredProducts.length,
        l3:l3,
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit)
      });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching products."
      });
    }
  })
);








































// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, kuchviId,orderId } = req.body;

      const product = await Product.findById(productId);
      const order = await Order.findById(orderId);

      const review = {
        user,
        rating,
        comment,
        productId,
        kuchviId,
        orderId
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id.toString() === user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id.toString() === user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      if (order) {
        order.cart.forEach((item) => {
          if (item.productId.toString() === productId.toString()) {
            item.isReviewed = true;
          }
        });
        await order.save({ validateBeforeSave: false });
      }

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });

      const filteredProducts = products.filter((product) => product.listing !== "Event");

      res.status(201).json({
        success: true,
        products: filteredProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




// Update stock for a single product
router.patch(
  "/update-stock/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const { stock, sold_out } = req.body; // New stock object from the request body

      // Find the product by ID in the database
      const product = await Product.findById(productId);

      // Check if the product exists
      if (!product) {
        return next(new ErrorHandler(`Product not found with ID: ${productId}`, 404));
      }

      // Update the product's stock with the new stock array
      product.stock = stock;

      // Save the updated product
      await product.save();

      // Send success response
      res.status(200).json({
        success: true,
        message: "Product stock updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




// Update stock for a single product
router.patch(
  "/seller-update-stock/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const { size, quantity } = req.body; // New size and quantity from the request body

      // Find the product by ID in the database
      const product = await Product.findById(productId);

      // Check if the product exists
      if (!product) {
        return next(new ErrorHandler(`Product not found with ID: ${productId}`, 404));
      }

      // Find the index of the size in the stock array
      const sizeIndex = product.stock.findIndex((item) => item.size === size);

      // Update the quantity of the specific size if found, otherwise add a new entry
      if (sizeIndex !== -1) {
        product.stock[sizeIndex].quantity = quantity;
      } else {
        product.stock.push({ size, quantity });
      }

      // Save the updated product
      await product.save();

      // Send success response
      res.status(200).json({
        success: true,
        message: `Stock for size ${size} updated successfully`,
        product,
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.put(
  "/upload-shop-avatar",
    isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId, avatar } = req.body;
      if (!shopId) {
        return next(new ErrorHandler("Shop Id is required!", 400));
      }

      const existsSeller = await Shop.findById(shopId);
      if (!existsSeller) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      if (existsSeller.avatar && existsSeller.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(existsSeller.avatar.public_id);
      }

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });

      existsSeller.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      const updateResultForProduct = await Product.updateMany(
        { shopId: shopId },
        {
          $set: {
            "shop.avatar.public_id": myCloud.public_id,
            "shop.avatar.url": myCloud.secure_url,
          }
        }
      );

      // console.log("updateResultForProduct", updateResultForProduct);
      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



module.exports = router;
