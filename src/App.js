import Login from "./pages/Login/Login";
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

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
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
      <SessionContext.Provider value={{ session, setSession }}>
        <Router>
          {session && (
            <BottomNavigator avatarInfo={session?.user.user_metadata} />
          )}
          <Routes>
            <Route path="/" element={session ? <Landing /> : <Login />} />
          </Routes>
        </Router>
      </SessionContext.Provider>
    </Provider>
  );
}

export default App;
