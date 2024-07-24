import React, { useContext, useEffect, useState } from "react";
import supabase from "../../supabase";
import { CardList, TopBar } from "../Landing/Landing";
import { SessionContext } from "../../components/SessionContext";
import SearchBar from "../../components/SearchBar";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { VscGitFetch } from "react-icons/vsc";
import SadCat from "../../images/sad_thumbsup.png";

export default function SearchResults() {
  const { session } = useContext(SessionContext);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

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
          .order("created_at", { ascending: false })
          .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);

        if (query) {
          productsQuery = productsQuery.ilike("name", `%${query}%`);
        }

        if (category) {
          productsQuery = productsQuery.eq("category", category);
        }

        const { data, error } = await productsQuery;

        if (error) {
          throw error;
        }

        setProducts((prevProducts) => [...prevProducts, ...data]);
        setLoading(false);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
      setIsFetching(false);
    };

    fetchProducts();
  }, [location, query, category, page]);
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopBar avatarInfo={session?.user.user_metadata} />
      <SearchBar value={query && `${query}`} />
      {!isFetching && hasFetched && products.length === 0 ? (
        <>
          <div className="mt-20 relative">
            <h1 className="text-2xl ml-3 text-center">
              😅 Sorry that one isn't here yet
            </h1>
            <p className="text-gray-500 text-center mt-3">
              We're always adding new products to our catalog. Please check back
              later.
            </p>
          </div>
          <img
            src={SadCat}
            alt="Sad Cat"
            className="absolute right-0 bottom-[3em] w-[12em]"
          />
          <span
            className=" text-white cursor-pointer
            hover:bg-blue-500 transition-colors duration-300 ease-in-out mt-5"
            onClick={() => navigate("/")}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#3669C9",
              padding: "1em",
              borderRadius: "2em",
            }}
          >
            Go Back Home
          </span>
        </>
      ) : (
        <>
          <CardList
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
