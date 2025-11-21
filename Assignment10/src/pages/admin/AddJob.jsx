import { useState } from "react";
import api from "../../api/axios";
import { Container, Typography, TextField, Button, Grid, Snackbar, Alert, Card, CardContent } from "@mui/material";

export default function AddJob(){
  const [form, setForm] = useState({ company:"", title:"", description:"", salary:"" });
  const [ok, setOk] = useState(false);

  const onSubmit = async (e)=>{
    e.preventDefault();
    try{
      // 等后端就绪改成真实接口：
      // await api.post('/create/job', form);
      console.log("POST /create/job (mock):", form);
      setOk(true);
      setForm({ company:"", title:"", description:"", salary:"" });
    }catch(e){}
  };

  const set = (k) => (e)=> setForm(prev => ({...prev, [k]: e.target.value}));

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Add Job</Typography>
      <Card>
        <CardContent component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField label="Company Name" fullWidth value={form.company} onChange={set("company")} /></Grid>
            <Grid item xs={12} md={6}><TextField label="Job Title" fullWidth value={form.title} onChange={set("title")} /></Grid>
            <Grid item xs={12}><TextField label="Description" fullWidth multiline minRows={4} value={form.description} onChange={set("description")} /></Grid>
            <Grid item xs={12} md={6}><TextField label="Salary" fullWidth value={form.salary} onChange={set("salary")} /></Grid>
            <Grid item xs={12}><Button variant="contained" type="submit">Submit</Button></Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar open={ok} autoHideDuration={2200} onClose={()=>setOk(false)}>
        <Alert onClose={()=>setOk(false)} severity="success" variant="filled">Job created (mock)!</Alert>
      </Snackbar>
    </Container>
  );
}