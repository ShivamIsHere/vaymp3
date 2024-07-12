import React, { useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaArrowDownLong } from "react-icons/fa6";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  // const remainingItems =
  //   data?.stock.quantity < 105 && data?.stock.quantity > 0
  //     ? data?.stock.quantity + " items left"
  //     : "";
  // const remainingItems =
  const [isHovered, setIsHovered] = useState(false);
 
  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = () => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = () => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = () => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock.quantity < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div >
      <div className="w-full h-[310px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-end"></div>
        <a
          href={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          {isHovered ? (
          <Carousel
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop
            autoPlay
            interval={2000}
            stopOnHover={false}
            showThumbs={false}
          >
            {data.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-[170px] object-contain"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <img
            src={`${data.images && data.images[0]?.url}`}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        )}
        </a>
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name} mt-0 -mb-4 `}>{data.shop.name}</h5>
        </Link>
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <div>
            {/* Visible on small screens */}
            <div className="md:hidden">
              <h4 className="flex pb-3 text-base font-normal whitespace-nowrap text-ellipsis max-w-full">
                {data.name.length > 13 ? data.name.slice(0, 13) + "..." : data.name}
              </h4>
            </div>
            {/* Visible on medium screens */}
            <div className="hidden md:block lg:hidden">
              <h4 className="flex pb-3 text-base font-normal whitespace-nowrap text-ellipsis max-w-full">
                {data.name.length > 35 ? data.name.slice(0, 35) + "..." : data.name}
              </h4>
            </div>
            {/* Visible on large screens */}
            <div className="hidden lg:block">
              <h4 className="flex pb-3 text-base font-normal whitespace-nowrap text-ellipsis max-w-full">
                {data.name.length > 25 ? data.name.slice(0, 25) + "..." : data.name}
              </h4>
            </div>
          </div>

          <div className="flex">
            <Ratings rating={data?.ratings} />
          </div>

          <div className="py-1 flex items-center justify-between">
            <div className="flex items-center">
            <span className="flex items-center text-sm text-blue-500 font-bold -ml-2 mr-1">
                <FaArrowDownLong bg-green-500 />
                <span className="ml-0 mr-1">
                  {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}%
                </span>
              </span>
              <h5 className={`${styles.productDiscountPrice} text-base`}>
              ₹{data.originalPrice === 0
                  ? data.originalPrice
                  : data.discountPrice}
              </h5>
              <div className="flex items-center ml-2">
              
                <h4 className="text-sm text-gray-500 line-through">
                  ₹{data.originalPrice ? data.originalPrice : null}
                </h4>
                
              </div>
              
            </div>
            
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={removeFromWishlistHandler}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={addToWishlistHandler}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          {/* <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={addToCartHandler}
            color="#444"
            title="Add to cart"
          /> */}
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;