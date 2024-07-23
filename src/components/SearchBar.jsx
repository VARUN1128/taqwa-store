import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ value }) {
  const [searchValue, setSearchValue] = useState(value || "");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?query=${searchValue}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center mt-10"
      style={{ fontFamily: "Product Sans", fontSize: "1em" }}
    >
      <div className="relative m-auto w-[90%]">
        <input
          type="text"
          placeholder="Search Product Name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          className="w-full h-[3.5em] px-4 bg-gray-50 text-black placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600"
        />
        <button
          type="submit"
          style={{
            position: "absolute",
            right: "1em",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          <CiSearch size={30} color="black" />
        </button>
      </div>
    </form>
  );
}
