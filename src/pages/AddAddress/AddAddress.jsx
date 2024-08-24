import React, { useContext, useEffect, useState } from "react";
import TopPageDetail from "../../components/TopPageDetail";
import { useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import supabase from "../../supabase";
import { SessionContext } from "../../components/SessionContext";
import CircularProgress from "@mui/material/CircularProgress";
export default function AddAddress() {
  const { session } = useContext(SessionContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const getAccessToken = async () => {
    const response = await axios.get(
      "https://www.universal-tutorial.com/api/getaccesstoken",
      {
        headers: {
          Accept: "application/json",
          "api-token": process.env.REACT_APP_UNIVERSE_KEY,
          "user-email": "taqwafashionstoreonline@gmail.com",
        },
      }
    );

    return response.data.auth_token;
  };

  const getCountries = async (authToken, retryCount = 0) => {
    try {
      const response = await axios.get(
        "https://www.universal-tutorial.com/api/countries/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );

      const countries = response.data.map((country) => ({
        value: country.country_name,
        label: country.country_name,
      }));

      setCountries(countries);
    } catch (error) {
      console.error("Error fetching countries: ", error);
      if (retryCount < 3) {
        // Wait for 2 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return getCountries(authToken, retryCount + 1);
      } else {
        // If all retries fail, set default country to India
        setCountries([{ value: "India", label: "India" }]);
        setSelectedCountry({ value: "India", label: "India" });
        setValue("country", "India");
      }
    }
  };

  const getStates = async (countryName, retryCount = 0) => {
    try {
      const authToken = await getAccessToken();
      const response = await axios.get(
        `https://www.universal-tutorial.com/api/states/${countryName}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );

      const states = response.data.map((state) => ({
        value: state.state_name,
        label: state.state_name,
      }));

      setStates(states);
    } catch (error) {
      console.error("Error fetching states: ", error);
      if (retryCount < 3) {
        // Wait for 2 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return getStates(countryName, retryCount + 1);
      } else {
        // If all retries fail, set default state to Kerala
        setStates([{ value: "Kerala", label: "Kerala" }]);
        setSelectedState({ value: "Kerala", label: "Kerala" });
        setValue("state", "Kerala");
      }
    }
  };
  useEffect(() => {
    getAccessToken().then(getCountries);
  }, []);

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setValue("country", selectedOption.value);
    getStates(selectedOption.value);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    const address = {
      ...data,
      name: data.name.toUpperCase(),
      phone: data.phone,
      address: data.address.toUpperCase(),
      zip: data.zip,
      city: data.city.toUpperCase(),
      country: "INDIA",
      state: selectedState ? selectedState.value.toUpperCase() : "KERALA",
    };
    const { error } = await supabase
      .from("users")
      .update({ address: JSON.stringify(address) })
      .eq("id", session.user.id);

    if (error) {
      console.error("Error: ", error);
    } else {
      navigate("/confirmorder");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const fetchAddress = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("address")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error: ", error);
      } else if (data && data.address) {
        const address = JSON.parse(data.address);
        setValue("name", address.name);
        setValue("phone", address.phone);
        setValue("address", address.address);
        setValue("zip", address.zip);
        setValue("city", address.city);
        setValue("country", { value: "India", label: "India" });
        setValue(
          "state",
          address.state
            ? { value: address.state, label: address.state }
            : { value: "Kerala", label: "Kerala" }
        );
      }
    };

    fetchAddress();
  }, []);
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopPageDetail title="Add Address" />
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <input
          type="text"
          placeholder="Name"
          name="name"
          autoComplete="name"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters long",
            },
          })}
          className="mb-4 p-2 w-full bg-gray-50 text-black placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600"
        />

        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}

        <input
          type="tel"
          placeholder="Phone Number"
          name="phone"
          autoComplete="tel"
          {...register("phone", {
            required: "Phone number is required",
          })}
          className="mb-4 p-2 w-full bg-gray-50 text-black placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600"
        />
        {errors.phone && (
          <span className="text-red-500">{errors.phone.message}</span>
        )}

        <input
          type="text"
          placeholder="Address"
          name="address"
          autoComplete="street-address"
          {...register("address", { required: "Address is required" })}
          className="mb-4 p-2 w-full bg-gray-50 text-black placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600"
        />
        {errors.address && (
          <span className="text-red-500">{errors.address.message}</span>
        )}

        <input
          type="number"
          name="zip"
          placeholder="Zip Code"
          autoComplete="postal-code"
          {...register("zip", {
            required: "Zip code is required",
            pattern: {
              value: /^\d{6}$/,
              message: "Please enter a valid 6-digit zip code",
            },
          })}
          className="mb-4 p-2 w-full bg-gray-50 text-black placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600"
        />
        {errors.zip && (
          <span className="text-red-500">{errors.zip.message}</span>
        )}

        <input
          type="text"
          name="city"
          placeholder="City"
          autoComplete="address-level2"
          {...register("city", { required: "City is required" })}
          className="mb-4 p-2 w-full bg-gray-50 text-black placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600"
        />
        {errors.city && (
          <span className="text-red-500">{errors.city.message}</span>
        )}

        <Select
          options={countries}
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="Country"
          className="mb-4"
          defaultInputValue="India"
        />
        {errors.country && (
          <span className="text-red-500">{errors.country.message}</span>
        )}

        <Select
          options={states}
          value={selectedState}
          onChange={(selectedOption) => {
            setSelectedState(selectedOption);
            setValue("state", selectedOption.value);
          }}
          placeholder="State"
          className="mb-4"
          defaultInputValue="Kerala"
        />
        {errors.state && (
          <span className="text-red-500">{errors.state.message}</span>
        )}

        <div
          style={{
            backgroundColor: "#ff9f00",
            color: "white",
            transition: "transform 0.1s",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="w-[80%] text-center m-auto px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          {isLoading ? (
            <CircularProgress
              size={20}
              style={{ color: "white", marginRight: 3 }}
            />
          ) : (
            <FaSave
              size={20}
              className="mr-2 inline-block align-middle"
              color="white"
            />
          )}
          <span>Save Delivery Address</span>
        </div>
      </form>
    </div>
  );
}
