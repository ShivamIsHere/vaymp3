import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { server } from "../../server"; // Adjust the path as needed

const AllRefundOrders = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        const { data } = await axios.get(`${server}/kuchvi/get-return-requests`, {
          withCredentials: true,
        });

        if (data.success) {
          setReturnRequests(data.returnRequests);
        }
      } catch (error) {
        console.error("Error fetching return requests:", error);
      }
    };

    if (seller && seller._id) {
      fetchReturnRequests();
    }
  }, [seller._id]);

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins mb-4">Return Requests</h3>
      <div className="bg-white shadow rounded p-4">
        {returnRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {returnRequests.map((request) => (
              <div key={request._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <img src={request.img} alt={request.productName} className="w-full h-32 object-cover mb-4 rounded"/>
                <div className="mb-2">
                  <p className="font-semibold text-lg text-gray-800">
                    Product: <span className="font-normal">{request.productName}</span>
                  </p>
                  <p className="font-semibold text-lg text-gray-800">
                    Size: <span className="font-normal">{request.size}</span>
                  </p>
                  <p className="font-semibold text-lg text-gray-800">
                    Quantity: <span className="font-normal">{request.qty}</span>
                  </p>
                  <p className="font-semibold text-lg text-gray-800">
                    Status: <span className="font-normal">{request.status}</span>
                  </p>
                </div>
                <div className="mb-2">
                  <p className="font-semibold text-lg text-gray-800">
                    Shop Price: <span className="font-normal">Rs{request.shopPrice}</span>
                  </p>
                </div>
                <div className="mb-2">
                  
                  <p className="font-semibold text-lg text-gray-800">
                    Return Request: <span className="font-normal">{request.return1 ? "Yes" : "No"}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No return requests found.</p>
        )}
      </div>
    </div>
  );
};

export default AllRefundOrders;
