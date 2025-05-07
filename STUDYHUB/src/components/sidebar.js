import React from "react";
import { Link } from "react-router-dom";
import { FaHandsHelping } from "react-icons/fa";
import { FaPeopleRobbery } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { TbHeartRateMonitor } from "react-icons/tb";
import { MdFormatListNumbered } from "react-icons/md";
import { BiArchiveIn } from "react-icons/bi";
import "../App.css";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="navigations">
        <ul>
        <li>
        <Link to="#">

              <span className="icon"><TbHeartRateMonitor /></span>
              <span className="title">TGMMS</span>
          </Link>

          </li>
          <li>
            <Link to="/tupad">
              <span className="icon"><FaHandsHelping /></span>
              <span className="title">Tupad</span>
            </Link>
          </li>
          <li>
            <Link to="/implemented">
              <span className="icon"><BiArchiveIn /></span>
              <span className="title">Implemented</span>
            </Link>
          </li>
          <li>
            <Link to="/members">
              <span className="icon"><BsFillPeopleFill /></span>
              <span className="title">Mapping</span>
            </Link>
          </li>
          <li>
            <Link to="/gip">
              <span className="icon"><FaPeopleRobbery /></span>
              <span className="title">GIP</span>
            </Link>
          </li>
          <li>
            <Link to="/adl">
              <span className="icon"><MdFormatListNumbered  /></span>
              <span className="title">ADL No.</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
