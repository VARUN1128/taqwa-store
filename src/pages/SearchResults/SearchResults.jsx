import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import supabase from "../../supabase";
import { CardList, TopBar, CategoryCard } from "../Landing/Landing";
import { SessionContext } from "../../components/SessionContext";
import SearchBar from "../../components/SearchBar";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { VscGitFetch } from "react-icons/vsc";
import subBrands from "../../components/staticSubCats";
import { BiMenuAltRight } from "react-icons/bi";

function retrieveNumberFromString(str) {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

const itemsPerPage = 10;

const fetchProducts = async (
  query,
  category,
  page,
  sortOption,
  selectedBrand,
  offer,
  offerValue
) => {
  try {
    let productsQuery = supabase
      .from("products")
      .select("*")
      .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);

    if (query) {
      productsQuery = productsQuery.or(
        `name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%`
      );
    }

    if (category) {
      productsQuery = productsQuery.eq("category", category);
    }

    if (selectedBrand) {
      if (offerValue) {
        productsQuery = productsQuery
          .lte("price", offerValue)
          .order("price", { ascending: false })
          .order("created_at", { ascending: false }); // Secondary sort by creation date
      } else {
        productsQuery = productsQuery
          .eq("brand_categ", selectedBrand)
          .order("created_at", { ascending: false });
      }
    } else if (offer === "under" && offerValue) {
      if (isNaN(offerValue)) {
        throw new Error("Invalid value for offer");
      } else {
        productsQuery = productsQuery
          .lte("price", offerValue)
          .order("price", { ascending: false })
          .order("created_at", { ascending: false }); // Secondary sort by creation date
      }
    } else {
      productsQuery = productsQuery.order("created_at", { ascending: false });
    }

    // Apply additional sorting based on sortOption if provided
    // Only apply if no brand+offer or under offer filtering is active
    if (
      sortOption &&
      !((selectedBrand && offerValue) || (offer === "under" && offerValue))
    ) {
      productsQuery = productsQuery.order(
        sortOption.split("_")[0] === "rating"
          ? "avg_rating"
          : sortOption.split("_")[0],
        { ascending: sortOption.endsWith("asc") }
      );
    }

    const { data, error } = await productsQuery;
    if (error) {
      throw error;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
};

export default function SearchResults() {
  const { session } = useContext(SessionContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [offerValue, setOfferValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [sortOption, setSortOption] = useState("price_desc");

  const options = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating_asc", label: "Rating: Low to High" },
    { value: "rating_desc", label: "Rating: High to Low" },
  ];

  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === sortOption).label
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryFromUrl = searchParams.get("query");
    const queryCategory = searchParams.get("category");
    const queryOffer = searchParams.get("offer");
    const queryOfferValue = searchParams.get("value");
    const querySubBrand = searchParams.get("brand");

    setQuery(queryFromUrl || "");
    setCategory(queryCategory || "");
    setSelectedBrand(querySubBrand || "");
    setOfferValue(queryOfferValue || "");
  }, [location.search]);

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

    if (products.length === 0) {
      fetchCategories();
    }
  }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      setLoading(true);
      setProducts([]);

      try {
        const data = await fetchProducts(
          query,
          category,
          page,
          sortOption,
          selectedBrand,
          "under",
          offerValue
        );
        console.log(
          "Fetching data: ",
          query,
          category,
          page,
          sortOption,
          selectedBrand,
          offerValue
        );
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

    if (query || category || selectedBrand || offerValue) {
      fetchData();
    }
  }, [query, category, page, sortOption, selectedBrand, offerValue]);

  const updateUrlWithoutNavigating = useCallback(
    (newBrand) => {
      const searchParams = new URLSearchParams(location.search);
      if (newBrand) {
        searchParams.set("brand", newBrand);
        searchParams.set("value", retrieveNumberFromString(newBrand));
        searchParams.set("offer", "under");
      } else {
        searchParams.delete("brand");
        searchParams.delete("value");
        searchParams.delete("offer");
      }
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    },
    [location.search]
  );

  const handleBrandChange = (brand) => {
    updateUrlWithoutNavigating(brand);
    setOfferValue(retrieveNumberFromString(brand));
    setSelectedBrand(brand);
    setPage(0);
  };

  const saveScrollPosition = () => {
    const pageElement = document.querySelector(".page");
    if (pageElement) {
      console.log("Saving scroll position: ", pageElement.scrollTop);
      sessionStorage.setItem("listScroll", pageElement.scrollTop);
    }
  };

  // Restore scroll position when returning
  useEffect(() => {
    if (hasFetched && !isFetching && products.length > 0) {
      const savedScroll = sessionStorage.getItem("listScroll");
      const pageElement = document.querySelector(".page");
      if (savedScroll && pageElement) {
        console.log("Restoring scroll position: ", savedScroll);
        pageElement.scrollTop = parseInt(savedScroll);
      }
    }
  }, [hasFetched, isFetching, products.length]);
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[10em] overflow-x-hidden">
      <TopBar showCopy avatarInfo={session?.user.user_metadata} />
      <SearchBar value={query && `${query}`} />
      {
        <div className="relative mt-3">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <div className="relative inline-block outline-0 ml-3">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 outline-0 whitespace-nowrap"
              >
                FILTER
                <BiMenuAltRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            {subBrands[category] && subBrands[category].length > 0 && (
              <div className="flex items-center gap-3 justify-evenly mr-2">
                {subBrands[category].map((brand) => (
                  <span
                    key={brand}
                    className={`cursor-pointer px-3 py-1 rounded-3xl border  whitespace-nowrap ${
                      selectedBrand === brand
                        ? "border-blue-500 text-blue-800 "
                        : "border-gray-300"
                    }`}
                    onClick={() => handleBrandChange(brand)}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            )}
          </div>
          {isOpen && (
            <div className="z-10 origin-top-left absolute left-3 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setSelectedOption(option.label);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      }
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
              {[...categories].map((category, index) => (
                <CategoryCard
                  category={category.category}
                  thumbnail={category.thumbnail}
                  index={index}
                  key={category.id}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <span
              className="text-white cursor-pointer hover:bg-blue-500 transition-colors duration-300 ease-in-out py-2 px-4 rounded-full"
              onClick={() => navigate("/home")}
              style={{
                backgroundColor: "black",
                fontFamily: "Product Sans",
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
            title={query && `Search results for "${query}"`}
            saveScrollPosition={saveScrollPosition}
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
