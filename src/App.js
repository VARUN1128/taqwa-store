import Login, { BeforeLogin } from "./pages/Login/Login";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { SessionContext } from "./components/SessionContext";
import { useEffect, useState } from "react";
import Clock from "./components/clock";
import supabase from "./supabase";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
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
import { Helmet } from "react-helmet-async";
import LoginStart from "./pages/Login/LoginStart";
import RegisterStart from "./pages/Login/Register";
import "react-toastify/dist/ReactToastify.css";
import OrderDetail from "./pages/Orders/OrderDetail";

function RedirectToFAQ() {
  useEffect(() => {
    window.location.href = "/faq.html";
  }, []);

  return null;
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const setVh = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  useEffect(() => {
    if (session && !userName) {
      console.log(session.user);
      const userId = session.user.id;
      console.log(userId);
      // fetch user data from users table
      const fetchUserData = async () => {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId);
        if (error) {
          console.log(error);
          return;
        }
        console.log(data);
        if (data[0].raw_user_meta_data.name) {
          setUserName(data[0].raw_user_meta_data.name);
          console.log("User Name:", data[0].raw_user_meta_data.name);
        } else {
          console.log("Data not found");
        }
      };

      fetchUserData();
    } else {
      console.log("Session not found");
      setUserName("");
    }
  }, [session]);

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
    <>
      <Helmet>
        <title>TAQWA Fashion Store. Fashion Accessoires and Fragnance</title>
        <meta
          name="description"
          content="TAQWA Fashion Store. Buy Fashion Accessoires, Watches, Shoes, Caps, Wallets, Perfumes and Fragnance. Home Delivery Available"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://ik.imagekit.io/taqwafashionstore/SEO/TF_Logo.jpg"
        />
        <meta
          name="twitter:title"
          content="TAQWA Fashion Store. Fashion Accessoires and Fragnance"
        />
        <meta
          name="twitter:description"
          content="TAQWA Fashion Store. Buy Fashion Accessoires, Watches, Shoes, Caps, Wallets, Perfumes and Fragnance. Home Delivery Available"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="taqwafashionstore.com/" />
        <meta
          property="og:title"
          content="TAQWA Fashion Store. Fashion Accessoires and Fragnance"
        />
        <meta
          property="og:description"
          content="TAQWA Fashion Store. Buy Fashion Accessoires, Watches, Shoes, Caps, Wallets, Perfumes and Fragnance. Home Delivery Available"
        />
        <meta
          property="og:image"
          content="https://ik.imagekit.io/taqwafashionstore/SEO/TF_Logo.jpg"
        />
      </Helmet>

      <Provider store={store}>
        <WishlistContext.Provider value={{ wishlist, setWishlist }}>
          <SessionContext.Provider value={{ session, setSession }}>
            <Router>
              <BottomNavigator
                avatarInfo={session?.user.user_metadata}
                otpUser={userName}
              />

              <Routes>
                <Route path="/home" element={<Landing />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route
                  path="/wishlist"
                  element={session ? <Wishlist /> : <Login />}
                />
                <Route path="/cart" element={<Cart />} />
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
                <Route
                  path="/order/:orderId"
                  element={session ? <OrderDetail /> : <Login />}
                />
                <Route
                  path="/login"
                  element={
                    session ? (
                      userName ? (
                        <Landing />
                      ) : (
                        <RegisterStart />
                      )
                    ) : (
                      <Login />
                    )
                  }
                />
                <Route
                  path="/loginStart"
                  element={
                    session ? (
                      userName ? (
                        <Landing />
                      ) : (
                        <RegisterStart />
                      )
                    ) : (
                      <LoginStart />
                    )
                  }
                />
                <Route
                  path="/register"
                  element={
                    session ? (
                      userName ? (
                        <Landing />
                      ) : (
                        <RegisterStart />
                      )
                    ) : (
                      <Login />
                    )
                  }
                />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/privacy" element={<RedirectToFAQ />} />
                <Route path="/terms" element={<RedirectToFAQ />} />
                <Route path="/refund" element={<RedirectToFAQ />} />
                <Route path="/return" element={<RedirectToFAQ />} />
                <Route path="/shipping" element={<RedirectToFAQ />} />
                <Route path="/contactus" element={<RedirectToFAQ />} />"
              </Routes>
            </Router>
          </SessionContext.Provider>
        </WishlistContext.Provider>
      </Provider>
    </>
  );
}

export default App;
