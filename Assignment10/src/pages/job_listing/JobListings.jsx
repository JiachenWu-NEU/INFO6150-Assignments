// src/pages/job_listing/JobListings.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Button, Chip, Stack, Alert, CircularProgress, InputAdornment
} from "@mui/material";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const tags = useMemo(() => {
    const s = new Set();
    jobs.forEach(j => (j.tags || []).forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [jobs]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const params = {};
        if (q.trim()) params.q = q.trim();
        if (tag.trim()) params.tag = tag.trim();

        const { data } = await api.get("/jobs", { params });
        setJobs(data?.jobs || []);
      } catch (e) {
        setErr(e.response?.data?.error || e.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey, q, tag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setRefreshKey(k => k + 1);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Job Listings
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search jobs..."
              placeholder="Title / company / description"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="submit" variant="contained" size="small">Search</Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={tag ? `Tag: ${tag}` : "All Tags"}
                color={tag ? "primary" : "default"}
                onDelete={tag ? () => setTag("") : undefined}
              />
              {tags.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  variant={t === tag ? "filled" : "outlined"}
                  color={t === tag ? "primary" : "default"}
                  clickable
                  onClick={() => setTag(t === tag ? "" : t)}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {loading && <CircularProgress size={28} />}
      {err && <Alert severity="error" sx={{ my: 2 }}>{err}</Alert>}
      {!loading && !err && jobs.length === 0 && (
        <Typography color="text.secondary">No jobs found.</Typography>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} lg={4} key={job._id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {job.company} {job.location ? `· ${job.location}` : ""}
                </Typography>
                {job.salary && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Salary: {job.salary}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  {String(job.description || "").slice(0, 160)}
                  {String(job.description || "").length > 160 ? "..." : ""}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                  {(job.tags || []).map((t, i) => (
                    <Chip key={i} size="small" label={t} />
                  ))}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Updated: {job.updatedAt ? new Date(job.updatedAt).toLocaleString() : "—"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}