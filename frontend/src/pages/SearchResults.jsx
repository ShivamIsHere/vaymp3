import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";
import { useMediaQuery } from 'react-responsive';
import { BiSortAlt2 } from 'react-icons/bi';
import { FaFilter,FaBoxOpen, FaSadTear, FaSearch } from 'react-icons/fa';
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineClose, AiFillFilter, AiOutlineSwap  } from "react-icons/ai";
import {
  categoriesData,
  sleeveType,
  neckType,
  color,
  fabric,
  occasion,
  fit,
  gender,
  size,
  subCategory,
  brandingData,
  shoeSizes,
  shoeOccasions,
  accessorySubCategories,
  footwearSubCategories
} from "../static/data"; // Assuming data is imported correctly
import ClipLoader from "react-spinners/ClipLoader";
import BasicPagination from "./BasicPagination";

const SearchResults = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page')) || 1;
  console.log("khvbvmmvmvumv")
  const [filteredData, setFilteredData] = useState({});
  const [filteredDatas, setFilteredDatas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    brandingDatas: [],
    neckTypes: [],
    sleeveTypes: [],
    fabrics: [],
    occasions: [],
    fits: [],
    subCategorys: [],
    genders: [],
    customerRatings: [],
    priceRanges: [],
    shoeSize:[],
    shoeOccasion:[],
    accessorySubCategorie:[],
    footwearSubCategorie:[],
  });
    const [isClothes, setIsClothes] = useState(false);
    const [isFootWear, setIsFootWear] = useState(false);
    const [isValid, setIsValid] = useState(false);

  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllShoesSizes, setShowAllShoesSizes] = useState(false);
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  const [showAllShoeSubCategories, setShowAllShoesSubCategories] = useState(false);

  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllNeckTypes, setShowAllNeckTypes] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    colors: false,
    sizes: false,
    subCategorys: false,
    neckTypes: false,
    fabrics: false,
    occasions: false,
    fits: false,
    sleeveTypes: false,
    brandingDatas: false,
    genders: false,
    customerRatings: false,
    priceRanges: false,
    shoeSize: false,
    shoeOccasion: false,
    accessorySubCategorie: false,
    footwearSubCategorie: false,
  });

  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });
  const isSmallOrMediumScreen = useMediaQuery({ query: '(max-width: 1023px)' });
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const initialFilters = {
      colors: searchParams.get("colors") ? searchParams.get("colors").split(",") : [],
      sizes: searchParams.get("sizes") ? searchParams.get("sizes").split(",") : [],
      brandingDatas: searchParams.get("brandingDatas") ? searchParams.get("brandingDatas").split(",") : [],
      neckTypes: searchParams.get("neckTypes") ? searchParams.get("neckTypes").split(",") : [],
      sleeveTypes: searchParams.get("sleeveTypes") ? searchParams.get("sleeveTypes").split(",") : [],
      fabrics: searchParams.get("fabrics") ? searchParams.get("fabrics").split(",") : [],
      occasions: searchParams.get("occasions") ? searchParams.get("occasions").split(",") : [],
      fits: searchParams.get("fits") ? searchParams.get("fits").split(",") : [],
      subCategorys: searchParams.get("subCategorys") ? searchParams.get("subCategorys").split(",") : [],
      genders: searchParams.get("genders") ? searchParams.get("genders").split(",") : [],
      customerRatings: searchParams.get("customerRatings") ? searchParams.get("customerRatings").split(",") : [],
      priceRanges: searchParams.get("priceRanges") ? searchParams.get("priceRanges").split(",") : [],
      shoeSize: searchParams.get("shoeSize") ? searchParams.get("shoeSize").split(",") : [],
      shoeOccasion: searchParams.get("shoeOccasion") ? searchParams.get("shoeOccasion").split(",") : [],
      accessorySubCategorie: searchParams.get("accessorySubCategorie") ? searchParams.get("accessorySubCategorie").split(",") : [],
      footwearSubCategorie: searchParams.get("footwearSubCategorie") ? searchParams.get("footwearSubCategorie").split(",") : [],
    };

    const initialSortBy = searchParams.get("sortBy") || "";
    const initialPage = parseInt(searchParams.get("page")) || 1;

    setFilters(initialFilters);
    setSortBy(initialSortBy);
    setCurrentPage(initialPage);
  }, [query]);

  const updateURLParams = (newFilters) => {
    const searchParams = new URLSearchParams();

    // Add filters to URL parameters
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key].length > 0) {
        searchParams.append(key, newFilters[key].join(","));
      }
    });

    // Add sorting and page number to URL parameters
    if (sortBy) searchParams.append("sortBy", sortBy);
    searchParams.append("page", currentPage);

    // Update URL with new parameters
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  useEffect(() => {
    updateURLParams(filters);
  }, [filters, sortBy,query]);









  const fetchProducts = async (page=1) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${server}/product/get-all-searched-products`, {
        params: {
          query,
          page,
          color: filters.colors.join(","),
          neckType: filters.neckTypes.join(","),
          sleeveType: filters.sleeveTypes.join(","),
          size: filters.sizes.join(","),
          fit: filters.fits.join(","),
          gender: filters.genders.join(","),
          occasion: filters.occasions.join(","),
          subCategory: filters.subCategorys.join(","),
          fabric: filters.fabrics.join(","),
          brandingData: filters.brandingDatas.join(","),
          customerRating: filters.customerRatings.join(","),
          priceRange: filters.priceRanges.join(","),
          shoeSizes:  filters.shoeSize.join(","),
          shoeOccasions:  filters.shoeOccasion.join(","),
          accessorySubCategories:  filters.accessorySubCategorie.join(","),
          footwearSubCategories:  filters.footwearSubCategorie.join(","),
          sortBy,
        },
      });

      const data = response.data;
      console.log("Dataaaaaaaaaaa",data)
      if (data.success) {
        setFilteredData((prevData) => ({
          ...prevData,
          [page]: data.products,
        }));
        setFilteredDatas(data.products);
        setTotalPage(data.l3)
        setTotalPages(data.totalPages);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
// console.log("filteredDatafilteredDatafilteredData",filteredData)
// console.log("filteredDatasxvvfdddddddddd",filteredDatas)

  useEffect(() => {
    const clothesKeywords = [
      "tshirts", "tshirt", "blouses", "shirts", "tank tops", "sweaters", "hoodies", "jeans", "trousers", "shorts",
      "skirts", "leggings", "jackets", "coats", "blazers", "vests", "raincoats", "casual dresses", "formal dresses",
      "maxi dresses", "cocktail dresses", "sundresses", "sports bras", "gym tops", "yoga pants", "track pants",
      "running shorts", "pajamas", "robes", "sweatpants", "lounge tops", "half pants", "bras", "panties", "boxers",
      "briefs", "undershirts", "suits", "tuxedos", "full sleeve", "half sleeve", "short sleeve", "sleeveless",
      "modal", "linen blend", "wool blend", "poly cotton", "nylon", "viscose rayon", "cotton blend", "elastane",
      "organic cotton", "polyester", "pure cotton", "2xs", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl", "5xl", "6xl",
      "7xl", "8xl", "beach wear", "casual", "formal", "lounge wear", "party", "sports", "boxy", "compression", "loose",
      "oversized", "regular", "slim", "clothes", "shirt", "dresses", "cloths", "cloth", "kapra", "dress"
    ];

    const shoesKeywords = [
      "shoe", "sneaker", "boot", "heel", "sandal", "flip-flop", "loafer", "slipper", "casual", "formal", "sports",
      "party", "outdoor", "work", "beach", "hiking", "wedding", "everyday", "flip flops", "slide sandals",
      "house slippers", "thong slippers", "gladiator sandals", "sport sandals", "wedge sandals", "heeled sandals",
      "flat sandals", "sneakers", "running shoes", "loafers", "oxfords", "brogues", "boots", "heels", "flats",
      "moccasins", "derbies", "espadrilles", "shoes", "crocs", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7",
      "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15", "15.5",
      "16", "joota", "juta", "jhoota", "jutta", "sliper", "slipers"
    ];

    const stopWords = [
      "for", "in", "the", "and", "a", "of", "to", "is", "on", "at", "by", "with", "from", "as", "about", "into",
      "through", "during", "before", "after", "over", "between", "under", "above", "below", "up", "down", "out", "off",
      "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any",
      "both", "each", "few", "more", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
      "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"
    ];

    const queryWords = query.toLowerCase().split(" ").filter(word => !stopWords.includes(word));

    const isClothesQuery = queryWords.some(word => clothesKeywords.includes(word));
    const isShoesQuery = queryWords.some(word => shoesKeywords.includes(word));
console.log("hfejshmehgmfe,")
    if (isClothesQuery) {
      setIsClothes(true);
      console.log("setIsClothes",isClothes)
    }
    if (isShoesQuery) {
      setIsFootWear(true);
      console.log("setIsFootWear",isFootWear)

    }
    if (isClothesQuery !== isShoesQuery) {
      setIsValid(true);
    }
  
    
    // fetchProducts();
    // const pagesToFetch = Array.from({ length: currentPage }, (_, i) => i + 1);
    // pagesToFetch.forEach((page) => {
    //   if (!filteredData[page]) {
    //     fetchProducts(page);
    //   }
    // });
    // Fetch data for all pages up to the current page
    // const pagesToFetch = Array.from({ length: currentPage }, (_, i) => i + 1);
    // pagesToFetch.forEach((page) => {
    //   if (!filteredData[page]) {
    //     fetchProducts(page);
    //   }
    // });
  }, [query,filters]);

  console.log("bchktfhmc")
  // console.log("queryquery",filters)
  useEffect(() => {
    if (isLargeScreen) {
      fetchProducts(currentPage);
    }
  }, [isLargeScreen, currentPage,query, filters, sortBy]); // Fetch only once on mount

  useEffect(() => {
    if (isSmallOrMediumScreen) {
      const pagesToFetch = Array.from({ length: currentPage }, (_, i) => i + 1);
      pagesToFetch.forEach((page) => {
        if (!filteredData[page]) {
          fetchProducts(page);
        }
      });
    }
  }, [isSmallOrMediumScreen, currentPage, filteredData,query, filters, sortBy]); 
  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  //   navigate(`?page=${page}`); // Update the URL with the new page number
  // };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [query, currentPage, filters, sortBy]);

  useEffect(() => {
    if (isSmallOrMediumScreen) {
      fetchProducts(currentPage);
    }
  }, [filters, currentPage, isSmallOrMediumScreen]);

  const handleCheckboxChange = (filterType, value) => {
    setCurrentPage(1)
    setFilters(prevFilters => {
      const updatedFilters = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter(item => item !== value)
        : [...prevFilters[filterType], value];
      return { ...prevFilters, [filterType]: updatedFilters };
    });
  };
  // const handleSortChange = (e) => {
  //   setSortBy(e.target.value);
  // };
  const handleSortChange = (event) => {
    // console.log("Selected Sort Option:", event.target.value);
    setSortBy(event.target.value);
  };
  
  useEffect(() => {
    // console.log("Current SortBy:", sortBy);
    if (sortBy) {
      fetchProducts(currentPage);
    }
  }, [sortBy]);
  

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // setCurrentPage(1);
    // fetchProducts(1);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDropdown = (dropdownType) => {
    setDropdowns(prevDropdowns => ({
      ...prevDropdowns,
      [dropdownType]: !prevDropdowns[dropdownType]
    }));
  };

  const toggleSortDrawer = (dropdownType) => {
    setSortDrawerOpen(!sortDrawerOpen);
  };

  const handleSortOption = (sortByOption) => {
    setSortBy(sortByOption);
    // setSortDrawerOpen(false); // Close the sort drawer after selecting an option
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(`${location.pathname}?page=${newPage}`);
  };
  useEffect(() => {
    const page = parseInt(queryParams.get('page')) || 1;
    setCurrentPage(page);
  }, [location.search]);
  const toggleShowAll = (type) => {
    
    switch (type) {
      case "sizes":
        setShowAllSizes(!showAllSizes);
        break;
        case "shoeSize":
        setShowAllShoesSizes(!showAllShoesSizes);
        break;
      case "subCategorys":
        setShowAllSubCategories(!showAllSubCategories);
        break;
        case "footwearSubCategorie":
        setShowAllShoesSubCategories(!showAllShoeSubCategories);
        break;

      case "colors":
        setShowAllColors(!showAllColors);
        break;
      case "neckTypes":
        setShowAllNeckTypes(!showAllNeckTypes);
        break;
      default:
        break;
    }
  };

  const clearFilters = () => {
    setFilters({
      colors: [],
      sizes: [],
      brandingDatas: [],
      neckTypes: [],
      sleeveTypes: [],
      fabrics: [],
      occasions: [],
      fits: [],
      subCategorys: [],
      genders: [],
      customerRatings: [],
      priceRanges: [],
      shoeSize: [],
      shoeOccasion: [],
      accessorySubCategorie: [],
      footwearSubCategorie: [],
    });
    setCurrentPage(1);
    setIsFootWear(false);
    setIsClothes(false);
    setShowAllSizes(false);
    setShowAllShoesSizes(false);
    setShowAllSubCategories(false);
    setShowAllShoesSubCategories(false);
    setShowAllColors(false);
    setShowAllNeckTypes(false);
    setDropdowns({
      colors: false,
      sizes: false,
      subCategorys: false,
      neckTypes: false,
      fabrics: false,
      occasions: false,
      fits: false,
      sleeveTypes: false,
      brandingDatas: false,
      genders: false,
      customerRatings: false,
      priceRanges: false,
      shoeSize: false,
      shoeOccasion: false,
      accessorySubCategorie: false,
      footwearSubCategorie: false,
    });
  };


  


  const visibleSizes = showAllSizes ? size : size.slice(0, 6);
  const visibleShoesSizes = showAllShoesSizes ? shoeSizes : shoeSizes.slice(0, 6);
  const visibleSubCategories = showAllSubCategories ? subCategory : subCategory.slice(0, 6);
  const visibleShoeSubCategories = showAllShoeSubCategories ? footwearSubCategories : footwearSubCategories.slice(0, 6);

  const visibleColors = showAllColors ? color : color.slice(0, 6);
  const visibleNeckTypes = showAllNeckTypes ? neckType : neckType.slice(0, 6);


  const { ref: loadMoreRef, inView } = useInView({
    threshold: 1.0,
  });
  console.log("currentPagecurrentPage",currentPage)
  console.log("currentPagecurrentPage",initialPage)
  
  useEffect(() => {
    setCurrentPage(initialPage);
      
    // dispatch(getAllProducts(currentPage));
  }, [initialPage]);

  useEffect(() => {
    if (inView && !isLoading&& currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [inView, currentPage, totalPages,isLoading,filters]);

  
  const getAllProducts = () => {
    const allProducts = [];
    Object.values(filteredData).forEach((pageData) => {
      allProducts.push(...pageData);
    });
    return allProducts;
  };
// console.log("getAllProducts()getAllProducts()",getAllProducts())
  return (
    <>
      {isLoading && currentPage === 1 ? (
        <Loader />
      ): (
        <div className="w-full">
          <Header activeHeading={2} />
          <div className={`${styles.section}`}>
          {/* {totalPage === 0 && (
              <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-r from-blue-100 to-blue-300 p-6 sm:p-12">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
                <div className="mx-auto mb-6 w-32 h-32 flex items-center justify-center text-blue-600">
                  <FaBoxOpen size={64} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">No Products Found</h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-6">
                  Sorry, we couldn't find any products that match your search.
                </p>
                <div className="flex justify-center space-x-4 text-blue-600">
                  <FaSadTear size={32} />
                  <FaSearch size={32} />
                </div>
              </div>
            </div>

            )} */}
            {/* <div style={{height:'20px',border:'2px solid black',backgroundColor:'red'}}></div> */}
            {/* for MObile view */}
            {totalPage !== 0 &&<h1 className="text-xl font-semibold mb-4">Search Results for: {query}</h1>}

         {/* <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-2 flex justify-around items-center border-t border-gray-200">
         <button className="flex flex-row items-center space-x-2 p-2 hover:bg-gray-100 rounded "    onClick={toggleDrawer}>
        <BiSortAlt2 className="w-5 h-5 text-gray-500 opacity-75" />
        <span className="font-medium text-sm">SORT</span>
      </button>
      <div className="w-px h-6 bg-gray-400 opacity-50 mx-2"></div>
      <button className="flex flex-row items-center space-x-2 p-2 hover:bg-gray-100 rounded"  onClick={toggleSortDrawer}>
        <FaFilter className="w-4 h-4 text-gray-500 opacity-75" />
        <span className="font-medium text-sm">FILTER</span>
      </button>
      </div> */}

      <div className="flex flex-col lg:flex-row">
          {/* Add your filters and sorting here */}
        </div>
            {isValid===true&&filteredDatas.length !== 0&&<div className="lg:hidden sticky z-20">
              {/* <div className="w-1/2 p-0 m-0">
                <button
                  className="w-full bg-blue-100 flex items-center justify-center font-bold text-lg tracking-wider border-t-1 border-b-2 text-gray-700 p-3 rounded-lg mb-2 border-gray-500 transition duration-300 ease-in-out md:hidden"
                  onClick={toggleDrawer}
                >
                   <AiFillFilter className="mr-2 text-xl text-gray-800" />
                  Filter
                </button>
              </div> */}
              {/* <div className="w-1/2 p-0 m-0">
                <button
                  className="w-full bg-blue-100 flex items-center justify-center font-bold text-lg tracking-wider border-t-1 border-b-2 text-gray-700 p-3 rounded-lg mb-2 border-gray-500 transition duration-300 ease-in-out md:hidden"
                  onClick={toggleSortDrawer}
                >
                   <AiOutlineSwap className="text-xl text-gray-800 mr-2" />
                  Sort
                </button>
              </div> */}
      
         <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-2 flex justify-around items-center border-t border-gray-300 bg-zinc-100">
         <button className="flex flex-row items-center space-x-2 p-2 hover:bg-gray-100 rounded" onClick={toggleDrawer}>
        <FaFilter className="w-4 h-4 text-gray-600 opacity-75" />
        <span className="font-bold text-base">FILTER</span>
      </button>
      <div className="w-px h-10 bg-gray-500 opacity-75"></div>
      <button className="flex flex-row items-center space-x-2 p-2 hover:bg-gray-100 rounded" onClick={toggleSortDrawer}>
        <BiSortAlt2 className="w-6 h-6 text-gray-600 opacity-75" />
        <span className="font-bold text-base">SORT</span>
      </button>
      </div>

       </div>}

            {/* for larger screen */}

    
            {isValid===true&&filteredDatas.length !== 0&&<div className=" bg-gray-100  rounded-full flex mb-1 mt-1 sticky top-28 justify-between items-center"
              style={{ zIndex: 1 }}
            >
              <h4 className="text-4xl font-semibold text-gray-700 hidden lg:block">New Arrivals</h4>
              <button
                className="w-1/6 font-bold text-lg bg-white text-gray-800 px-4 py-2 tracking-wider rounded-full border border-gray-300 shadow-sm mr-11 ml-auto hidden lg:flex items-center justify-center space-x-2 hover:bg-blue-100 transition duration-300 ease-in-out"
                onClick={toggleDrawer}
              >
                  <AiFillFilter className="text-xl text-gray-800" />
                  <span className="text-center">Filter</span>
              </button>


              <button
                className="w-1/6 font-bold text-lg bg-white text-gray-800 px-4 py-2 tracking-wider rounded-full border border-gray-300 shadow-sm hidden lg:flex items-center justify-center space-x-2 hover:bg-blue-100 transition duration-300 ease-in-out"
                onClick={toggleSortDrawer}
              >
                   <AiOutlineSwap className="text-xl text-gray-800" />
                   <span className="text-center">Sort</span>
              </button>
            </div>}



            <div
              className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              onClick={toggleDrawer}
            ></div>
            <div
              className={`fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 overflow-y-auto transition-transform transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Filter Options</h2>
                <AiOutlineClose className="cursor-pointer" onClick={toggleDrawer} />
              </div>
              <form onSubmit={handleFilterSubmit}>
              <div className="mb-4">
                    <button
                      type="button"
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                {/* Color Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("colors")}
                  >
                    Color
                    {dropdowns.colors ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.colors &&
                    visibleColors.map((c) => (
                      <label key={c.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={c.name}
                          checked={filters.colors.includes(c.name)}
                          onChange={() => handleCheckboxChange("colors", c.name)}
                        />
                        {c.name}
                      </label>
                    ))}
                  {dropdowns.colors && color.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("colors")}
                    >
                      {showAllColors ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
                {/* Size Filter */}
                {isFootWear===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("shoeSize")}
                  >
                    Size
                    {dropdowns.shoeSize ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.shoeSize &&
                    visibleShoesSizes.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.type}
                          checked={filters.shoeSize.includes(s.type)}
                          onChange={() => handleCheckboxChange("shoeSize", s.type)}
                        />
                        {s.type}
                      </label>
                    ))}
                  {dropdowns.shoeSize && shoeSizes.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("shoeSize")}
                    >
                      {showAllShoesSizes ? "See Less" : "See More"}
                    </button>
                  )}
                </div>}
                {isClothes===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("sizes")}
                  >
                    Size
                    {dropdowns.sizes ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.sizes &&
                    visibleSizes.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.type}
                          checked={filters.sizes.includes(s.type)}
                          onChange={() => handleCheckboxChange("sizes", s.type)}
                        />
                        {s.type}
                      </label>
                    ))}
                  {dropdowns.sizes && size.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("sizes")}
                    >
                      {showAllSizes ? "See Less" : "See More"}
                    </button>
                  )}
                </div>}
                {/* SubCategory Filter */}
                {isClothes===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("subCategorys")}
                  >
                    Category
                    {dropdowns.subCategorys ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.subCategorys &&
                    visibleSubCategories.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.title}
                          checked={filters.subCategorys.includes(s.title)}
                          onChange={() => handleCheckboxChange("subCategorys", s.title)}
                        />
                        {s.title}
                      </label>
                    ))}
                  {dropdowns.subCategorys && subCategory.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("subCategorys")}
                    >
                      {showAllSubCategories ? "See Less" : "See More"}
                    </button>
                  )}
                </div>}
                {isFootWear===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("footwearSubCategorie")}
                  >
                    Category
                    {dropdowns.footwearSubCategorie ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.footwearSubCategorie &&
                    visibleShoeSubCategories.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.title}
                          checked={filters.footwearSubCategorie.includes(s.title)}
                          onChange={() => handleCheckboxChange("footwearSubCategorie", s.title)}
                        />
                        {s.title}
                      </label>
                    ))}
                  {dropdowns.footwearSubCategorie && footwearSubCategories.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("footwearSubCategorie")}
                    >
                      {showAllShoeSubCategories ? "See Less" : "See More"}
                    </button>
                  )}
                </div>}
                {/* Neck Type Filter */}
                {isClothes===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("neckTypes")}
                  >
                    Neck Type
                    {dropdowns.neckTypes ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.neckTypes &&
                    visibleNeckTypes.map((n) => (
                      <label key={n.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={n.title}
                          checked={filters.neckTypes.includes(n.title)}
                          onChange={() => handleCheckboxChange("neckTypes", n.title)}
                        />
                        {n.title}
                      </label>
                    ))}
                  {dropdowns.neckTypes && neckType.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("neckTypes")}
                    >
                      {showAllNeckTypes ? "See Less" : "See More"}
                    </button>
                  )}
                </div>}
                {/* Fabric Filter */}
                {isClothes===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("fabrics")}
                  >
                    Fabric
                    {dropdowns.fabrics ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.fabrics &&
                    fabric.map((f) => (
                      <label key={f.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={f.type}
                          checked={filters.fabrics.includes(f.type)}
                          onChange={() => handleCheckboxChange("fabrics", f.type)}
                        />
                        {f.type}
                      </label>
                    ))}
                </div>}
                {/* Occasion Filter */}
                {isClothes===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("occasions")}
                  >
                    Occasion
                    {dropdowns.occasions ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.occasions &&
                    occasion.map((o) => (
                      <label key={o.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={o.type}
                          checked={filters.occasions.includes(o.type)}
                          onChange={() => handleCheckboxChange("occasions", o.type)}
                        />
                        {o.type}
                      </label>
                    ))}
                </div>}
                {isFootWear===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("shoeOccasion")}
                  >
                    Occasion
                    {dropdowns.shoeOccasion ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.shoeOccasion &&
                    shoeOccasions.map((o) => (
                      <label key={o.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={o.type}
                          checked={filters.shoeOccasion.includes(o.type)}
                          onChange={() => handleCheckboxChange("shoeOccasion", o.type)}
                        />
                        {o.type}
                      </label>
                    ))}
                </div>}
                {/* Fit Filter */}
                {isClothes===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("fits")}
                  >
                    Fit
                    {dropdowns.fits ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.fits &&
                    fit.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.type}
                          checked={filters.fits.includes(s.type)}
                          onChange={() => handleCheckboxChange("fits", s.type)}
                        />
                        {s.type}
                      </label>
                    ))}
                </div>}
                {/* Sleeve Type Filter */}
                {isClothes===true&&<div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("sleeveTypes")}
                  >
                    Sleeve Type
                    {dropdowns.sleeveTypes ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.sleeveTypes &&
                    sleeveType.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.title}
                          checked={filters.sleeveTypes.includes(s.title)}
                          onChange={() => handleCheckboxChange("sleeveTypes", s.title)}
                        />
                        {s.title}
                      </label>
                    ))}
                </div>}
                {/* Gender Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("genders")}
                  >
                    Gender
                    {dropdowns.genders ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.genders &&
                    gender.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.type}
                          checked={filters.genders.includes(s.type)}
                          onChange={() => handleCheckboxChange("genders", s.type)}
                        />
                        {s.type}
                      </label>
                    ))}
                </div>
                {/* Customer Rating Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("customerRatings")}
                  >
                    Customer Rating
                    {dropdowns.customerRatings ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.customerRatings &&
                    [
                      { label: "3 and below", value: "3-and-below" },
                      { label: "3 to 4", value: "3-to-4" },
                      { label: "4 and above", value: "4-and-above" },
                    ].map((rating) => (
                      <label key={rating.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={rating.value}
                          checked={filters.customerRatings.includes(rating.value)}
                          onChange={() => handleCheckboxChange("customerRatings", rating.value)}
                        />
                        {rating.label}
                      </label>

                    ))}

                </div>
                {/* Price Range Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("priceRanges")}
                  >
                    Price Range
                    {dropdowns.priceRanges ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.priceRanges &&
                    ["0-50", "51-100", "101-200", "1501-1700", "700-1500"].map((range) => (
                      <label key={range} className="block ml-2">
                        <input
                          type="checkbox"
                          value={range}
                          checked={filters.priceRanges.includes(range)}
                          onChange={() => handleCheckboxChange("priceRanges", range)}
                        />
                        {`RS.${range.split('-')[0]} - Rs.${range.split('-')[1]}`}
                      </label>
                    ))}
                </div>
                   
              </form>
            </div>
            {getAllProducts().length === 0 ? (
              // <div className="text-center text-gray-500 mt-4">No products found</div>
              <div className="flex justify-center bg-zinc-100 items-center lg:hidden">
           <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-r from-blue-100 to-blue-300 p-6 sm:p-12">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
                <div className="mx-auto mb-6 w-32 h-32 flex items-center justify-center text-blue-600">
                  <FaBoxOpen size={64} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">No Products Found</h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-6">
                  Sorry, we couldn't find any products that match your search.
                </p>
                <div className="flex justify-center space-x-4 text-blue-600">
                  <FaSadTear size={32} />
                  <FaSearch size={32} />
                </div>
              </div>
            </div>            
            </div>
            ) : (
              <>
              {totalPage===0&&
                <h1 className="text-center text-xl font-semibold text-gray-700 mt-4 mb-1">
                Here are some suggested Products
              </h1>
              }
            <div className="grid grid-cols-2 lg:grid-cols-2 lg:hidden gap-1 w-full mx-0">
              {getAllProducts().map((product) => (
                <ProductCard data={product} key={product._id} />
              ))}
            </div>
            </>
            )}
            {filteredDatas.length === 0 ? (
              // <div className="text-center text-gray-500 mt-4">No products found</div>
              <div className="bg-zinc-100 hidden lg:flex justify-center items-center">
<div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-r from-blue-100 to-blue-300 p-6 sm:p-12">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
                <div className="mx-auto mb-6 w-32 h-32 flex items-center justify-center text-blue-600">
                  <FaBoxOpen size={64} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">No Products Found</h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-6">
                  Sorry, we couldn't find any products that match your search.
                </p>
                <div className="flex justify-center space-x-4 text-blue-600">
                  <FaSadTear size={32} />
                  <FaSearch size={32} />
                </div>
              </div>
            </div>
            </div>
            ): (
              <>
            <div className="hidden lg:grid lg:grid-cols-5 gap-8 w-full px-14">
              {filteredDatas.map((product) => (
                <ProductCard data={product} key={product._id} />
              ))}
            </div>
            </>
            )}

            {/* Loader for Medium and Small Screens */}
            <div ref={loadMoreRef} className="mt-4 flex justify-center lg:hidden">
              {isLoading===true && <ClipLoader
                  color="#2874F0"
                  size={55}
                  // loading={isLoading}
                  thick={50}
                  speedMultiplier={1}
                />}
            </div>

          {/* Pagination for Large Screens */}
            <div className="flex flex-col flex-1 p-4">
        
        {filteredDatas.length !== 0 &&<div className="mt-4 justify-center hidden lg:flex">
          <BasicPagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </div>}
      </div>
    </div>
          {/* Sort Drawer */}
          {sortDrawerOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end">
              <div className="bg-white w-full lg:w-full p-4 overflow-y-auto rounded-t-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Sort Options</h2>
                  <AiOutlineClose className="cursor-pointer" onClick={toggleSortDrawer} />
                </div>
                {/* Sorting options */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByPriceLowToHigh"
                      name="sortBy"
                      className="mr-2"
                      value="Price: Low to High"
                      onClick={() => handleSortOption("price-asc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByPriceLowToHigh">Price (Low to High)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByPriceHighToLow"
                      name="sortBy"
                      className="mr-2"
                      value="Price: High to Low"
                      onClick={() => handleSortOption("price-desc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByPriceHighToLow">Price (High to Low)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByRatingLowToHigh"
                      name="sortBy"
                      className="mr-2"
                      value="Rating: Low to High"
                      onClick={() => handleSortOption("rating-asc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByRatingLowToHigh">Rating (Low to High)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByRatingHighToLow"
                      name="sortBy"
                      className="mr-2"
                      value="Rating: High to Low"
                      onClick={() => handleSortOption("rating-desc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByRatingHighToLow">Rating (high to Low)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByDateOldToNew"
                      name="sortBy"
                      className="mr-2"
                      value="Date: Old to New"
                      onClick={() => handleSortOption("date-asc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByDateOldToNew">Date (Old to New)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByDateNewToOld"
                      name="sortBy"
                      className="mr-2"
                      value="Date: New to Old"
                      onClick={() => handleSortOption("date-desc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByDateNewToOld">Date (New to Old)</label>
                  </div>
                </div>
              </div>
            </div>
          )}
         {/* <Footer /> */}
        </div>
      )}
    </>
  );
};

export default SearchResults;