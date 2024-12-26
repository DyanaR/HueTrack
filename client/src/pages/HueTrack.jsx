import { Fragment, useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Month from "../components/Month.jsx";
import styled from "styled-components";
import CalendarHeader from "../components/CalendarHeader.jsx";
import Year from "../components/Year.jsx";
import GlobalContext from "../context/GlobalContext.js";
import { getMonth, getYear } from "../utils/calendar.js";
import AddLabels2 from "../components/AddLabels2.jsx";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext.js";
import AddLabels from "../components/AddLabels.jsx";
import axios from "axios";

function HueTrack() {
  const { user } = UserAuth();

  const {
    monthIndex,
    view,
    currentMonth,
    currentYear,
    setCurrentYear,
    setCurrentMonth,
    yearIndex,
    userObject,
    setUserObject,
    // active,
    // setActive,
  } = useContext(GlobalContext);

  const [expandDropdown, setExpandDrowdown] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      console.log("Fetching user with UID:", user.uid);
      fetchUser(user.uid);
    }
  }, [user]);

  const fetchUser = (uid) => {
    axios
      .get(`http://localhost/huetrack/getUserData.php?uid=${uid}`)
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.data.status === 1 && response.data.data) {
          setUserObject(response.data.data); // Update the user object directly
        } else if (response.data.message) {
          console.error(
            "User not found or invalid response:",
            response.data.message
          );
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user name:", error);
      });
  };

  const handleMouseEnter = () => {
    setExpandDrowdown(true);
  };

  const handleMouseLeave = () => {
    setExpandDrowdown(false);
  };

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  useEffect(() => {
    setCurrentYear(getYear(yearIndex));
  }, [yearIndex]);

  // const showMenu = () => {
  //   setActive(!active);
  // };
  const { logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("You are logged out.");
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Container>
      <Fragment>
        <div className="huetrack">
          {/* <Navbar /> */}
          <div className="nav">
            <div className="left">
              <Link to="/" style={{ textDecoration: "none" }}>
                <h4>HueTrack</h4>
              </Link>
            </div>
            <div className="right">
              <div
                style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
                onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
              >
                <h6 style={{ fontSize: "1.2rem" }}>
                  Welcome, {userObject.fname || "User"}
                </h6>
                <IoIosArrowDown style={{ cursor: "pointer" }} />
              </div>
              <div
                // onClick={() => {
                //   setExpandDrowdown(!expandDropdown);
                // }}
                onClick={handleLogout}
                className={
                  "expand-dropdown-menu " +
                  (expandDropdown ? "active" : "inactive")
                }
                style={{ cursor: "pointer" }}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
              >
                <h6 className="logout" style={{ fontSize: "1rem" }}>
                  Logout
                </h6>
              </div>
            </div>
          </div>

          <div className="hue-container">
            <aside className="sidebar">
              <Sidebar />
            </aside>
            <div className="cal-view">
              <CalendarHeader />
              <div className="cal">
                {view ? (
                  <Month month={currentMonth} />
                ) : (
                  <Year monthCount={currentYear} />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <AddLabels2 /> */}
        <AddLabels />
        {/* only shows on 800px */}
      </Fragment>
    </Container>
  );
}

export default HueTrack;

const Container = styled.div`
  ul {
    list-style-type: none;
  }
  h4 {
    color: var(--color-black);
    text-decoration: none;
  }
  .logout:hover {
    color: red;
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2.5rem 1.5rem 2.5rem;
    background-color: var(--color-white);
  }
  .expand-dropdown-menu.active {
    visibility: visible;
  }
  .expand-dropdown-menu.inactive {
    visibility: hidden;
  }
  .expand-dropdown-menu {
    position: absolute;
    margin-top: 4.5rem;
    width: 10rem;
    gap: 1rem;
    padding: 0.5rem;
    background-color: var(--color-white);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .right {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  aside {
    position: fixed;
    left: 0;
    top: 6rem;
  }

  .cal-view {
    margin-left: 22rem;
    height: 100%;
  }
  @media screen and (max-width: 1000px) {
    .cal-view {
      margin-left: 20rem;
    }
  }
  @media screen and (max-width: 800px) {
    .sidebar {
      display: none;
    }
    .cal-view {
      padding: 0;
      margin-left: 0;
    }
  }
`;
