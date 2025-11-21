import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Chip, Stack, Alert, CircularProgress
} from "@mui/material";

function joinUrl(base, rel) {
  if (!rel) return null;
  if (rel.startsWith("http")) return rel;
  return `${(base || "").replace(/\/+$/,'')}/${rel.replace(/^\/+/,'')}`;
}
function initials(name) {
  const s = (name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s[0].toUpperCase();
}

export default function CompanyShowcase() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tag, setTag] = useState("");

  const base = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const params = {};
        if (tag) params.tag = tag;
        const { data } = await api.get("/companies", { params });
        const list = (data?.companies || []).map(c => ({
          id: c._id,
          name: c.name,
          website: c.website,
          description: c.description,
          image: joinUrl(base, c.imagePath),
          tags: Array.isArray(c.tags) ? c.tags : []
        }));
        setRows(list);
      } catch (e) {
        setErr(e.response?.data?.error || e.message || "Failed to load companies");
      } finally {
        setLoading(false);
      }
    })();
  }, [tag]);

  const tags = useMemo(() => {
    const s = new Set();
    rows.forEach(r => (r.tags || []).forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [rows]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Company Showcase
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
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

      {loading && <CircularProgress size={28} />}
      {err && <Alert severity="error" sx={{ my: 2 }}>{err}</Alert>}
      {!loading && !err && rows.length === 0 && (
        <Typography color="text.secondary">No companies yet.</Typography>
      )}

      <Grid container spacing={2}>
        {rows.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.id}>
            <Card sx={{ height: "100%" }}>
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.name}
                  style={{ width: "100%", height: 160, objectFit: "cover" }}
                />
              ) : (
                <Box sx={{
                  height: 160, display: "flex", alignItems: "center", justifyContent: "center",
                  bgcolor: "grey.100", fontSize: 40, fontWeight: 700
                }}>
                  {initials(c.name)}
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" fontWeight={700}>{c.name}</Typography>
                {c.website && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {c.website}
                  </Typography>
                )}
                {c.description && (
                  <Typography variant="body2" sx={{ mb: 1.5 }}>
                    {c.description.slice(0, 120)}{c.description.length > 120 ? "..." : ""}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(c.tags || []).map((t, i) => <Chip key={i} size="small" label={t} />)}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}