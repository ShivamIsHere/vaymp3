import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { AiOutlineArrowRight } from "react-icons/ai";
import { getAllOrdersOfUser } from "../redux/actions/order";
import OrderCard from "../components/Profile/OrderCard";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import axios from "axios";
import { server } from "../server";
import { Oval } from 'react-loader-spinner';

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders, isLoading } = useSelector((state) => state.order);

  const dispatch = useDispatch();
  const [kuchvi, setkuchvi] = useState([]);
  const [rows, setRows] = useState([]);
  console.log("order 97", orders);


  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);




  useEffect(() => {
    axios
      .get(`${server}/kuchvi/get-all-admin-kuchvi-request`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("jklllllllllll", res.data)

        setkuchvi(res.data.allKuchviRequest);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);


  useEffect(() => {

    const updateRows = () => {
      const newRows = [];

      kuchvi.forEach((val, ind) => {
        if (val.userId === user._id) {
          newRows.push({
            id: ind, // Ensure the unique ID for DataGrid is unique
            orderid: val.orderId,
            productid: val.productId,
            size: val.size,
            image: val.img, // Replace with actual image URL if available
            itemsQty: 1,
            total: "Rs " + val.markedPrice,
            status: val.status,
            address: val.shippingAddress,
            userId: val.userId,
            shopId: val.shopId,
            delivered: val.delivered,
            cancel: val.cancel,
            refundStatus: val.refundStatus,
            user: val.user,
            paymentInfo: val.paymentInfo,
            productName: val.productName,
            product: val.product,
            markedPrice: val.markedPrice,
            discountPrice: val.discountPrice,
            shopPrice: val.shopPrice,
            kuchviId: val.kuchviId,
            return1: val.return1
          });
        }
      });
      setRows(newRows);
    };

    updateRows();
  }, [kuchvi, user._id]);
  // const row = [];


  return (
    <>
      <Header />
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      ) : rows.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-xl">No orders found</p>
        </div>
      ) : (
        <div className="">
          {rows.map((row) => (
            <OrderCard key={row.id} order={row} />
          ))}
        </div>
      )}
        <Footer />
    </>
  );
};

export default AllOrders;