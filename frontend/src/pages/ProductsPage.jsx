
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { getAllProducts } from "../redux/actions/product";
import { categoriesData, sleeveType, neckType, color, fabric, occasion, fit, gender, size, subCategory ,shoeSizes,shoeOccasions,accessorySubCategories,footwearSubCategories } from "../static/data"; // Assuming data is imported correctly
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineClose, AiFillFilter, AiOutlineSwap } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import ClipLoader from "react-spinners/ClipLoader";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoriesParam = searchParams.get("category");
  const { allPro, allProduct, isLoading, totalPages } = useSelector((state) => state.products);
  // console.log("allProducts",allProducts)
  console.log("allProduct",allProduct)

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [filters, setFilters] = useState({
    category: categoriesParam ? categoriesParam.split(',') : [],
    subCategory: [],
    shoeOccasions: [],
    accessorySubCategories: [],
    footwearSubCategories: [],
    color: [],
    size: [],
    neckType: [],
    sleeveType: [],
    gender: [],
    fabric: [],
    fit: [],
    occasion: [],
    shoeSizes: [],
    sortBy: "",
    sortOrder: "desc",
    customerRating: [],
    priceRange: [],
  });
  
  // State variables to track the expanded/collapsed state for each filter section
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [subCategoryExpanded, setSubCategoryExpanded] = useState(false);
  const [sizeExpanded, setSizeExpanded] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [fabricExpanded, setFabricExpanded] = useState(false);
  const [occasionExpanded, setOccasionExpanded] = useState(false);
  const [fitExpanded, setFitExpanded] = useState(false);
  const [genderExpanded, setGenderExpanded] = useState(false);
  const [sleeveTypeExpanded, setSleeveTypeExpanded] = useState(false);
  const [neckTypeExpanded, setNeckTypeExpanded] = useState(false);
  const [customerRatingExpanded, setCustomerRatingExpanded] = useState(false);
  const [priceRangeExpanded, setPriceRangeExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllNeckTypes, setShowAllNeckTypes] = useState(false);

  // const [perPage] = useState(30); // Or any default value you prefer

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 1.0,
  });



  // useEffect(() => {
  //   if (inView && !isLoading && page < totalPages) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // }, [inView, page,isLoading, totalPages]);
  useEffect(() => {
    if (inView && !isLoading&& page < totalPages) {
      handlePageChange(page + 1);
    }
  }, [inView, page, totalPages,isLoading]);
  

  useEffect(() => {
    applyFilters();
  }, [filters, page]);

  useEffect(() => {
    if (categoriesParam === null) {
      setData(allPro);
    } else {
      const filteredData = allPro.filter((item) => filters.category.includes(item.category));
      setData(filteredData);
    }
  }, [allPro, categoriesParam, filters.category]);

  useEffect(() => {
    // Update data and datas based on viewport size
    if (window.innerWidth < 1024) {
      setDatas((prevDatas) => [...prevDatas, ...allProduct]);
      setData(datas); // Optionally update data separately if needed
    } else {
      setData(allPro);
      setDatas([]); // Clear datas for desktop view
    }
  }, [allPro, allProduct]);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters };
    if (
      key === "size" ||
      key === "sleeveType" ||
      key === "subCategory" ||
      key === "neckType" ||
      key === "fabric" ||
      key === "fit" ||
      key === "gender" ||
      key === "occasion" ||
      key === "color"||
      key === "shoeOccasions"||
      key === "accessorySubCategories"||
      key === "footwearSubCategories" ||
      key === "shoeSizes"
    ) {
      const index = updatedFilters[key].indexOf(value);
      if (index === -1) {
        updatedFilters[key].push(value);
      } else {
        updatedFilters[key].splice(index, 1);
      }
    } else if (key === "priceRange" || key === "customerRating") {
      const index = updatedFilters[key].indexOf(value);
      if (index === -1) {
        updatedFilters[key].push(value);
      } else {
        updatedFilters[key].splice(index, 1);
      }
    } else if (key === "category") {
      const index = updatedFilters[key].indexOf(value);
      if (index === -1) {
        updatedFilters[key].push(value);
      } else {
        updatedFilters[key].splice(index, 1);
      }
    } else {
      updatedFilters[key] = value;
    }
    setFilters(updatedFilters);
    setPage(1); // Reset to the first page when filters change
  };

  const applyFilters = () => {
    const queryParams = {
      ...filters,
      page,
      // perPage,
    };
    dispatch(getAllProducts(queryParams));
  };

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  // useEffect(() => {
  //   applyFilters();
  // }, [filters]);

  const closeFilterDrawer = () => {
    setFilterDrawerOpen(false);
  };

  const closeSortDrawer = () => {
    setSortDrawerOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      subCategory: [],
      color: [],
      size: [],
      shoeOccasions: [],
      accessorySubCategories: [],
      footwearSubCategories: [],
      shoeSizes:[],
      neckType: [],
      sleeveType: [],
      gender: [],
      fabric: [],
      fit: [],
      occasion: [],
      sortBy: "",
      sortOrder: "desc",
      customerRating: [],
      priceRange: [],
    });
    window.location.reload()
    setPage(1); // Reset to the first page when filters change
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  const visibleSizes = showAllSizes ? size : size.slice(0, 6);
  const visibleSubCategories = showAllSubCategories ? subCategory : subCategory.slice(0, 6);
  const visibleColors = showAllColors ? color : color.slice(0, 6);
  const visibleNeckTypes = showAllNeckTypes ? neckType : neckType.slice(0, 6);

  return (
    <>
      {isLoading && page === 1 ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={2} />
          {/* FOR MOBILE VIEW */}
          {categoriesParam ==="Cloths" && (
            <div className="flex mb-0 sticky top-28 z-10" style={{ zIndex: 1 }}>
              <div className="w-1/2">
                <button
                  onClick={() => setFilterDrawerOpen(true)}
                  className="w-full bg-blue-100 flex items-center justify-center font-bold text-lg tracking-wider border-t-1 border-b-2 text-gray-700 p-3 rounded-lg mb-2 border-gray-500 transition duration-300 ease-in-out md:hidden"
                >
                  <AiFillFilter className="mr-2 text-xl text-gray-800" />
                  Filter

                </button>
              </div>
              <div className="w-1/2">
                <button
                  onClick={() => setSortDrawerOpen(true)}
                  className="w-full bg-blue-100 flex items-center justify-center font-bold text-lg tracking-wider border-t-1 border-b-2 text-gray-700 p-3 rounded-lg mb-2 border-gray-500 transition duration-300 ease-in-out md:hidden"
                >

                  <AiOutlineSwap className="text-xl text-gray-800 mr-2" />
                  Sort

                </button>
              </div>
            </div>
          )}

          {/* for larger screen */}
          {categoriesParam ==="Cloths"  && (
            <div className=" bg-gray-100 flex -mb-1 mr-14 ml-16 rounded-full sticky top-28 justify-between items-center"
              style={{ zIndex: 1 }}
            >
            <h4 className="text-4xl font-semibold text-gray-700 hidden md:block">New Arrivals</h4>
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="w-1/6  font-bold text-lg bg-white text-gray-800 px-4 py-2 tracking-wider rounded-full border border-gray-300 shadow-sm mr-11 ml-auto hidden md:flex items-center justify-center space-x-2  hover:bg-blue-100 transition duration-300 ease-in-out"              
                >
                <AiFillFilter className="text-xl text-gray-800" />
                <span className="text-center">Filter</span>

              </button>

              <button
                onClick={() => setSortDrawerOpen(true)}
                className="w-1/6 font-bold text-lg bg-white text-gray-800 px-4 py-2 tracking-wider rounded-full border border-gray-300 shadow-sm hidden md:flex items-center justify-center space-x-2 hover:bg-blue-100 transition duration-300 ease-in-out"
                >

<AiOutlineSwap className="text-xl text-gray-800" />
<span className="text-center">Sort</span>

              </button>
            </div>

          )}
          {/* FOR MOBILE VIEW */}
          {categoriesParam ==="Shoes" && (
            <div className="flex mb-0 sticky top-28 z-10" style={{ zIndex: 1 }}>
              <div className="w-1/2">
                <button
                  onClick={() => setFilterDrawerOpen(true)}
                  className="w-full bg-blue-100 flex items-center justify-center font-bold text-lg tracking-wider border-t-1 border-b-2 text-gray-700 p-3 rounded-lg mb-2 border-gray-500 transition duration-300 ease-in-out md:hidden"
                >
                  <AiFillFilter className="mr-2 text-xl text-gray-800" />
                  Filter

                </button>
              </div>
              <div className="w-1/2">
                <button
                  onClick={() => setSortDrawerOpen(true)}
                  className="w-full bg-blue-100 flex items-center justify-center font-bold text-lg tracking-wider border-t-1 border-b-2 text-gray-700 p-3 rounded-lg mb-2 border-gray-500 transition duration-300 ease-in-out md:hidden"
                >

                  <AiOutlineSwap className="text-xl text-gray-800 mr-2" />
                  Sort

                </button>
              </div>
            </div>
          )}

          {/* for larger screen */}
          {categoriesParam ==="Shoes"  && (
            <div className=" bg-gray-100 flex -mb-1 mr-14 ml-16 rounded-full sticky top-28 z-10 justify-between items-center">
              <h4 className="text-4xl font-semibold text-gray-700 hidden md:block">New Arrivals</h4>
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="w-1/6  font-bold text-lg bg-white text-gray-800 px-4 py-2 tracking-wider rounded-full border border-gray-300 shadow-sm space-x-2 mr-11 ml-auto hidden md:block  hover:bg-blue-100 transition duration-300 ease-in-out"
              >
                <AiFillFilter className="ml-11 -mb-6 text-xl text-gray-800" />
                filter

              </button>

              <button
                onClick={() => setSortDrawerOpen(true)}
                className="w-1/6 font-bold text-lg bg-white text-gray-800 px-4 py-2 tracking-wider rounded-full border border-gray-300 shadow-sm hidden md:block hover:bg-blue-100 transition duration-300 ease-in-out"
              >

                <AiOutlineSwap className=" ml-11 -mb-6 text-xl text-gray-800 mr-2" />
                Sort

              </button>
            </div>

          )}


<div className={`${styles.section}`}>
            <div className="pt-0 hidden md:block">
              {/* <div className="grid grid-cols-2 md:grid-cols-2 lg:hidden gap-1 w-full mx-0">
                {datas.map((product) => (
                  <ProductCard data={product} key={product._id} />
                ))}
              </div> */}
              <div className="hidden lg:grid lg:grid-cols-5 gap-8 w-full px-14 mt-2">
                {data.map((product) => (
                  <ProductCard data={product} key={product._id} />
                ))}
              </div>
              {data.length === 0 ? (
                <div className="flex justify-center items-center">
                <img src={`${process.env.PUBLIC_URL}/noproductshd.png`} alt="No Products Found" className="max-w-4/5 max-h-4/5" />
              </div>
            ) : null}
              {/* Pagination for larger screens */}
              <div className="mt-4 flex justify-center md:flex">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border mx-1 ${page === index + 1 ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-0 md:hidden">
              {/* Auto-load more products on scroll for mobile */}
              <div className="grid grid-cols-2 gap-1 mb-12">
                {datas.map((product, index) => (
                  <ProductCard key={index} data={product} />
                ))}
              </div>
              {datas.length === 0 ? (
                <div className="flex justify-center items-center">
                <img src={`${process.env.PUBLIC_URL}/noproductshd.png`} alt="No Products Found" className="max-w-4/5 max-h-4/5" />
              </div>
            ) : null}
              <div ref={loadMoreRef} className="mt-4 flex justify-center">
                {isLoading===true && (
                  <ClipLoader
                    color="#2874F0"
                    size={55}
                    thick={50}
                    speedMultiplier={1}
                  />
                )}
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      )}

      {/* Filter Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="bg-white w-80 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filter Options</h2>
              <AiOutlineClose className="cursor-pointer" onClick={closeFilterDrawer} />
            </div>

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={clearFilters}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
              >
                Clear Filters
              </button>
            </div>

            {/* Add filter options here */}
            {categoriesParam==="Cloths"&&<div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setSizeExpanded(!sizeExpanded)}>
                Size
                {!sizeExpanded ? (
                  <AiOutlineCaretDown className="h-6" />
                ) : (
                  <AiOutlineCaretUp className="h-6" />
                )}
              </label>
              {sizeExpanded && (
                <div className="pl-4">
                  {visibleSizes.map((option, index) => (
                    // {size.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="size"
                        value={option.type}
                        onChange={(e) => {
                          handleFilterChange("size", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.size.includes(option.type)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.type}</label>
                    </div>
                  ))}
                  {size.length > 6 && (
                    <button
                      onClick={() => setShowAllSizes(!showAllSizes)}
                      className="text-blue-500 hover:underline"
                    >
                      {showAllSizes ? 'Show Less' : 'See More'}
                    </button>
                  )}
                </div>
              )}
            </div>}
            {categoriesParam==="Shoes"&&<div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setSizeExpanded(!sizeExpanded)}>
                Size
                {!sizeExpanded ? (
                  <AiOutlineCaretDown className="h-6" />
                ) : (
                  <AiOutlineCaretUp className="h-6" />
                )}
              </label>
              {sizeExpanded && (
                <div className="pl-4">
                  {shoeSizes.map((option, index) => (
                    // {size.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="shoeSizes"
                        value={option.type}
                        onChange={(e) => {
                          handleFilterChange("size", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.size.includes(option.type)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.type}</label>
                    </div>
                  ))}
                  {shoeSizes.length > 6 && (
                    <button
                      onClick={() => setShowAllSizes(!showAllSizes)}
                      className="text-blue-500 hover:underline"
                    >
                      {showAllSizes ? 'Show Less' : 'See More'}
                    </button>
                  )}
                </div>
              )}
            </div>}
            {/* Add other filter sections similarly */}
            {categoriesParam==="Cloths"&&<div className="mb-4">
              <label
                className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                onClick={() => setSubCategoryExpanded(!subCategoryExpanded)}
              >
                Category
                {!subCategoryExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {subCategoryExpanded && (
                <div className="pl-4">
                  {visibleSubCategories.map((option, index) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="subCategory"
                        value={option.title}
                        onChange={(e) => {
                          handleFilterChange("subCategory", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.subCategory.includes(option.title)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.title}</label>
                    </div>
                  ))}
                  {subCategory.length > 6 && (
                    <button
                      onClick={() => setShowAllSubCategories(!showAllSubCategories)}
                      className="text-blue-500 hover:underline"
                    >
                      {showAllSubCategories ? 'Show Less' : 'See More'}
                    </button>
                  )}
                </div>
              )}
            </div>}
            {categoriesParam==="Shoes"&&<div className="mb-4">
              <label
                className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                onClick={() => setSubCategoryExpanded(!subCategoryExpanded)}
              >
                Category
                {!subCategoryExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {subCategoryExpanded && (
                <div className="pl-4">
                  {footwearSubCategories.map((option, index) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="footwearSubCategories"
                        value={option.title}
                        onChange={(e) => {
                          handleFilterChange("footwearSubCategories", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.footwearSubCategories.includes(option.title)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.title}</label>
                    </div>
                  ))}
                  {footwearSubCategories.length > 6 && (
                    <button
                      onClick={() => setShowAllSubCategories(!showAllSubCategories)}
                      className="text-blue-500 hover:underline"
                    >
                      {showAllSubCategories ? 'Show Less' : 'See More'}
                    </button>
                  )}
                </div>
              )}
            </div>}
            {/* Color filter section */}
            <div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setColorExpanded(!colorExpanded)}>
                Color
                {!colorExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {colorExpanded && (
                <div className="pl-4">
                  {visibleColors.map((option, index) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="color"
                        value={option.name}
                        onChange={(e) => {
                          handleFilterChange("color", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.color.includes(option.name)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.name}</label>
                    </div>
                  ))}
                  {color.length > 6 && (
                    <button
                      onClick={() => setShowAllColors(!showAllColors)}
                      className="text-blue-500 hover:underline"
                    >
                      {showAllColors ? 'Show Less' : 'See More'}
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* add more filter */}
            {/* Fabric filter section */}
            {categoriesParam==="Cloths"&&<div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setFabricExpanded(!fabricExpanded)}>
                Fabric
                {!fabricExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {fabricExpanded && (
                <div className="pl-4">
                  {fabric.map((option) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="fabric"
                        value={option.type}
                        onChange={(e) => {
                          handleFilterChange("fabric", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.fabric.includes(option.type)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.type}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>}
            {/* Occasion filter section */}
            {categoriesParam==="Cloths"&&<div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setOccasionExpanded(!occasionExpanded)}>Occasion
                {!occasionExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {occasionExpanded && (
                <div className="pl-4">
                  {occasion.map((option) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="occasion"
                        value={option.type}
                        onChange={(e) => {
                          handleFilterChange("occasion", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.occasion.includes(option.type)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.type}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>}
            {categoriesParam==="Shoes"&&<div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setOccasionExpanded(!occasionExpanded)}>Occasion
                {!occasionExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {occasionExpanded && (
                <div className="pl-4">
                  {shoeOccasions.map((option) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="shoeOccasions"
                        value={option.type}
                        onChange={(e) => {
                          handleFilterChange("shoeOccasions", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.shoeOccasions.includes(option.type)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.type}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>}
            {/* Fit filter section */}
            {categoriesParam==="Cloths"&&<div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setFitExpanded(!fitExpanded)}>
                Fit
                {!fitExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {fitExpanded && (
                <div className="pl-4">
                  {fit.map((option) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="fit"
                        value={option.type}
                        onChange={(e) => {
                          handleFilterChange("fit", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.fit.includes(option.type)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.type}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>}
            {/* Gender filter section */}
            <div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setGenderExpanded(!genderExpanded)}>
                Gender
                {!genderExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {genderExpanded && (
                <div className="pl-4">
                  {gender.map((option) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="gender"
                        value={option.type}
                        onChange={(e) => {
                          handleFilterChange("gender", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.gender.includes(option.type)}
                        className="mr-2"
                      />
                      <label htmlFor={option.id}>{option.type}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Sleeve Type filter section */}
            {categoriesParam==="Cloths"&&<div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setSleeveTypeExpanded(!sleeveTypeExpanded)}>Sleeve Type
                {!sleeveTypeExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {sleeveTypeExpanded && (
                <div className="pl-4">
                  {sleeveType.map((option) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="sleeveType"
                        value={option.title}
                        onChange={(e) => {
                          handleFilterChange("sleeveType", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.sleeveType.includes(option.title)}
                        className="ml-2"
                      />
                      <label htmlFor={option.id}>{option.title}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>}
            {/* Neck Type filter section */}
            {categoriesParam==="Cloths"&&<div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setNeckTypeExpanded(!neckTypeExpanded)}>Neck Type
                {!neckTypeExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {neckTypeExpanded && (
                <div className="pl-4">
                  {visibleNeckTypes.map((option, index) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="neckType"
                        value={option.title}
                        onChange={(e) => {
                          handleFilterChange("neckType", e.target.value);
                          applyFilters();
                        }}
                        checked={filters.neckType.includes(option.title)}
                        className="ml-2"
                      />
                      <label htmlFor={option.id}>{option.title}</label>
                    </div>
                  ))}
                  {neckType.length > 6 && (
                    <button
                      onClick={() => setShowAllNeckTypes(!showAllNeckTypes)}
                      className="text-blue-500 hover:underline"
                    >
                      {showAllNeckTypes ? 'Show Less' : 'See More'}
                    </button>
                  )}
                </div>
              )}
            </div>}
            {/* Customer Rating filter section */}
            <div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setCustomerRatingExpanded(!customerRatingExpanded)}>
                Customer Rating
                {!customerRatingExpanded ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </label>
              {customerRatingExpanded && (
                <div className="pl-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="rating4"
                      value="4-5"
                      checked={filters.customerRating.includes("4-5")}
                      onChange={(e) => {
                        handleFilterChange("customerRating", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="rating4" >
                      4 and above
                    </label>
                  </div>

                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="rating3to4"
                      value="3-4"
                      checked={filters.customerRating.includes("3-4")}
                      onChange={(e) => {
                        handleFilterChange("customerRating", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="rating3to4">
                      3 to 4
                    </label>
                  </div>

                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="rating3below"
                      value="1-3"
                      checked={filters.customerRating.includes("1-3")}
                      onChange={(e) => {
                        handleFilterChange("customerRating", e.target.value);
                        applyFilters();
                      }}
                      flex items-center
                    />
                    <label htmlFor="rating3below" className="ml-2">
                      3 and below
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out" onClick={() => setPriceRangeExpanded(!priceRangeExpanded)}>
                Price Range
                {!priceRangeExpanded ? (
                  <AiOutlineCaretDown className="h-6" />
                ) : (
                  <AiOutlineCaretUp className="h-6" />
                )}
              </label>
              {priceRangeExpanded && (
                <div className="pl-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="price1-199"
                      value="1-199"
                      checked={filters.priceRange.includes("1-199")}
                      onChange={(e) => {
                        handleFilterChange("priceRange", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="price1-199">1 - 199</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="price200-499"
                      value="200-499"
                      checked={filters.priceRange.includes("200-499")}
                      onChange={(e) => {
                        handleFilterChange("priceRange", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="price200-499">200 - 499</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="price500-999"
                      value="500-999"
                      checked={filters.priceRange.includes("500-999")}
                      onChange={(e) => {
                        handleFilterChange("priceRange", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="price500-999">500 - 999</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="price1000-1999"
                      value="1000-1999"
                      checked={filters.priceRange.includes("1000-1999")}
                      onChange={(e) => {
                        handleFilterChange("priceRange", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="price1000-1999">1000 - 1999</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="price2000-3999"
                      value="2000-3999"
                      checked={filters.priceRange.includes("2000-3999")}
                      onChange={(e) => {
                        handleFilterChange("priceRange", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="price2000-3999">2000 - 3999</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="price4000-4999"
                      value="4000-4999"
                      checked={filters.priceRange.includes("4000-4999")}
                      onChange={(e) => {
                        handleFilterChange("priceRange", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="price4000-4999">4000 - 4999</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="price5000-9999"
                      value="5000-9999"
                      checked={filters.priceRange.includes("5000-9999")}
                      onChange={(e) => {
                        handleFilterChange("priceRange", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="price5000-9999">5000 - 9999</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="price10000-1000000000"
                      value="10000-1000000000"
                      checked={filters.priceRange.includes("10000-1000000000")}
                      onChange={(e) => {
                        handleFilterChange("priceRange", e.target.value);
                        applyFilters();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="price10000-1000000000">10000 and above</label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={closeFilterDrawer}></div>
        </div>
      )}

      {/* Sort Drawer */}
      {sortDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end">
          <div className="bg-white w-full md:w-full p-4 overflow-y-auto rounded-t-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Sort Options</h2>
              <AiOutlineClose className="cursor-pointer" onClick={closeSortDrawer} />
            </div>
            {/* Add sorting options here */}
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="sortByPriceHighToLow"
                  name="sortBy"
                  value="priceHighToLow"
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  onClick={closeSortDrawer}
                  checked={filters.sortBy === "priceHighToLow"}
                  className="mr-2"
                />
                <label htmlFor="sortByPriceHighToLow">Price (High to Low)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sortByPriceLowToHigh"
                  name="sortBy"
                  value="priceLowToHigh"
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  onClick={closeSortDrawer}
                  checked={filters.sortBy === "priceLowToHigh"}
                  className="mr-2"
                />
                <label htmlFor="sortByPriceLowToHigh">Price (Low to High)</label>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </>
  );
};

export default ProductsPage;