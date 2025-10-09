import React from "react";
import { Link } from "react-router-dom";

const HomePageLinks = () => {
  return (
    <Link to={`/letter/A`}>
      <div>Search By letter</div>
    </Link>
  );
};

export default HomePageLinks;
