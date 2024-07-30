import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";
import ClipLoader from "react-spinners/ClipLoader";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [loading, setLoading] = useState(false); // Loading state

  const [upiInfo, setUpiInfo] = useState({
    upiId: "",
    number: "",
    confirmNumber: "",
  });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (upiInfo.number !== upiInfo.confirmNumber) {
      toast.error("Numbers do not match!");
      return;
    }

    const withdrawMethod = {
      upiId: upiInfo.upiId,
      number: upiInfo.number,
    };

    setPaymentMethod(false);

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully!");
        dispatch(loadSeller());
        setUpiInfo({
          upiId: "",
          number: "",
          confirmNumber: "",
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        dispatch(loadSeller());
      });
  };

  const error = () => {
    toast.error("You do not have enough balance to withdraw!");
  };

  const availableBalance = seller?.availableBalance.toFixed(2);

  const withdrawHandler = async () => {
    const amount = parseFloat(withdrawAmount); // Convert withdrawAmount to number
  
    // Check if amount is a valid number
    if (isNaN(amount) || amount < 50 || amount > parseFloat(availableBalance)) {
      toast.error("You can't withdraw this amount!");
    } else {
      const { upiId, number } = seller.withdrawMethod;
  
      setLoading(true); // Start loading
      try {
        const res = await axios.post(
          `${server}/withdraw/create-withdraw-request`,
          { amount, upiId, number },
          { withCredentials: true }
        );
        window.location.reload();
        toast.success("Withdraw money request is successful!");
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while processing your request.");
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  return (
    <div className="w-full h-[90vh] p-8 bg-gray-100">
      <div className="w-full bg-white h-full rounded-lg shadow-lg flex items-center justify-center flex-col p-6">
        <h5 className="text-2xl font-semibold pb-4 text-gray-700">
          Available Balance: ₹{availableBalance}
        </h5>
        <div
          className={`${styles.button} text-white !h-[42px] !rounded transition duration-300 ease-in-out transform hover:scale-105`}
          onClick={() => (availableBalance < 50 ? error() : setOpen(true))}
        >
          Check Detail
        </div>
      </div>
      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div
            className={`w-[95%] 800px:w-[50%] bg-white shadow-lg rounded-lg p-4 transition-all duration-300 ease-in-out transform ${
              paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } min-h-[40vh]`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => setOpen(false) || setPaymentMethod(false)}
                className="cursor-pointer text-gray-700 transition duration-300 ease-in-out transform hover:scale-110"
              />
            </div>
            {paymentMethod ? (
              <div>
                <h3 className="text-[22px] font-semibold text-center text-gray-700">
                  Add new Withdraw Method:
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-gray-600">
                      UPI ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={upiInfo.upiId}
                      onChange={(e) =>
                        setUpiInfo({ ...upiInfo, upiId: e.target.value })
                      }
                      placeholder="Enter your UPI ID"
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div className="pt-2">
                    <label className="block text-gray-600">
                      Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={upiInfo.number}
                      onChange={(e) =>
                        setUpiInfo({ ...upiInfo, number: e.target.value })
                      }
                      placeholder="Enter your number"
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div className="pt-2">
                    <label className="block text-gray-600">
                      Confirm Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={upiInfo.confirmNumber}
                      onChange={(e) =>
                        setUpiInfo({
                          ...upiInfo,
                          confirmNumber: e.target.value,
                        })
                      }
                      placeholder="Confirm your number"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`${styles.button} mb-3 text-white transition duration-300 ease-in-out transform hover:scale-105`}
                  >
                    Add
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="text-[22px] font-semibold text-center text-gray-700">
                  Available Withdraw Methods:
                </h3>

                {seller && seller?.withdrawMethod ? (
                  <div className="mt-4 space-y-4">
                    <div className="800px:flex w-full justify-between items-center">
                      <div className="800px:w-[50%] text-gray-700">
                        <h5>UPI ID: {seller?.withdrawMethod.upiId}</h5>
                        <h5>Number: {seller?.withdrawMethod.number}</h5>
                      </div>
                      <div className="800px:w-[50%] flex justify-end">
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer text-red-500 transition duration-300 ease-in-out transform hover:scale-110"
                          onClick={() => deleteHandler()}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-xl text-gray-700">
                        Available Balance: ₹{availableBalance}
                      </h4>
                      <div className="800px:flex w-full items-center mt-4 space-y-4 800px:space-y-0">
                        <input
                          type="number"
                          placeholder="Amount..."
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="800px:w-[100px] w-full border p-2 rounded"
                        />
                        <div
                          className={`${styles.button} !h-[42px] text-white transition duration-300 ease-in-out transform hover:scale-105 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                          onClick={!loading ? withdrawHandler : null} // Disable onClick when loading
                        >
                          {loading ? <ClipLoader size={24} color="#fff" /> : "Withdraw"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[18px] pt-2 text-gray-700">
                      No Withdraw Methods available!
                    </p>
                    <div className="w-full flex items-center justify-center mt-4">
                      <div
                        className={`${styles.button} text-white text-[18px] transition duration-300 ease-in-out transform hover:scale-105`}
                        onClick={() => setPaymentMethod(true)}
                      >
                        Add new
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
