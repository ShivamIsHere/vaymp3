import { BiHomeAlt } from 'react-icons/bi';
import { IoLayers } from 'react-icons/io5';
import { FaShoppingCart } from 'react-icons/fa';
import { IoHeart } from 'react-icons/io5';
import { BsPerson } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const BottomNav = () => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        let count = 0;
        cart.forEach(item => {
            item.stock.forEach(stockItem => {
                if (stockItem.isSelected) {
                    count += 1;
                }
            });
        });
        setTotalCount(count);
    }, [cart]);
    return (
        <div className="w-full h-80vh">
            <section id="bottom-navigation" className="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-blue-100 shadow-top">
                <div id="tabs" className="flex justify-between">
                    <Link to="/" className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1">
                        <BiHomeAlt size={30} className="inline-block mb-1" />
                        <span className="tab tab-home block text-xs">Home</span>
                    </Link>
                    <Link to="/wishlist" className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1 relative">
                        <IoHeart size={30} className="inline-block mb-1" />
                        {wishlist && wishlist.length > 0 && (
                            <span className="absolute top-2 right-5 rounded-full bg-[#6f30e4] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                {wishlist.length}
                            </span>
                        )}
                        <span className="tab tab-whishlist block text-xs">Wishlist</span>
                    </Link>
                    <Link to="/categories" className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1">
                        <IoLayers size={30} className="inline-block mb-1" />
                        <span className="tab tab-kategori block text-xs">Category</span>
                    </Link>
                    <Link to="/cart" className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1 relative">
                        <div>
                        <FaShoppingCart size={30} className="inline-block mb-1" />
                        {totalCount > 0 && (
                            <span className="absolute top-2 right-5 rounded-full bg-[#6f30e4] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                {totalCount}
                            </span>
                        )}
                        </div>
                        <span className="tab tab-explore block text-xs">Cart</span>
                    </Link>
                    <Link to="/profile" className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1">
                        <BsPerson size={30} className="inline-block mb-1" />
                        <span className="tab tab-account block text-xs">Account</span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default BottomNav;
