import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper
} from "@mui/material";

export default function AdminEmployees(){
  const [rows,setRows] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try{
        const { data } = await api.get('/users');
        setRows(data.users || []);
      }catch(e){ setRows([]); }
    })();
  },[]);

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Employees
      </Typography>

      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r,i)=>(
              <TableRow key={i}>
                <TableCell>{r.fullName}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}