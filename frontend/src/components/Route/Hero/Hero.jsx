import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../../styles/styles";
const Hero = () => {
  const backgroundImageUrls = [
    "./banner.jpeg",
    "./carouselcover222.jpg",
    "/caroselcover33.jpg",
  ];

  // Function to handle next slide
  const SampleNextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-100 text-black p-2 rounded-full cursor-pointer"
      style={{zIndex: 1}}
      onClick={onClick}
      >
        &#8250;
      </div>
    );
  };

  // Function to handle previous slide
  const SamplePrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-100 text-black p-2 rounded-full cursor-pointer"
      style={{zIndex: 1}}
      onClick={onClick}
      >
        &#8249;
      </div>
    );
  };

  // Handle touch start
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="h-2 w-2 rounded-full bg-gray-500 cursor-pointer transition-all duration-300 ease-in-out">
      <style jsx>{`
        .slick-dots li.slick-active div {
          background-color: #3b82f6;
          transform: scale(1.2);
        }
      `}</style>
    </div>
    ),
  };
    // Function to handle previous slide
// Handle touch end
// const handleTouchEnd = () => {
//   if (touchStartX.current - touchEndX.current > 50) {
//     nextSlide();
//   } else if (touchEndX.current - touchStartX.current > 50) {
//     prevSlide();
//   }
//   touchStartX.current = null;
//   touchEndX.current = null;
// };
    
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prevSlide) => (prevSlide + 1) % backgroundImageUrls.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

  return (
    <Slider {...settings}>
      {backgroundImageUrls.map((url, index) => (
        <div key={index} className="relative min-h-[20vh] 800px:min-h-[80vh] w-full">
          <div
            className={`absolute inset-0 ${styles.normalFlex}`}
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            <div className={`${styles.section} w-[90%] 800px:w-[60%] p-5`}>
              {/* <h1
                className={`text-[2.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] xl:text-[4rem] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
              >
                All your city stores <br /> at your fingertips
              </h1> */}
              {/* <p className="pt-5 text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-[Poppins] font-[400] text-[#000000ba]">
                Now shop from your city from the convenience of your home.Find the latest Phagwara collection and info about sales, experience hassle-free delivery, try the clothes from your home without worrying about returns.
              </p> */}
              <Link to="/products" className="inline-block">
                {/* <div className={`${styles.button} mt-5`}>
                  <span className="text-[#fff] font-[Poppins] text-[18px]">Shop Now</span>
                </div> */}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </Slider>
      
  );
};

export default Hero;