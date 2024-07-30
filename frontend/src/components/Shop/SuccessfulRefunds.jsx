import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { server } from "../../server";

const SuccessfulRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const { data } = await axios.get(`${server}/withdraw/get-successful-refunds`, {
          withCredentials: true,
        });
        if (data.success) {
          setRefunds(data.refunds);
        }
      } catch (error) {
        console.error("Error fetching refunds:", error);
      }
    };

    if (seller && seller._id) {
      fetchRefunds();
    }
  }, [seller._id]);

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins mb-4">Successful Refunds</h3>
      <div className="bg-white shadow rounded p-4">
        {refunds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {refunds.map((refund) => (
              <div key={refund._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <div className="mb-2">
                  <p className="font-semibold text-lg text-gray-800">
                    Amount: <span className="font-normal">Rs{refund.amount}</span>
                  </p>
                </div>
                <div className="mb-2">
                  <p className="font-semibold text-lg text-gray-800">
                    UPI ID: <span className="font-normal">{refund.upiId}</span>
                  </p>
                </div>
                <div className="mb-2">
                  <p className="font-semibold text-lg text-gray-800">
                    Number: <span className="font-normal">{refund.number}</span>
                  </p>
                </div>
                <div className="mb-2">
                  <p className="font-semibold text-lg text-gray-800">
                    Date: <span className="font-normal">{new Date(refund.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No successful refunds found.</p>
        )}
      </div>
    </div>
  );
};

export default SuccessfulRefunds;
