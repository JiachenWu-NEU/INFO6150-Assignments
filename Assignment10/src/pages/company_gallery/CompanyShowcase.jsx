import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function CompanyShowcase() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/user/getAll");
      const base = (import.meta.env.VITE_API_BASE || "http://localhost:3000").replace(/\/+$/,'');
      const list = (data?.users || []).map(u => {
        const raw = u.imagePath || null;
        const image = raw
          ? (raw.startsWith('http') ? raw : `${base}/${raw.replace(/^\/+/,'')}`)
          : null;
        return { name: u.fullName || u.email, image };
      });
      setCompanies(list);
    })();
  }, []);

  return (
    <Grid container spacing={2} sx={{ p:2 }}>
      {companies.map((c, idx) => (
        <Grid item xs={12} md={4} lg={3} key={idx}>
          <Card>
            <CardMedia component="img" height="160" image={c.image} alt={c.name}/>
            <CardContent>
              <Typography variant="subtitle1">{c.name}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}