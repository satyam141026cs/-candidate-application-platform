import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ data }) => {
  const navigate = useNavigate();
  const navigateToExternalUrl = (url) => {
    window.location.href = url;
  };
  return (
    <div className="jobCard">
      <div>
        <span className="jobPostTimeLine">
          {" "}
          ⏳ Posted X days ago {/* {data?.companyName} */}
        </span>
      </div>
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "8px" }}>
        <div>
          <img width="40px" src={data?.logoUrl} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="first-letter-capital">{data?.companyName}</div>
          <div className="first-letter-capital">{data?.jobRole}</div>
          <div className="first-letter-capital">{data?.location}</div>
        </div>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <span>
          <h4 style={{ color: "rgb(77, 89, 106)" }}>
            Estimated Salary : {data?.minJdSalary || 0} -{" "}
            {data?.minJdSalary || 0} {data?.salaryCurrencyCode} ✅
          </h4>
        </span>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <h4>About us</h4>
        <p>{data?.jobDetailsFromCompany}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <a href={data?.jdLink}>View Job</a>
      </div>
     {data?.minExp && <div style={{ marginTop: "1.5rem" }}>
        <h3 className="expHeading"> Minimum Experience</h3>
        <h2 className="headingValueExp"> {data?.minExp} {"Years" || ""}</h2>
      </div>}

      <div style={{ marginTop: "1.5rem" }}>
        <Button
          variant="contained"
          className="buttonDesign"
          onClick={() => navigateToExternalUrl(data?.jdLink)}
        >
          Easy Apply
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
