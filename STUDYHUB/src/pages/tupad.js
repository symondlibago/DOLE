import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  Menu,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';
import PropTypes from 'prop-types';
import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputAdornment  from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IoIosAddCircleOutline, IoIosTrash} from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { BsExclamation } from "react-icons/bs";
import Swal from "sweetalert2";
import API_URL from './api';
import { IoClose } from "react-icons/io5"; 
import { FaRegEdit } from "react-icons/fa";
import { PiInfoLight } from "react-icons/pi";
const Tupad = () => {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    pfo: '',
    seriesNo: '',
    adlNo: '',
    beneficiaries: '',
    actual: '',
    status: 'Pending',
    dateReceived: '',
    duration: '',
    location: '',
    budget: '',
    voucher_amount: '',
    commited_date: '',
    commited_date_received: '',
    commited_status: 'Pending',
    moi: '',
    project_title: '',
    
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openRows, setOpenRows] = useState({});
  const [selectedTupadsId, setSelectedTupadsId] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [pageModal, setPageModal] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const formatDateTime = (dateString) => {
    return dateString ? new Date(dateString).toISOString().slice(0, 16) : "mm/dd/yyyy";
  };
  

  const handleDateChange = (name, newDate) => {
    setStatuses((prevStatuses) =>
      prevStatuses.map((status) =>
        status.name === name ? { ...status, date: newDate } : status
      )
    );
  };

  const isNextDisabled = () => {
    const requiredFields = ["TSSD", "Budget", "IMSD Chief for Appraisal Signature", "ARD for Appraisal Signature", "RD Approval and WP Signature"];
    return statuses.some(status => requiredFields.includes(status.name) && !status.date);
  };
  


  const formatDate = (date) => {
    return date && date !== "mm/dd/yyyy" ? date : null;
  };
  
  const handleSave = async () => {
    try {
        const payload = {
            tupad_id: selectedTupadsId,
            tssd: formatDate(statuses.find(s => s.name === "TSSD")?.date),
            budget: formatDate(statuses.find(s => s.name === "Budget")?.date),
            imsd_chief: formatDate(statuses.find(s => s.name === "IMSD Chief for Appraisal Signature")?.date),
            ard: formatDate(statuses.find(s => s.name === "ARD for Appraisal Signature")?.date),
            rd: formatDate(statuses.find(s => s.name === "RD Approval and WP Signature")?.date),
            process: formatDate(statuses.find(s => s.name === "Process to Budget")?.date),
            budget_accounting: formatDate(statuses.find(s => s.name === "Budget to Accounting")?.date),
            accounting: formatDate(statuses.find(s => s.name === "Accounting to Cashier")?.date),
            payment_status: "Pending",
        };

        console.log("Sending Payload:", payload);

        const response = await axios.post("http://localhost:8000/api/tupad_papers", payload);

        console.log(response.data.message, response.data.data);

        Swal.fire({
            icon: "success",
            title: "Saved Successfully!",
            text: "Your data has been saved.",
            timer: 2000,
            showConfirmButton: false,
        });

        setStatusOpen(false);
        fetchTupadData(); // Refresh data after saving
    } catch (error) {
        console.error("Error saving data:", error.response?.data || error.message);

        Swal.fire({
            icon: "error",
            title: "Save Failed",
            text: error.response?.data?.message || "An error occurred while saving.",
        });
    }
};

  
const filteredRows = rows.filter(row =>
  (row.seriesNo && row.seriesNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (Array.isArray(row.adlNo) && row.adlNo.some(adl => 
    String(adl).toLowerCase().includes(searchQuery.toLowerCase()))
  ) ||
  (row.project_title && row.project_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (row.commited_status && row.commited_status.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (row.pfo && row.pfo.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (row.status && row.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (Array.isArray(row.history) && row.history.some(historyRow => 
    historyRow.dateReceived && historyRow.dateReceived.toLowerCase().includes(searchQuery.toLowerCase())
  )) ||
  (row.payment_status && row.payment_status.toLowerCase().includes(searchQuery.toLowerCase())) // Search in payment_status
);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handlePrint = () => {
    setOpenRows(prevState => {
      const allRows = {}; 
      rows.forEach((_, index) => {
        allRows[index] = true; 
      });
      return allRows;
    });
  
    setTimeout(() => {
      window.print();
    }, 500); 
  };

  
  

  const handleExport = () => {
    const headers = ["Series No", "ADL No", "PFO", "Beneficiaries", "Actual", "Status", "Date Received", "Duration", "Location", "Budget", "MOI", "Voucher Amount"];
    const csvRows = [];
  
    csvRows.push(headers.join(","));
  
    paginatedRows.forEach(row => {
      const history = Array.isArray(row.history) && row.history.length > 0 ? row.history[0] : {};
  
      const rowData = [
        row.seriesNo,
        row.adlNo,
        row.pfo,
        row.beneficiaries,
        row.actual,
        row.status,
        history.dateReceived || 'N/A',  
        history.duration || 'N/A',  
        history.location || 'N/A',  
        history.budget || '0',
        history.moi || '0',
        history.voucher_amount || '0',
      ];
      csvRows.push(rowData.join(","));
    });
  
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tupad_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  

  
  const handleInputChange = async (field, value) => {
    setNewEntry((prev) => ({
      ...prev,
      [field]: value,
    }));
  
    if (field === "pfo" && value) {
      try {
        const response = await axios.get(`${API_URL}/api/tupads/latest-series/${value}`);
        const latestSeriesNo = response.data.latestSeriesNo || 0; 
        const nextSeriesNo = String(latestSeriesNo + 1).padStart(3, "0"); 
  
        setNewEntry((prev) => ({
          ...prev,
          seriesNo: nextSeriesNo, 
        }));
      } catch (error) {
        console.error("Error fetching latest series number:", error);
      }
    }
  };

  const resetForm = () => {
    setNewEntry({
      pfo: '',
      seriesNo: '',
      adlNo: [''],
      target: '',
      initial: '',
      status: 'Pending',
      dateReceived: '',
      duration: '',
      location: '',
      budget: '',
      voucher_amount: '',
      commited_date: '',
      commited_date_received: '',
      commited_status: 'Pending',
      moi: '',
      project_title: '',
    });
  
    setAdlNumbers(['']); 
    setSelectedEntry(null);
  };
  
  
  const [adlNumbers, setAdlNumbers] = useState(['']);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const PFO_OPTIONS = ['CDO', 'BUKIDNON', 'TSSD', 'MISOR', 'MISOC', 'LDN', 'CAMIGUIN'];
  const MOI = ['Co Partners', 'Direct Administration'];

  const fetchTupadData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tupads`);
      const data = response.data.data;
  
      const formattedData = data.map((item, index) => ({
        id: item.id || index, 
        seriesNo: item.series_no,
        adlNo: item.adl_no,
        pfo: item.pfo,
        beneficiaries: item.beneficiaries,
        actual: item.actual,
        status: item.status,
        budget: item.budget,
        voucher_amount: item.voucher_amount,
        commited_date: item.commited_date,
        commited_date_received: item.commited_date_received,
        commited_status: item.commited_status,
        project_title: item.project_title,
        history: [
          {
            dateReceived: item.date_received || 'N/A',
            duration: `${item.duration} months`,
            location: item.location || 'N/A',
            budget: item.budget || 0,
            moi: item.moi,
            voucher_amount: item.voucher_amount,
            
          },
        ],
      }));
  
      setRows(formattedData);
    } catch (error) {
      console.error('Error fetching Tupad data:', error);
    }
    
  };
  
  useEffect(() => {
    fetchTupadData();
  }, []);

  const handleEditEntry = (entry) => {
    console.log('Selected Entry:', entry); 
  
    setSelectedEntry(entry); 
    
    const cleanedAdlNumbers = entry.adlNo.map(adl => adl.split('-').pop());

    setNewEntry({
      pfo: entry.pfo || '',
      seriesNo: entry.seriesNo ? entry.seriesNo.split('-').pop() : '',
      adlNo: cleanedAdlNumbers, 
      beneficiaries: entry.beneficiaries || '',
      actual: entry.actual || '',
      status: entry.status || 'Pending',
      dateReceived: entry.history?.[0]?.dateReceived || '',
      duration: entry.history?.[0]?.duration?.replace(' months', '') || '',
      location: entry.history?.[0]?.location || '',
      budget: entry.budget || '',
      voucher_amount: entry.history?.[0]?.voucher_amount || '',
      commited_date: entry.commited_date || '',
      commited_date_received: entry.commited_date_received || '',
      commited_status: entry.commited_status || 'Pending',
      moi: entry.history?.[0]?.moi || '',
      project_title: entry.project_title || '',
    });

    setAdlNumbers(cleanedAdlNumbers);
    setModalOpen(true);
};

  
  

const handleAddNewEntry = () => {
  const formattedSeriesNo = newEntry.pfo
    ? `TUPAD${newEntry.pfo}-${new Date().getFullYear()}-${newEntry.seriesNo}`
    : '';

  const formattedAdlNos = adlNumbers.map(adl => 
    adl.startsWith(`ADL-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-`) 
      ? adl 
      : `ADL-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${adl}`
  );

  const payload = {
    series_no: formattedSeriesNo,
    adl_no: formattedAdlNos,
    pfo: newEntry.pfo,
    beneficiaries: parseInt(newEntry.beneficiaries, 10),
    actual: parseFloat(newEntry.actual),
    status: newEntry.status,
    date_received: newEntry.dateReceived,
    duration: parseInt(newEntry.duration, 10),
    location: newEntry.location,
    budget: parseFloat(newEntry.budget),
    voucher_amount: parseFloat(newEntry.voucher_amount),
    commited_date: newEntry.commited_date,
    commited_date_received: newEntry.commited_date_received,
    commited_status: newEntry.commited_status,
    moi: newEntry.moi,
    project_title: newEntry.project_title
  };

  if (selectedEntry) {
    axios.put(`http://localhost:8000/api/tupads/${selectedEntry.id}`, payload)
      .then((response) => {
        console.log('Entry updated successfully:', response.data);

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedEntry.id
              ? { ...row, ...response.data.data }
              : row
          )
        );

        Swal.fire({
          icon: "success",
          title: "Updated Successfully!",
          text: "The entry has been updated.",
          timer: 2000,
          showConfirmButton: false
        });

        setSelectedEntry(null);
        fetchTupadData();
      })
      .catch((error) => {
        console.error('Error updating entry:', error.response?.data || error.message);

        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: error.response?.data?.message || "An error occurred while updating.",
        });
      });
  } else {
    axios.post(`http://localhost:8000/api/tupads`, payload)
      .then((response) => {
        console.log('Entry created successfully:', response.data);

        setRows((prevRows) => [...prevRows, response.data.data]);
        fetchTupadData();

        Swal.fire({
          icon: "success",
          title: "Added Successfully!",
          text: "The new entry has been created.",
          timer: 2000,
          showConfirmButton: false
        });

      })
      .catch((error) => {
        console.error('Error creating entry:', error.response?.data || error.message);

        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: error.response?.data?.message || "An error occurred while adding the entry.",
        });
      });
  }
  
  setModalOpen(false);
};

