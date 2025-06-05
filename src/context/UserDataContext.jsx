import React, { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { SERVER_URL } from "src/settings";
import axios from "axios";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { user } = useSelector((state) => state.account);

  const [profilePicture, setProfilePicture] = useState(
    "/icons/header/account.svg"
  );
  const [cartCount, setCartCount] = useState(0);
  const [coursesToken, setCoursesToken] = useState(null);

  // SET THE PROFILE PICTURE OF USER
  const getProfilePicture = () => {
    if (user) {
      const pictureUrl = user.profilePicture.includes("http")
        ? user.profilePicture
        : `${SERVER_URL}${user.profilePicture}`;
      const isPlaceholder = pictureUrl === `${SERVER_URL}/no-photo.jpg`;
      setProfilePicture(
        isPlaceholder ? "/icons/header/account.svg" : pictureUrl
      );
    }
  };

  // FETCH ORDER ITEMS COUNT IN CART
  const fetchCartCount = async () => {
    if (user) {
      try {
        const email = user.email;
        const response = await axios.get(
          `https://medtigo.store/wp-json/user_cart_info/v2/cart/?email=${email}&request_mood=root`
        );
        const data = response.data;

        if (data.user_data_have) {
          setCartCount(data.number_of_item_in_cart);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        setCartCount(0);
      }
    }
  };

  // STORE 24 HR TOKEN  USED FOR NAVIGATION TO ROOT SITES
  const getCoursesToken = async () => {
    try {
      const newToken = await authService.generateToken();
      setCoursesToken(newToken);
    } catch (error) {
      console.error("Error generating token:", error);
      return null;
    }
  };

  useEffect(() => {
    getProfilePicture();
    fetchCartCount();
    getCoursesToken();
  }, []);

  return (
    <UserDataContext.Provider
      value={{ profilePicture, cartCount, coursesToken }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserDataContext = () => {
  return useContext(UserDataContext);
};
