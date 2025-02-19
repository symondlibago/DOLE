import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00004B",
    color: theme.palette.common.white, // Text color set to black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(adlNumber, pfo, noOfWp, budget) {
  return { adlNumber, pfo, noOfWp, budget };
}

const rows = [
  createData("ADL001", "CDO", 5, "₱2000"),
  createData("ADL002", "BUKIDNON", 7, "₱3500"),
  createData("ADL003", "TSSD", 10, "₱5000"),
  createData("ADL004", "CAMIGUIN", 3, "₱1500"),
  createData("ADL005", "MISOR", 8, "₱4000"),
];

export default function ADL() {
  return (
    <div className="adl-container">
      <h1>ADL</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">ADL Number</StyledTableCell>
              <StyledTableCell align="center">PFO</StyledTableCell>
              <StyledTableCell align="center">No. of WP</StyledTableCell>
              <StyledTableCell align="center">Budget</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.adlNumber}>
                <StyledTableCell component="th" scope="row" align="center">
                  {row.adlNumber}
                </StyledTableCell>
                <StyledTableCell align="center">{row.pfo}</StyledTableCell>
                <StyledTableCell align="center">{row.noOfWp}</StyledTableCell>
                <StyledTableCell align="center">{row.budget}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