const getStatusColor = (status) => {
  switch (status) {
    case "Implemented":
    case "Received":
    case "Paid":
      return "#28A745"; 
    case "Unpaid":
      return "#DC3545"; 
    case "Pending":
      return "#FFC107"; 
    case "Late Received":
      return "#FD7E14"; 
    default:
      return "#6C757D"; 
  }
};


const handleStatusClick = async (row) => {
  try {
    // Ensure you are using the ID
    const id = row.id; 

    if (!id) {
      Swal.fire("Error", "Invalid ID", "error");
      return;
    }

    const response = await fetch(`http://localhost:8000/api/tupad/${id}`);
    const data = await response.json();

    if (!response.ok) {
      Swal.fire("Error", data.message || "Failed to fetch data", "error");
      return;
    }

    Swal.fire({
      title: "Work Program Status",
      html: `
        <p><strong>Status:</strong> 
          <span style="color: ${getStatusColor(data.status)}; font-weight: bold;">
          ${data.status || "N/A"}</span>
        </p>
        <p><strong>Committed Status:</strong> 
          <span style="color: ${getStatusColor(data.commited_status)}; font-weight: bold;">
          ${data.commited_status || "N/A"}</span>
        </p>
        <p><strong>Payment Status:</strong> 
          <span style="color: ${getStatusColor(data.payment_status)}; font-weight: bold;">
          ${data.payment_status || "N/A"}</span>
        </p>
      `,
      icon: "info",
      confirmButtonText: "OK",
    });
  } catch (error) {
    Swal.fire("Error", "Failed to load data", "error");
  }
};


  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    const formatDateExclamation = (dateString) => {
      const options = { year: "numeric", month: "long", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    };
    
    const handleExclamationClick = (commited_date) => {
      Swal.fire({
        icon: "warning",
        title: "Unpaid Commitment",
        text: `The committed date is unpaid.\nCommitted Date: ${formatDateExclamation(commited_date)}`,
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    };


    return (
      <>    
       <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
       <TableCell>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "50px" }}>
            <span style={{ width: "24px", textAlign: "center" }}>
              {row.commited_status.toLowerCase() === "unpaid" && (
                <BsExclamation
                  style={{
                    color: "red",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    animation: "swing 0.8s ease-in-out infinite",
                    display: "inline-block",
                  }}
                  onClick={() => handleExclamationClick(row.commited_date)}
                />
              )}
            </span>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </TableCell>


          <TableCell component="th" scope="row">{row.project_title}</TableCell>  
          <TableCell align="center">{row.seriesNo}</TableCell>
          <TableCell align="center">
            {Array.isArray(row.adlNo) ? row.adlNo.join(" | ") : row.adlNo}
          </TableCell>
          <TableCell align="center">{row.pfo}</TableCell>
          <TableCell align="center">{row.beneficiaries}</TableCell>
          <TableCell align="center">{row.actual}</TableCell>
          <TableCell align="center">
          <IconButton onClick={() => handleStatusClick(row)} sx={{ color: "#003366" }}>
            <PiInfoLight size={24} />
          </IconButton>
          </TableCell>
          <TableCell align="center">
          <Button
            variant="text" // Removes background color
            size="small"
            onClick={() => handleEditEntry(row)}
            sx={{
              minWidth: "auto",
              p: 1,
              backgroundColor: "transparent", // Ensures background is fully transparent
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" }, // Light hover effect
            }}
          >
            <FaRegEdit size={20} color="black" />
          </Button>
      </TableCell>

        </TableRow>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" className="tupad-collapse">
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Additional Details
                </Typography>
                <Table size="small" aria-label="details">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Date Received</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Duration</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Location</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Mode of Implementation</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Voucher Amount</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Budget (₱)</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Status History</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Array.isArray(row.history) ? row.history : []).map((historyRow, index) => (
                      <TableRow key={index}>
                        <TableCell>{historyRow.dateReceived}</TableCell>
                        <TableCell>{historyRow.duration}</TableCell>
                        <TableCell align="center">{historyRow.location}</TableCell>
                        <TableCell align="center">{historyRow.moi}</TableCell>
                        <TableCell align="center">{historyRow.voucher_amount}</TableCell>
                        <TableCell align="center">{historyRow.budget}</TableCell>
                        <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            console.log("Row Data:", row);
                            console.log("Tupad ID:", row.id); 

                            if (!row.id) {
                              console.error("Tupad ID is undefined for this row");
                              return;
                            }

                            try {
                              const response = await fetch(`http://localhost:8000/api/tupads_papers/tupad/${row.id}`);
                              const data = response.ok ? await response.json() : {}; 
                              console.log("Fetched Data:", data);

                             
                              setStatuses([
                                { name: "TSSD", date: formatDateTime(data.tssd) || "" },
                                { name: "Budget", date: formatDateTime(data.budget) || "" },
                                { name: "IMSD Chief for Appraisal Signature", date: formatDateTime(data.imsd_chief) || "" },
                                { name: "ARD for Appraisal Signature", date: formatDateTime(data.ard) || "" },
                                { name: "RD Approval and WP Signature", date: formatDateTime(data.rd) || "" },
                                { name: "Process to Budget", date: formatDateTime(data.process) || "" },
                                { name: "Budget to Accounting", date: formatDateTime(data.budget_accounting) || "" },
                                { name: "Accounting to Cashier", date: formatDateTime(data.accounting) || "" },
                              ]);

                              setSelectedTupadsId(row.id); 
                              setStatusOpen(true); 

                            } catch (error) {
                              console.error("Error fetching data:", error);
                              setStatusOpen(true); 
                            }
                          }}
                        >
                          View Details
                        </Typography>


                      </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
      
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      seriesNo: PropTypes.string.isRequired,
      adlNo: PropTypes.string.isRequired,
      pfo: PropTypes.string.isRequired,
      beneficiaries: PropTypes.number.isRequired,
      actual: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          dateReceived: PropTypes.string.isRequired,
          duration: PropTypes.string.isRequired,
          location: PropTypes.string.isRequired,
          budget: PropTypes.number.isRequired,
        })
      ).isRequired,
    }).isRequired,
  };

  return (
    <div className="tupad-container">

    {/* INSERTING AND UPDATING MODAL */}
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
    <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  }}
