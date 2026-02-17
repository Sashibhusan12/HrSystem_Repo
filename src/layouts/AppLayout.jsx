import TopNavbar from "../components/TopNavbar";
import { Outlet } from "react-router-dom";
import "../styles/globals.css";

export default function AppLayout(){
  return (
    <div className="app-container">
      <TopNavbar/>

      <main style={{paddingTop:"90px"}} className="p-4">
        <div className="page-card">
          <Outlet/>
        </div>
      </main>
    </div>
  );
}
