import { Grid, TextField, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { SearchDropDown } from "./components/SearchDropDown";
import "./App.css";
import JobCard from "./components/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/users/users";

function App() {
  const [jobListings, setJobListings] = useState([]);
  const [jobListingsDropdownOption, setJobListingsDropdownOption] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch(s=>s.user);
  const { userData } = useSelector((s) => s.user);
  const [filterOption, setFilterOption] = useState({
    exp: [
      { label: "1", value: 1 },
      { label: "2", value: 2 },
      { label: "3", value: 3 },
      { label: "4", value: 4 },
      { label: "5", value: 5 },
      { label: "6", value: 6 },
      { label: "7", value: 7 },
      { label: "8", value: 8 },
      { label: "9", value: 9 },
      { label: "10", value: 10 },
    ],
    remote: [
      { label: "Remote", value: "1" },
      { label: "On-Site", value: 2 },
      { label: "Hybrid", value: 3 },
    ],
    minBaseSalary: [
      { label: "0L", value: 0 },
      { label: "10L", value: 100 },
      { label: "20L", value: 20 },
      { label: "30L", value: 30 },
      { label: "40L", value: 40 },
      { label: "50L", value: 50 },
      { label: "60L", value: 60 },
      { label: "70L", value: 70 },
    ],
    numberOfEmp: [
      { label: "1-10", value: 1 },
      { label: "11-20", value: 2 },
      { label: "21-50", value: 3 },
      { label: "51-100", value: 4 },
      { label: "101-200", value: 5 },
      { label: "201-500", value: 6 },
      // Add more options as needed
    ],
  });
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [filterSelectedOption, setFilterSelectedOption] = useState({
    exp: "",
    minBaseSalary: "",
    remote: "",
    numberOfEmp: "",
  });

  // Define debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  useEffect(() => {
    getJobRelatedData();
  }, []);
  useEffect(() => {
    if (searchInput) {
      const filteredData = jobListings.filter((item) =>
        item?.companyName.toLowerCase().includes(searchInput.toLowerCase())
      );
      setJobListings(filteredData);
    } else if (selectedOptions?.length) {
      const filteredData = jobListings.filter((item) =>
        selectedOptions.includes(item.jobRole.toLowerCase())
      );
      setJobListings(filteredData);
    } else if (filterSelectedOption?.exp) {
      const filteredData = jobListings.filter(
        (item) => item && item.minExp === filterSelectedOption?.exp?.value
      );
      if (filteredData?.length) {
        setJobListings(filteredData);
      }
    } else if (filterSelectedOption?.minBaseSalary) {
      const filteredData = jobListings.filter(
        (item) =>
          item && item.minJdSalary <= filterSelectedOption?.minBaseSalary?.value
      );

      if (filteredData?.length) {
        setJobListings(filteredData);
      }
    }
  }, [searchInput, selectedOptions, filterSelectedOption]);

  const getJobRelatedData = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
      limit: 9,
      offset: 0,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body,
    };

    fetch(
      "https://api.weekday.technology/adhoc/getSampleJdJSON",
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        setJobListings(response?.jdList);
        dispatch(setUser({ user: response?.jdList},))
        const modifiedList = response?.jdList?.map((item) => item.jobRole);
        setJobListingsDropdownOption(modifiedList);

        if (response?.jdList?.length > 0) {
          const startSalary = 1; // Start from 80L
          const endSalary = 100; // End at 100L
          const step = 1;
          const newMinBaseSalaryOptions = [];
          for (let i = startSalary; i <= endSalary; i += step) {
            const label = `${i}L`;
            newMinBaseSalaryOptions.push({ label, value: i });
          }
          setFilterOption({
            ...filterOption,
            minBaseSalary: newMinBaseSalaryOptions,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  const loadMoreData = () => {
    if (!loading) {
      setLoading(true);
      const nextPage = page + 1; // Increment page number
      setPage(nextPage); // Update the page state before fetching data
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      setSearchInput("");
      const body = JSON.stringify({
        limit: 9,
        offset: (nextPage - 1) * 9, // Calculate offset based on the next page number
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body,
      };

      fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      )
        .then((response) => response.json())
        .then((response) => {
          setJobListings([...jobListings, ...response?.jdList]); // Append new data to existing jobListings
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
    setTimeout(() => {
      setLoading(false);
    }, 2.3);
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        // Detect when user reaches the bottom of the page
        setLoading(true);
        loadMoreData();
      }
    }, 0.1);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [jobListings, page]);

  return (
    <div className="App" style={{ padding: "20px", marginTop: "1rem" }}>
      {/* Filter Ui */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          overflowX: "scroll",
          WebkitOverflowScrolling: "touch", // for smooth scrolling on iOS remotes
          maxWidth: "100%",
          scrollbarWidth: "none", // hide scrollbar on Firefox
          "-ms-overflow-style": "none", // hide scrollbar on IE and Edge
        }}
      >
        <div style={{ minWidth: "150px" }}>
          <SearchDropDown
            options={jobListingsDropdownOption || []}
            onChange={setSelectedOptions}
          />
        </div>
        <div style={{ minWidth: "250px" }}>
          <Autocomplete
            options={filterOption?.numberOfEmp}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              setFilterSelectedOption((prevState) => ({
                ...prevState,
                numberOfEmp: value,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Number Of Employees"
                variant="outlined"
              />
            )}
          />
        </div>

        <div style={{ minWidth: "150px" }}>
          <Autocomplete
            options={filterOption?.remote}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              setFilterSelectedOption((prevState) => ({
                ...prevState,
                remote: value,
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Remote" variant="outlined" />
            )}
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <Autocomplete
            options={filterOption?.exp}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              setFilterSelectedOption((prevState) => ({
                ...prevState,
                exp: value,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Experience"
                variant="outlined"
              />
            )}
          />
        </div>
        <div style={{ minWidth: "250px" }}>
          <Autocomplete
            onChange={(e, value) => {
              setFilterSelectedOption((prevState) => ({
                ...prevState,
                minBaseSalary: value,
              }));
            }}
            options={filterOption?.minBaseSalary}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Minimum Base Pay Salary"
                variant="outlined"
              />
            )}
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <TextField
            value={searchInput}
            placeholder="Search Company Name"
            variant="outlined"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
      </div>
      {/* Card ui */}
      <div style={{ marginTop: "2rem" }}>
        <Grid container spacing={2}>
          {jobListings?.length
            ? jobListings.map((item, index) => {
                return (
                  <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                    <JobCard data={item} />
                  </Grid>
                );
              })
            : ""}
        </Grid>
        {loading && (
          <p
            style={{
              textAlign: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span>
              {" "}
              Loading... <CircularProgress style={{ margin: "auto" }} />
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
