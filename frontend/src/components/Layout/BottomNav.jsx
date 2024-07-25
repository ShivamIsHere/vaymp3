
import { BiHomeAlt } from 'react-icons/bi';
import { IoLayers } from 'react-icons/io5';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { MdPersonOutline } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Cart from '../cart/Cart'; 
import Wishlist from '../Wishlist/Wishlist'; 

const BottomNav = () => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const [totalCount, setTotalCount] = useState(0);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const wishlistRef = useRef(null);
    const cartRef = useRef(null);


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

      const handleWishlistClick = () => {
        setIsWishlistOpen(true);
        setIsCartOpen(false); 
    };

    const handleCartClick = () => {
        setIsCartOpen(true);
        setIsWishlistOpen(false);
    };

    const handleCloseClick = (event, ref, setState) => {
        if (ref.current && ref.current === event.target) {
            setState(false);
        }
    };

    const handleCloseWishlist = () => {
        setIsWishlistOpen(false);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    return (
        <div className="w-full h-80vh">
            <section id="bottom-navigation" className="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-blue-100 shadow-top">
                <div id="tabs" className="flex justify-between">
                    <Link to="/" className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1">
                        <BiHomeAlt size={30} className="inline-block mb-1" />
                        <span className="tab tab-home block text-xs">Home</span>
                    </Link>
                    <button onClick={handleWishlistClick} className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1 relative">
                        <FiHeart size={30} className="inline-block mb-1" />
                        {wishlist && wishlist.length > 0 && (
                            <span className="absolute top-2 right-5 rounded-full bg-[#6f30e4] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                {wishlist.length}
                            </span>
                        )}
                        <span className="tab tab-whishlist block text-xs">Wishlist</span>
                    </button>
                    <Link to="/categories" className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1">
                        <IoLayers size={30} className="inline-block mb-1" />
                        <span className="tab tab-kategori block text-xs">Category</span>
                    </Link>
                    <button onClick={handleCartClick} className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1 relative">
                        <div>
                            <AiOutlineShoppingCart size={30} className="inline-block mb-1" />
                            {totalCount > 0 && (
                                <span className="absolute top-2 right-5 rounded-full bg-[#6f30e4] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                    {totalCount}
                                </span>
                            )}
                        </div>
                        <span className="tab tab-explore block text-xs">Cart</span>
                    </button>
                    <Link to="/profile" className="w-full focus:text-blue-500 hover:text-blue-500 flex flex-col items-center pt-2 pb-1">
                        <MdPersonOutline size={30} className="inline-block mb-1" />
                        <span className="tab tab-account block text-xs">Account</span>
                    </Link>
                </div>
            </section>

         
            {isWishlistOpen && (
                <div
                    ref={wishlistRef}
                    className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-20"
                    onClick={(event) => handleCloseClick(event, wishlistRef, handleCloseWishlist)}
                >
                    <div className="fixed top-0 right-0 h-full w-[85%] overflow-y-scroll 450px:w-[400px] 800px:w-[400px] bg-white flex flex-col justify-between shadow-sm">
                        <div className="flex w-full justify-end pt-5 pr-5">
                            <RxCross1
                                size={25}
                                className="cursor-pointer"
                                onClick={handleCloseWishlist}
                            />
                        </div>
                        <Wishlist setOpenWishlist={setIsWishlistOpen}  />

                    </div>
                </div>
            )}

          
            {isCartOpen && (
                <div
                    ref={cartRef}
                    className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-20"
                    onClick={(event) => handleCloseClick(event, cartRef, handleCloseCart)}
                >
                    <div className="fixed top-0 right-0 h-full w-[85%] overflow-y-scroll 450px:w-[400px] 800px:w-[400px] bg-white flex flex-col justify-between shadow-sm">
                        <div className="flex w-full justify-end pt-5 pr-5">
                            <RxCross1
                                size={25}
                                className="cursor-pointer"
                                onClick={handleCloseCart}
                            />
                        </div>
                        <Cart setOpenCart={setIsCartOpen} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BottomNav;