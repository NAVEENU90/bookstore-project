import React from "react";
import AdminHeader from "../components/AdminHeader";
import Footer from "../../components/Footer";
import AdminSidebar from "../components/AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBookAtlas,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

const data = [
  { name: "Page A", pv: 2400, uv: 4000 },
  { name: "Page B", pv: 1398, uv: 3000 },
  { name: "Page C", pv: 9800, uv: 2000 },
  { name: "Page D", pv: 3908, uv: 2780 },
  { name: "Page E", pv: 4800, uv: 1890 },
  { name: "Page F", pv: 3800, uv: 2390 },
  { name: "Page G", pv: 4300, uv: 3490 },
];

const AdminHome = () => {
  return (
    <>
      <AdminHeader />
      <div className="grid grid-cols-[1fr_4fr]">
        <div className="bg-blue-100 flex flex-col items-center">
          <AdminSidebar />
        </div>
        <div className="w-full p-6">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {" "}
            {/* Total Books */}{" "}
            <div className="bg-[#233F91] text-white flex items-center gap-5 px-5 py-4 rounded shadow-md min-h-21">
              {" "}
              <FontAwesomeIcon icon={faBook} className="text-4xl" />{" "}
              <div className="flex-1 text-center">
                {" "}
                <p className="text-sm md:text-base whitespace-nowrap">
                  {" "}
                  Total Number of Books{" "}
                </p>{" "}
                <h2 className="text-2xl font-semibold mt-1"> 100+ </h2>{" "}
              </div>{" "}
            </div>{" "}
            {/* Total Users */}{" "}
            <div className="bg-[#105631] text-white flex items-center gap-5 px-5 py-4 rounded shadow-md min-h-21">
              {" "}
              <FontAwesomeIcon icon={faUsers} className="text-5xl" />{" "}
              <div className="flex-1 text-center">
                {" "}
                <p className="text-sm md:text-base whitespace-nowrap">
                  {" "}
                  Total Number of Users{" "}
                </p>{" "}
                <h2 className="text-2xl font-semibold mt-1"> 100+ </h2>{" "}
              </div>{" "}
            </div>{" "}
            {/* Total Employees */}{" "}
            <div className="bg-[#FFB900] text-white flex items-center gap-5 px-5 py-4 rounded shadow-md min-h-21">
              {" "}
              <FontAwesomeIcon icon={faBookAtlas} className="text-4xl" />{" "}
              <div className="flex-1 text-center">
                {" "}
                <p className="text-sm md:text-base whitespace-nowrap">
                  {" "}
                  Total Number of Employees{" "}
                </p>{" "}
                <h2 className="text-2xl font-semibold mt-1"> 100+ </h2>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="pv"
                    cx="50%"
                    cy="50%"
                    outerRadius="52%"
                    fill="#8884d8"
                    stroke="#fff"
                  />
                  <Pie
                    data={data}
                    dataKey="uv"
                    cx="50%"
                    cy="50%"
                    innerRadius="62%"
                    outerRadius="80%"
                    fill="#82ca9d"
                    stroke="#fff"
                    label={({ value }) => value}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminHome;
