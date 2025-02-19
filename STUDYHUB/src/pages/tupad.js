import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
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
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IoIosAddCircleOutline } from "react-icons/io";
import API_URL from './api';

const Tupad = () => {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
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

  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Calculate the rows to display on the current page
  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const PFO_OPTIONS = ['CDO', 'BUKIDNON', 'TSSD', 'MISOR', 'MISOC', 'LDN', 'CAMIGUIN'];
  

  useEffect(() => {
    const fetchTupadData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tupads`); 
        const data = response.data.data;

        const formattedData = data.map((item) => ({
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
          <TableCell component="th" scope="row">
            {row.seriesNo}
          </TableCell>
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
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Additional Details
                </Typography>
                <Table size="small" aria-label="details">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Date Received</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Duration</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>
                        Location
                      </TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>
                        Budget (₱)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                {(Array.isArray(row.history) ? row.history : []).map((historyRow, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {historyRow.dateReceived}
                    </TableCell>
                    <TableCell>{historyRow.duration}</TableCell>
                    <TableCell align="center">{historyRow.location}</TableCell>
                    <TableCell align="center">{historyRow.budget}</TableCell>
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
            Insert New WP
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

      <h1>Tupad</h1>
  <Box sx={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", marginLeft: "0.9rem"}}>
    <Button
      variant="contained"
      startIcon={<IoIosAddCircleOutline />}
      onClick={() => setModalOpen(true)}
    >
      Insert New WP
    </Button>
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
      >
        <TableRow>
          <TableCell sx={{ fontWeight: "bold", color: "white" }} />
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

  <TablePagination
    component="div"
    count={rows.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 20]}
  />

    </div>
  );
};

export default Tupad;
