import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const ShopCard = ({ shopName, image, shopId }) => {
  return (
    // <div className="max-w-sm mx-auto overflow-hidden shadow-lg rounded-lg">
    //   <img className="w-full h-56 object-contain object-center" src={image} alt={shopName} />      
    //     <div className="px-6 py-4">
    //       <Link to={`/shop/preview/${shopId}`}>
    //         <h5 className={`${styles.shop_name}`}>{shopName}</h5>
    //       </Link>
    <Link to={`/shop/preview/${shopId}`}>
      <div className="max-w-sm mx-auto overflow-hidden shadow-lg rounded-lg">
        <img className="w-full h-56 object-contain object-center" src={image} alt={shopName} />      
      <div className="px-6 py-4">
          <Link to={`/shop/preview/${shopId}`}>
          <h5 className="text-xl text-center font-bold text-blue-800 shadow-md">{shopName}</h5>
          </Link>
        </div>
        </div>
    </Link>
  );
};

export default ShopCard;