>
  {/* Header with Title and Close Button */}
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      {selectedEntry ? "Edit WP" : "Insert New WP"}
    </Typography>
    <IconButton 
      onClick={() => setModalOpen(false)} 
      sx={{ color: "red" }} // Set button color to red
    >
      <IoClose size={24} />
    </IconButton>

  </Box>



    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        alignItems: "center",
      }}
    >
      <FormControl fullWidth>
        <InputLabel>PFO</InputLabel>
        <Select
          value={newEntry.pfo}
          onChange={(e) => handleInputChange("pfo", e.target.value)}
        >
          {PFO_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          label="Series Number"
          value={
            newEntry.pfo
              ? `TUPAD${newEntry.pfo}-${new Date().getFullYear()}-${newEntry.seriesNo}`
              : ""
          }
          margin="normal"
          InputProps={{ readOnly: true }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  {adlNumbers.map((adl, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TextField
        label={`ADL Number ${index + 1}`}
        value={adlNumbers[index]}
        onChange={(e) => {
          const updatedAdlNumbers = [...adlNumbers];
          updatedAdlNumbers[index] = e.target.value;
          setAdlNumbers(updatedAdlNumbers);
        }}
      />
      {adlNumbers.length > 1 && (
        <IconButton
          onClick={() => {
            const updatedAdlNumbers = adlNumbers.filter((_, i) => i !== index);
            setAdlNumbers(updatedAdlNumbers);
          }}
        >
          <IoIosTrash color="red" />
        </IconButton>
      )}
    </Box>
  ))}
  <IconButton onClick={() => setAdlNumbers([...adlNumbers, ""])}>
    <IoIosAddCircleOutline color="green" />
  </IconButton>
</Box>


      <TextField
        fullWidth
        label="Project Title"
        value={newEntry.project_title}
        onChange={(e) => handleInputChange("project_title", e.target.value)}
      />

      <TextField
        fullWidth
        label="Number of Target Beneficiaries"
        value={newEntry.beneficiaries}
        onChange={(e) => handleInputChange("beneficiaries", e.target.value)}
      />
      <TextField
        fullWidth
        label="Actual"
        value={newEntry.actual}
        onChange={(e) => handleInputChange("actual", e.target.value)}
      />
      <TextField
        fullWidth
        label="Date Received"
        value={newEntry.dateReceived}
        onChange={(e) => handleInputChange("dateReceived", e.target.value)}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        label="Committed Date for ADL Budget"
        value={newEntry.commited_date}
        onChange={(e) => handleInputChange("commited_date", e.target.value)}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        label="Committed Date Recieved"
        value={newEntry.commited_date_received}
        onChange={(e) => handleInputChange("commited_date_received", e.target.value)}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        label="Duration (in months)"
        value={newEntry.duration}
        onChange={(e) => handleInputChange("duration", e.target.value)}
        type="number"
      />
      <TextField
        fullWidth
        label="Location"
        value={newEntry.location}
        onChange={(e) => handleInputChange("location", e.target.value)}
      />

        <FormControl fullWidth>
        <InputLabel>Mode of Implementation</InputLabel>
        <Select
          value={newEntry.moi}
          onChange={(e) => handleInputChange("moi", e.target.value)}
        >
          {MOI.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
          </Select>
         </FormControl>  

      <TextField
        fullWidth
        label="Budget (₱)"
        value={newEntry.budget}
        onChange={(e) => handleInputChange("budget", e.target.value)}
        type="number"
      />
      <TextField
        fullWidth
        label="Voucher Amount (₱)"
        value={newEntry.voucher_amount}
        onChange={(e) => handleInputChange("voucher_amount", e.target.value)}
        type="number"
      />
    </Box>
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
  <Button
    variant="contained"
    sx={{ ml: "auto" }}
    onClick={handleAddNewEntry}
  >
    Save
  </Button>
</Box>

  </Box>
</Modal>



      {/* STATUS MODAL */}

      <Modal open={statusOpen} onClose={() => setStatusOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 900,
      height: 580,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Header with Close Button */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography variant="h6" gutterBottom>Implementation Status</Typography>
      <IconButton 
        onClick={() => setStatusOpen(false)} 
        sx={{ color: "red" }} // Set button color to red
      >
        <IoClose size={24} />
</IconButton>

    </Box>

    {/* Table Container */}
    <TableContainer component={Paper} sx={{ flex: 1, overflow: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Paper Status</strong></TableCell>
            <TableCell><strong>Date Received</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statuses.length > 0 ? (
            statuses
              .slice((pageModal - 1) * ITEMS_PER_PAGE, pageModal * ITEMS_PER_PAGE)
              .map((status, index) => (
                <TableRow key={index}>
                  <TableCell>{status.name || "No Name"}</TableCell>
                  <TableCell>
                    <TextField
                      type="datetime-local"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={status.date || ""}
                      onChange={(e) => handleDateChange(status.name, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Footer with Pagination & Save Button */}
    {statuses.length > ITEMS_PER_PAGE && (
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "background.paper",
          p: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Pagination - Centered */}
        <Box sx={{ flex: 1, display: "flex" }}>
          <Pagination
            count={Math.ceil(statuses.length / ITEMS_PER_PAGE)}
            page={pageModal}
            onChange={(event, value) => {
              if (!isNextDisabled() || value < pageModal) {
                setPageModal(value); // Allow only backward movement if fields are empty
              }
            }}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                disabled={isNextDisabled() && item.type === "next"} // Disable "Next" if fields are missing
              />
            )}
          />
        </Box>

        {/* Save Button - Aligned to the Right */}
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    )}
  </Box>
</Modal>


    <h1>TUPAD</h1>

    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        width: "98%"
      }}
    >
      <Button
  variant="contained"
  startIcon={<IoIosAddCircleOutline />}
  onClick={() => {
    resetForm();  // Clear the form first
    setModalOpen(true);  // Then open the modal
  }}
  sx={{ 
    width: "250px",
    height: "50px",  
    fontSize: "1rem",  
    backgroundColor: "#003366", 
    color: "white", 
    "&:hover": { backgroundColor: "#002244" } 
  }}
>
  Insert New WP
</Button>


      <TextField
        variant="outlined"
        placeholder="Search Series No, ADL No, PFO, Date Received"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ 
          width: "350px",  
          height: "50px",  
          backgroundColor: "white", 
          borderRadius: "5px",
          marginLeft: "20px",
          
          "& .MuiInputBase-input": {
            fontSize: "0.85rem" 
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CiSearch size={18} />
            </InputAdornment>
          ),
        }}
      />
    </Box>

    <TableContainer component={Paper} className="tupad-table">
      <Table aria-label="collapsible table">
              <TableHead 
          align="center"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#003366",
          }} 
          className="tupad-table-head"
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "white" }} />
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Project Title</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Series No</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>ADL No</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>PFO</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Beneficiaries</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Actual</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row) => (
            <Row key={row.seriesNo} row={row} />
          ))}
        </TableBody>

      </Table>
    </TableContainer>

    {/* Pagination and Export Buttons */}
    <Box 
  sx={{ 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    width: "100%", 
    marginTop: "10px"
  }}
>
  {/* Pagination Component */}
  <TablePagination
    component="div"
    count={rows.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 20, 50, 100]}
  />

  {/* Export Button */}
  <Button
    variant="contained"
    onClick={handleClick}
    startIcon={<MdOutlineFileDownload />}
    sx={{ backgroundColor: "#003366", color: "white", "&:hover": { backgroundColor: "#002244" } }}
  >
    Export
  </Button>

  {/* Dropdown Menu */}
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
    <MenuItem onClick={() => { handleExport(); handleClose(); }}>Download CSV</MenuItem>
    <MenuItem onClick={() => { handlePrint(); handleClose(); }}>Print</MenuItem>
  </Menu>
</Box>



  </div>
);

};

export default Tupad;