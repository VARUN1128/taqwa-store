import React, { useContext, useEffect, useState } from "react";
import supabase from "../../supabase";
import { CardList, TopBar } from "../Landing/Landing";
import { SessionContext } from "../../components/SessionContext";
import SearchBar from "../../components/SearchBar";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { VscGitFetch } from "react-icons/vsc";
import SadCat from "../../images/sad_thumbsup.png";
import { CategoryCard } from "../Landing/Landing";
import Marquee from "react-marquee-slider";

import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  marginRight: "0.3em",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#ff0054" : "#ff0054",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#ff0054",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function SearchResults() {
  const { session } = useContext(SessionContext);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      const savedCategories = localStorage.getItem("categories");
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
        return;
      }

      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.log(error);
      } else {
        setCategories(data);
        localStorage.setItem("categories", JSON.stringify(data));
      }
    };

    // Fetch categories only when products array is empty
    if (products.length === 0) {
      fetchCategories();
    }
  }, [products]); // Add products as a dependency

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    setQuery(query);
    setCategory(category);

    const fetchProducts = async () => {
      setIsFetching(true);
      setLoading(true);
      setProducts([]);
      try {
        let productsQuery = supabase
          .from("products")
          .select("*")
          .order("price", { ascending: sortOrder === "asc" }) // Sort by price
          .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);

        if (query) {
          productsQuery = productsQuery.or(
            `name.ilike.%${query}%,category.ilike.%${query}%`
          );
        }

        if (category) {
          productsQuery = productsQuery.eq("category", category);
        }

        const { data, error } = await productsQuery;

        if (error) {
          throw error;
        }

        setProducts((prevProducts) => {
          const newProducts = data.filter(
            (newProduct) =>
              !prevProducts.some(
                (prevProduct) => prevProduct.id === newProduct.id
              )
          );
          return [...prevProducts, ...newProducts];
        });
        setLoading(false);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
      setIsFetching(false);
    };

    fetchProducts();
  }, [location, query, category, page, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopBar avatarInfo={session?.user.user_metadata} />
      <SearchBar value={query && `${query}`} />
      <div className="flex justify-between items-end flex-col mt-3">
        <FormControlLabel
          control={
            <IOSSwitch
              checked={sortOrder === "asc"}
              onChange={toggleSortOrder}
            />
          }
          label="Sort by price"
        />
      </div>

      {!isFetching && hasFetched && products.length === 0 ? (
        <>
          <div className="mt-20 relative">
            <h1 className="text-2xl ml-3 text-center">
              😅 Sorry that one isn't here yet
            </h1>
            <p className="text-gray-500 text-center mt-3">
              We're always adding new products to our catalog. Please check back
              later or check out our other categories.
            </p>
            <div className="hide-scrollbar m-auto justify-around w-100 gap-1 flex flex-nowrap mt-5 overflow-x-scroll whitespace-nowrap ">
              <Marquee velocity={15}>
                {[...categories, ...categories].map((category, index) => (
                  <CategoryCard
                    category={category.category}
                    thumbnail={category.thumbnail}
                    index={index}
                    key={category.id}
                  />
                ))}
              </Marquee>
            </div>
          </div>
          <img
            src={SadCat}
            alt="Sad Cat"
            className="absolute right-0 bottom-[3em] w-[12em]"
          />
          <div className="flex justify-center mt-5">
            <span
              className="text-white cursor-pointer hover:bg-blue-500 transition-colors duration-300 ease-in-out py-2 px-4 rounded-full"
              onClick={() => navigate("/home")}
              style={{
                backgroundColor: "#3669C9",
              }}
            >
              Go Back Home
            </span>
          </div>
        </>
      ) : (
        <>
          <CardList
            session={session}
            products={products}
            title={
              query
                ? `Search results for "${query}"`
                : category
                ? `Search results for "${category}"`
                : "All Products"
            }
          />

          <div className="flex justify-center mt-5">
            <button
              className="m-auto mt-10 w-fit py-3 px-20 rounded-xl bg-gray-300 cursor-pointer"
              onClick={() => setPage(page + 1)}
            >
              {loading ? (
                <CircularProgress style={{ color: "#000" }} size={20} />
              ) : (
                <>
                  <VscGitFetch
                    size={20}
                    color="black"
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginRight: "1em",
                    }}
                  />
                  Load More
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
