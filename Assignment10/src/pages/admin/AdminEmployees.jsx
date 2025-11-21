import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

export default function AdminEmployees(){
  const [rows,setRows] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try{
        // 后端未就绪先占位：若你已有 /users，就改成真实接口
        // const { data } = await api.get('/users');
        // setRows(data.users || []);
        setRows([
          { fullName: "Jane Admin", email: "jane@ex.com", type: "admin" },
          { fullName: "John Emp",   email: "john@ex.com", type: "employee" },
        ]);
      }catch(e){ setRows([]); }
    })();
  },[]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Employees</Typography>
      <Paper>
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
                <TableCell>{r.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}