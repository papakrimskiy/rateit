// import Login from "./pages/Login"
// import Home from "./pages/Home"
// import Profile from "./pages/Profile"
// import CreateReview from "./pages/CreateReview"
// import ProductReviews from "./pages/ProductReviews"
// import ReviewDetails from "./pages/ReviewDetails"

// function App() {
//   return <Login />
// }

// export default App

import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateReview from "./pages/CreateReview";
import ProductReviews from "./pages/ProductReviews";
import ReviewDetails from "./pages/ReviewDetails";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/home" element={<Home />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/create" element={<CreateReview />} />

      <Route path="/product" element={<ProductReviews />} />

      <Route path="/review" element={<ReviewDetails />} />

    </Routes>
  );
}

export default App;