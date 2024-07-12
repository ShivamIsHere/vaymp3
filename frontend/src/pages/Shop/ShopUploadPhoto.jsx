import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const ShopUploadPhoto = () => {
  const { id } = useParams(); // Get shop ID from the URL
  const [avatar, setAvatar] = useState(null);

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = async () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);

        try {
          const res = await axios.put(
            `${server}/product/upload-shop-avatar`,
            { avatar: reader.result, shopId: id },
            {withCredentials:true},
          );

          toast.success("Avatar updated successfully!");
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };


  return (
    <div>
        <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImage}
                    className="sr-only"
                  />
                </label>
    </div>
  )
}

export default ShopUploadPhoto