import Login, { BeforeLogin } from "./pages/Login/Login";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { SessionContext } from "./components/SessionContext";
import { useEffect, useState } from "react";
import Clock from "./components/clock";
import supabase from "./supabase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import BottomNavigator from "./components/BottomNavigator";
import Profile from "./pages/Profile/Profile";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import SearchResults from "./pages/SearchResults/SearchResults";
import { WishlistContext } from "./components/WishlListContext";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/Cart/Cart";
import AddAddress from "./pages/AddAddress/AddAddress";
import OrderConfirm from "./pages/OrderStuff/OrderConfirm";
import Orders from "./pages/Orders/Orders";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (session && session.user) {
        const { data, error } = await supabase
          .from("wishlist")
          .select("product_id")
          .eq("user_id", session.user.id);
        if (error) {
          console.log(error);
        } else {
          setWishlist(data.map((item) => item.product_id));
          console.log("Wishlist:", data);
        }
      }
    };

    fetchWishlist();
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkSignInStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate a delay
      setLoading(false);
    };

    checkSignInStatus();
  }, []);

  if (loading) {
    return <Clock />;
  }

  return (
    <Provider store={store}>
      <WishlistContext.Provider value={{ wishlist, setWishlist }}>
        <SessionContext.Provider value={{ session, setSession }}>
          <Router>
            {session && (
              <BottomNavigator avatarInfo={session?.user.user_metadata} />
            )}
            <Routes>
              <Route path="/" element={session ? <Landing /> : <Login />} />
              <Route
                path="/profile"
                element={session ? <Profile /> : <Login />}
              />
              <Route
                path="/product/:productId"
                element={session ? <ProductDetail /> : <Login />}
              />
              <Route
                path="/search"
                element={session ? <SearchResults /> : <Login />}
              />
              <Route
                path="/wishlist"
                element={session ? <Wishlist /> : <Login />}
              />
              <Route path="/cart" element={session ? <Cart /> : <Login />} />
              <Route
                path="/address"
                element={session ? <AddAddress /> : <Login />}
              />
              <Route
                path="/confirmorder"
                element={session ? <OrderConfirm /> : <Login />}
              />
              <Route
                path="/orders"
                element={session ? <Orders /> : <Login />}
              />
            </Routes>
          </Router>
        </SessionContext.Provider>
      </WishlistContext.Provider>
    </Provider>
  );
}

export default App;
