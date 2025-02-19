import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Tupad = () => {
  function createData(seriesNo, adlNo, pfo, target, initial, status, budget) {
    return {
      seriesNo,
      adlNo,
      pfo,
      target,
      initial,
      status,
      budget,
      history: [
        {
          dateReceived: '2020-01-05',
          duration: '3 Months',
          location: 'City Center',
          budget: 3000,
        },
        {
          dateReceived: '2020-01-02',
          duration: '6 Months',
          location: 'Suburban Area',
          budget: 5000,
        },
      ],
    };
  }

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

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
                      <TableCell style={{ fontWeight: 'bold'}}>Date Received</TableCell>
                      <TableCell style={{ fontWeight: 'bold'}}>Duration</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold'}}>Location</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold'}}>Budget (₱)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow, index) => (
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
      adlNo: PropTypes.number.isRequired,
      pfo: PropTypes.number.isRequired,
      target: PropTypes.number.isRequired,
      initial: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          dateReceived: PropTypes.string.isRequired,
          duration: PropTypes.string.isRequired,
          location: PropTypes.string.isRequired,
          budget: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  };

  const rows = [
    createData('TUPADCDO-2025-001','ADL-2025-001' , 'CDO', 24, 4.0, 'Completed', 3.99),
    createData('TUPADCAMIGUIN-2025-001', 'ADL-2025-002', 'CAMIGUIN', 37, 4.3, 'Pending', 4.99),
    createData('TUPADMISOR-2025-001', 'ADL-2025-003', 'MISOR', 24, 6.0, 'Completed', 3.79),
    createData('TUPADTSSD-2025-001', 'ADL-2025-001', 'TSSD', 67, 4.3, 'Pending', 2.5),
    createData('TUPADBUKIDNON-2025-001', 'ADL-2025-001','BUKIDNON', 49, 3.9, 'Completed', 1.5),
  ];

  return (
    <div className="tupad-container">
      <h1>Tupad</h1>
      <TableContainer component={Paper} className="tupad-table">
        <Table aria-label="collapsible table">
        <TableHead align="center" sx={{ backgroundColor: '#003366' }}>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold', color: 'white' }} />
          <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Series No</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>ADL No</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>PFO</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>No. Target</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Initial</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
        </TableRow>
      </TableHead>

          <TableBody>
            {rows.map((row) => (
              <Row key={row.seriesNo} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Tupad;
