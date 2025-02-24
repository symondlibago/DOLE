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
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import API_URL from './api';

const Tupad = () => {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    pfo: '',
    seriesNo: '',
    adlNo: '',
    target: '',
    initial: '',
    status: 'Pending',
    dateReceived: '',
    duration: '',
    location: '',
    budget: '',
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openRows, setOpenRows] = useState({});
  const [dates, setDates] = useState({});
  const [selectedTupadsId, setSelectedTupadsId] = useState(null);
  const [statuses, setStatuses] = useState([]);

  const formatDateTime = (date) => {
    if (!date) return ""; // Keep empty values empty
    return `${date}T00:00`; // Append default time
  };
  

  const handleDateChange = (status, value) => {
    setDates((prev) => ({
      ...prev,
      [status]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedTupadsId) {
        console.error("Error: selectedTupadsId is undefined or null");
        return;
    }

    console.log("Sending Data:", {
        tupad_id: selectedTupadsId,  // ✅ Ensure the key matches backend
        budget: dates["Budget"] || null,
        received_from_budget: dates["Received from Budget"] || null,
        tssd_sir_jv: dates["TSSD/SIR JV"] || null,
        received_from_tssd_sir_jv: dates["Received from TSSD/SIR JV"] || null,
        rd: dates["RD"] || null,
        received_from_rd: dates["Received from RD"] || null,
    });

    try {
        const response = await axios.post(`http://localhost:8000/api/tupadspapers`, {
            tupad_id: selectedTupadsId,
            budget: dates["Budget"] || null,
            received_from_budget: dates["Received from Budget"] || null,
            tssd_sir_jv: dates["TSSD/SIR JV"] || null,
            received_from_tssd_sir_jv: dates["Received from TSSD/SIR JV"] || null,
            rd: dates["RD"] || null,
            received_from_rd: dates["Received from RD"] || null,
        });

        console.log("Data saved:", response.data);
        setStatusOpen(false);
    } catch (error) {
        console.error("Error saving data:", error.response?.data || error.message);
    }
};


  
  
  



  const filteredRows = rows.filter(row =>
    row.seriesNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.adlNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.pfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.history.some(historyRow => 
    historyRow.dateReceived.toLowerCase().includes(searchQuery.toLowerCase())
    )
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

  
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const PFO_OPTIONS = ['CDO', 'BUKIDNON', 'TSSD', 'MISOR', 'MISOC', 'LDN', 'CAMIGUIN'];

  useEffect(() => {
    const fetchTupadData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tupads`); 
        const data = response.data.data;

        const formattedData = data.map((item, index) => ({
          id: item.id || index, // Ensure each row has a unique ID
          seriesNo: item.series_no,
          adlNo: item.adl_no,
          pfo: item.pfo,
          target: item.target,
          initial: item.initial,
          status: item.status,
          budget: item.budget,
          history: [
            {
              dateReceived: item.date_received || 'N/A',
              duration: `${item.duration} months`,
              location: item.location || 'N/A',
              budget: item.budget || 0,
            },
          ],
        }));
        
        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching Tupad data:', error);
      }
    };

    fetchTupadData();
  }, []);

  const handleExport = () => {
    const headers = ["Series No", "ADL No", "PFO", "No. Target", "Initial", "Status", "Date Received", "Duration", "Location", "Budget"];
    const csvRows = [];
  
    csvRows.push(headers.join(","));
  
    paginatedRows.forEach(row => {
      // Check if history exists and has at least one entry
      const history = Array.isArray(row.history) && row.history.length > 0 ? row.history[0] : {};
  
      const rowData = [
        row.seriesNo,
        row.adlNo,
        row.pfo,
        row.target,
        row.initial,
        row.status,
        history.dateReceived || 'N/A',  // Extract from history
        history.duration || 'N/A',  // Extract from history
        history.location || 'N/A',  // Extract from history
        history.budget || '0',  // Extract from history
      ];
      csvRows.push(rowData.join(","));
    });
  
    // Create a Blob with CSV data
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
        const latestSeriesNo = response.data.latestSeriesNo || 0; // Default to 0 if no records exist
        const nextSeriesNo = String(latestSeriesNo + 1).padStart(3, "0"); // Format as 3-digit (001, 002, etc.)
  
        setNewEntry((prev) => ({
          ...prev,
          seriesNo: nextSeriesNo, // Auto-fill the series number
        }));
      } catch (error) {
        console.error("Error fetching latest series number:", error);
      }
    }
  };
  

  const handleAddNewEntry = () => {
    const formattedSeriesNo = newEntry.pfo
      ? `TUPAD${newEntry.pfo}-${new Date().getFullYear()}-${newEntry.seriesNo}`
      : '';
      const formattedAdlNo = `ADL-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${newEntry.adlNo}`;

  
    const payload = {
      series_no: formattedSeriesNo,
      adl_no: formattedAdlNo,
      pfo: newEntry.pfo,
      target: parseInt(newEntry.target, 10),
      initial: parseFloat(newEntry.initial),
      status: newEntry.status,
      date_received: newEntry.dateReceived,
      duration: parseInt(newEntry.duration, 10),
      location: newEntry.location,
      budget: parseFloat(newEntry.budget),
    };
  
    axios
      .post(`http://localhost:8000/api/tupads`, payload)
      .then((response) => {
        console.log('Entry created successfully:', response.data);
  
        const newEntryData = {
          seriesNo: payload.series_no,
          adlNo: payload.adl_no,
          pfo: payload.pfo,
          target: payload.target,
          initial: payload.initial,
          status: payload.status,
          budget: payload.budget,
          history: [
            {
              dateReceived: payload.date_received || 'N/A',
              duration: `${payload.duration} months`,
              location: payload.location || 'N/A',
              budget: payload.budget || 0,
            },
          ],
        };
  
        setRows((prevRows) => [...prevRows, newEntryData]);
  
        setModalOpen(false);
        setNewEntry({
          pfo: '',
          seriesNo: '',
          adlNo: '',
          target: '',
          initial: '',
          status: 'Pending',
          dateReceived: '',
          duration: '',
          location: '',
          budget: '',
        });
      })
      .catch((error) => {
        console.error('Error creating entry:', error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.message || 'An error occurred while creating the entry.'}`);
      });
  };
  
  
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'completed':
          return '#4CAF50'; // Green
        case 'pending':
          return '#FF9800'; // Orange
        default:
          return 'black';
      }
    };

    

    return (
      <>
      
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">{row.id}</TableCell>
          <TableCell component="th" scope="row">{row.seriesNo}</TableCell>
          <TableCell align="center">{row.adlNo}</TableCell>
          <TableCell align="center">{row.pfo}</TableCell>
          <TableCell align="center">{row.target}</TableCell>
          <TableCell align="center">{row.initial}</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold', color: getStatusColor(row.status) }}>
            {row.status}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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
    console.log("Row ID:", row.id);

    if (row.id) {
      try {
        const response = await fetch(`http://localhost:8000/api/tupads-papers/${row.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("Fetched Data:", data);

        setSelectedTupadsId(row.id);
        setStatuses([
  { name: "Budget", date: formatDateTime(data.budget) },
  { name: "Received from Budget", date: formatDateTime(data.received_from_budget) },
  { name: "TSSD Sir JV", date: formatDateTime(data.tssd_sir_jv) },
  { name: "Received from TSSD Sir JV", date: formatDateTime(data.received_from_tssd_sir_jv) },
  { name: "RD", date: formatDateTime(data.rd) },
  { name: "Received from RD", date: formatDateTime(data.received_from_rd) },
]);
console.log("Updated Statuses:", statuses);


        setStatusOpen(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.error("ID is undefined for this row");
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
      target: PropTypes.number.isRequired,
      initial: PropTypes.number.isRequired,
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

    {/* MODAL */}
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Insert New WPsadasd
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr', // Two columns
              gap: 2, // Space between fields
              alignItems: 'center', // Align items in the center
            }}
          >
            <FormControl fullWidth>
              <InputLabel>PFO</InputLabel>
              <Select
                value={newEntry.pfo}
                onChange={(e) => handleInputChange('pfo', e.target.value)}
              >
                {PFO_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
              fullWidth
              label="Series Number"
              value={newEntry.pfo ? `TUPAD${newEntry.pfo}-${new Date().getFullYear()}-${newEntry.seriesNo}` : ''}
              margin="normal"
              InputProps={{ readOnly: true }}
            />

            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                label="ADL Number"
                value={`ADL-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
                margin="normal"
                InputProps={{ readOnly: true }}
              />

              <TextField
                fullWidth
                label="Value (XXX)"
                value={newEntry.adlNo}
                onChange={(e) => handleInputChange('adlNo', e.target.value)}
                margin="normal"
              />
            </Box>

            <TextField
              fullWidth
              label="Number of Target"
              value={newEntry.target}
              onChange={(e) => handleInputChange('target', e.target.value)}
            />
            <TextField
              fullWidth
              label="Initial"
              value={newEntry.initial}
              onChange={(e) => handleInputChange('initial', e.target.value)}
            />
            <TextField
              fullWidth
              label="Date Received"
              value={newEntry.dateReceived}
              onChange={(e) => handleInputChange('dateReceived', e.target.value)}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Duration (in months)"
              value={newEntry.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              type="number"
            />
            <TextField
              fullWidth
              label="Location"
              value={newEntry.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
            <TextField
              fullWidth
              label="Budget (₱)"
              value={newEntry.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              type="number"
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{ marginTop: 3 }}
            onClick={handleAddNewEntry}
          >
            Save
          </Button>
        </Box>
      </Modal>


      {/* STATUS MODAL */}

      <Modal open={statusOpen} onClose={() => setStatusOpen(false)} tupadsId={selectedTupadsId}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Paper Status
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Paper Status</strong></TableCell>
                <TableCell><strong>Date Received</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {statuses.length > 0 ? (
    statuses.map((status, index) => (
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
      <TableCell colSpan={2} align="center">
        No data available
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </TableContainer>
        
        {/* Save Button */}
        <Button
          onClick={handleSave}
          sx={{ mt: 2, display: "block", marginLeft: "auto" }}
          variant="contained"
          color="primary"
        >
          Save
        </Button>

        {/* Close Button */}
        <Button
          onClick={() => setStatusOpen(false)}
          sx={{ mt: 1, display: "block", marginLeft: "auto" }}
          variant="outlined"
          color="secondary"
        >
          Close
        </Button>
      </Box>
    </Modal>

    <h1>Tupad</h1>

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
        onClick={() => setModalOpen(true)}
        sx={{ 
          width: "280px",  
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
          width: "320px",  
          height: "50px",  
          backgroundColor: "white", 
          borderRadius: "5px",
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
          }} className="tupad-table-head"
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "white" }} />
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>ID</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Series No</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>ADL No</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>PFO</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>No. Target</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Initial</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Status</TableCell>
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

    </Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
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
