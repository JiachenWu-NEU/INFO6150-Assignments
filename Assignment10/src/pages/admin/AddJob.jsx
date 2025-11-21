import { useState } from "react";
import api from "../../api/axios";
import {
  Box, Typography, TextField, Button, Grid, Snackbar, Alert,
  Card, CardContent, Chip
} from "@mui/material";

export default function AddJob(){
  const [form, setForm] = useState({
    company:"", title:"", description:"", salary:"", location:"", tags:""
  });
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e)=> setForm(prev => ({...prev, [k]: e.target.value}));

  const onSubmit = async (e)=>{
    e.preventDefault();
    setError("");
    try{
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        description: form.description.trim(),
        salary: form.salary.trim(),
        location: form.location.trim(),
        tags: form.tags.split(",").map(s=>s.trim()).filter(Boolean)
      };
      await api.post("/jobs", payload);
      setOk(true);
      setForm({ company:"", title:"", description:"", salary:"", location:"", tags:"" });
    }catch(e){
      setError((e.response?.data?.error || e.message || "Failed to create job")
      + ". Please ensure title(min_lenght=2), company(min_lenght=2), and description(min_lenght=10) are provided.");
    }
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Add Job
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ width: "100%" }}>
        <CardContent component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Company Name" required fullWidth
                         value={form.company} onChange={set("company")} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Job Title" required fullWidth
                         value={form.title} onChange={set("title")} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" required fullWidth multiline minRows={4}
                         value={form.description} onChange={set("description")} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Salary" fullWidth
                         value={form.salary} onChange={set("salary")} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Location" fullWidth
                         value={form.location} onChange={set("location")} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Tags (comma separated)" placeholder="Remote, Full-time, Backend"
                         fullWidth value={form.tags} onChange={set("tags")} />
              <Box sx={{ mt: 1, display:"flex", gap:1, flexWrap:"wrap" }}>
                {form.tags.split(",").map(s=>s.trim()).filter(Boolean).map((t,i)=>(
                  <Chip key={i} label={t} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit">Submit</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar open={ok} autoHideDuration={2200} onClose={()=>setOk(false)}>
        <Alert onClose={()=>setOk(false)} severity="success" variant="filled">
          Job created!
        </Alert>
      </Snackbar>
    </Box>
  );
}