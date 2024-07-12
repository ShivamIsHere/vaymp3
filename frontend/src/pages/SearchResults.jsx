import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";
 // Assuming data is imported correctly
import ClipLoader from "react-spinners/ClipLoader";

const SearchResults = () => {
  const { query } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${server}/product/get-all-searched-products`, {
        params: {
          query,
          page: currentPage,
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
      if (data.success) {
        setFilteredData((prevData) => [...prevData, ...data.products]); // Append new data to existing data
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

  useEffect(() => {
    const clothesKeywords = [
      "t-shirts", "tshirt", "blouses", "shirts", "tank tops", "sweaters", "hoodies", "jeans", "trousers", "shorts",
      
    ];

    const shoesKeywords = [
      "shoe", "sneaker", "boot", "heel", "sandal", "flip-flop", "loafer", "slipper", "casual", "formal", "sports",
      
    ];

    const stopWords = [
      "for", "in", "the", "and", "a", "of", "to", "is", "on", "at", "by", "with", "from", "as", "about", "into",
      
    ];

    const queryWords = query.toLowerCase().split(" ").filter(word => !stopWords.includes(word));

    const isClothesQuery = queryWords.some(word => clothesKeywords.includes(word));
    const isShoesQuery = queryWords.some(word => shoesKeywords.includes(word));

    if (isClothesQuery) {
      setIsClothes(true);
    }
    if (isShoesQuery) {
      setIsFootWear(true);
    }
    if (isClothesQuery !== isShoesQuery) {
      setIsValid(true);
    }

    fetchProducts();
  }, [query, currentPage, filters, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



 

  


  



  const { ref: loadMoreRef, inView } = useInView({
    threshold: 1.0,
  });

  // useEffect(() => {
  //   if (inView && !isLoading && currentPage < totalPages) {
  //     setCurrentPage((prevPage) => prevPage + 1);
  //   }
  // }, [inView, isLoading, currentPage, totalPages]);
  useEffect(() => {
    if (inView && !isLoading&& currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [inView, currentPage, totalPages,isLoading]);

  return (
    <>
      {isLoading && currentPage === 1 ? (
        <Loader />
      ): (
        <div className="w-full">
          <Header activeHeading={3} />
          <div className={`${styles.section} `}>
          {totalPage===0&&<h>NO Product Found...Here are some suggested Products</h>}
{/* <div style={{height:'20px',border:'2px solid black',backgroundColor:'red'}}></div> */}
            {/* for MObile view */}
            



            
            {filteredData.length === 0 ? (
              // <div className="text-center text-gray-500 mt-4">No products found</div>
              <div className="flex justify-center items-center">
              <img src={`${process.env.PUBLIC_URL}/noproductshd.png`} alt="No Products Found" className="max-w-4/5 max-h-4/5" />
            </div>
            ) : (
              <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:hidden gap-1 w-full mx-0">
              {filteredData.map((product) => (
                <ProductCard data={product} key={product._id} />
              ))}
            </div>
            <div className="hidden lg:grid lg:grid-cols-5 gap-8 w-full px-14">
              {filteredDatas.map((product) => (
                <ProductCard data={product} key={product._id} />
              ))}
            </div>
            </>
            )}

            {/* Loader for Medium and Small Screens */}
            <div ref={loadMoreRef} className="mt-4 flex justify-center md:hidden">
              {isLoading===true && <ClipLoader
                  color="#2874F0"
                  size={55}
                  // loading={isLoading}
                  thick={50}
                  speedMultiplier={1}
                />}
            </div>

          {/* Pagination for Large Screens */}
            <div className="mt-4 justify-center hidden md:flex">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          {/* Sort Drawer */}
          
         {/* <Footer /> */}
        </div>
      )}
    </>
  );
};

export default SearchResults;