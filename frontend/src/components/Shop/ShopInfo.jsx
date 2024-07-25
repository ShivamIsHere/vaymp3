import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { BsShop } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products || { products: [] });
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [dispatch, id]);

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      window.location.reload();
      navigate("/shop-login");
    } catch (error) {
      console.log(error);
    }
  };


  const filteredProducts =
    products?.filter((product) => product.listing !== "Event") || [];
  const totalReviewsLength =
    filteredProducts &&
    filteredProducts.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    filteredProducts &&
    filteredProducts.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="md:hidden">
            <div className="w-full py-2">
              <div className="w-full flex item-center justify-center">
                <div className="w-[150px] h-[150px] flex items-center justify-center rounded-full bg-slate-200">
                  <BsShop className="w-[85px] h-[85px] text-black-500 object-contain" />
                </div>
              </div>
              <h3 className="text-center pt-1 text-[20px]">{data.name}</h3>
              {/* <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {data.description}
            </p> */}
            </div>
            <div className="p-3 justify-between">
              <div className="flex flex-col items-center">
                <h5 className="font-[600]">Address</h5>
                <h4 className="text-[#000000a6]">{data.address}</h4>
              </div>
            </div>
            {/* <div className="p-3">
            <h5 className="font-[600]">Phone Number</h5>
            <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
          </div> */}
            <div className="p-3 flex justify-between">
              <div className="flex flex-col items-center">
                <h5 className="font-semibold">Total Products</h5>
                <h4 className="text-[#000] font-Roboto">
                  {filteredProducts && filteredProducts.length}
                </h4>
              </div>
              <div className="flex flex-col items-center">
                <h5 className="font-semibold">Shop Ratings</h5>
                <div className="inline-flex bg-blue-500 items-center justify-center px-3 py-1 rounded-md">
                  <span className="text-white">{averageRating.toFixed(1)}</span>
                  <AiFillStar className="text-white mr-1" />
                </div>
              </div>
            </div>
            {/* <div className="p-3">
            <h5 className="font-[600]">Joined On</h5>
            <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
          </div> */}
            {isOwner && (
              <div className="py-3 px-4">
                <Link to="/settings">
                  <div
                    className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                  >
                    <span className="text-white">Edit Shop</span>
                  </div>
                </Link>
                <Link to="/shop-login">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                  onClick={logoutHandler}
                >
                  <span className="text-white">Log Out</span>
                </div>
                </Link>
                <Link to="/dashboard">
                <div
                    className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                  >
                   <span className="text-[#fff]">Go Dashboard</span>
                 </div>
               </Link>
              </div>
            )}
          </div>
          <div className="hidden md:block">
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <div className="w-[150px] h-[150px] flex items-center justify-center rounded-full bg-slate-200">
                <BsShop
                  className="w-[85px] h-[85px] text-black-500 object-contain"
                />
              </div>
            </div>
            <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {data.description}
            </p>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Address</h5>
            <h4 className="text-[#000000a6]">{data.address}</h4>
          </div>
          {/* <div className="p-3">
            <h5 className="font-[600]">Phone Number</h5>
            <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
          </div> */}
          <div className="p-3">
            <h5 className="font-[600]">Total Products</h5>
            <h4 className="text-[#000000a6]">{filteredProducts && filteredProducts.length}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Shop Ratings</h5>
            <div className="inline-flex bg-blue-500 items-center justify-center px-2 py-1 rounded-md">
                  <span className="text-white">{averageRating.toFixed(1)}</span>
                  <AiFillStar className="text-white mr-1" />
                </div>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Joined On</h5>
            <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
          </div>
          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/settings">
                <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
                  <span className="text-white">Edit Shop</span>
                </div>
              </Link>
              <Link to="/shop-login">
              <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`} onClick={logoutHandler}>
                <span className="text-white">Log Out</span>
              </div>
              </Link>
              <Link to="/dashboard">
                <div
                    className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                  >
                   <span className="text-[#fff]">Go Dashboard</span>
                 </div>
               </Link>
            </div>
          )}
          </div>
        </>
      )}
    </>
  );
};

export default ShopInfo;