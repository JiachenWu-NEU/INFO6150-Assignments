import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function CompanyShowcase() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/user/getAll");
      const list = (data.users || [])
        .filter(u => u.password && u.email)
        .map(u => ({
          name: u.fullName || u.email,
          // 你的后端若返回了 user.imagePath，这里直接用
          image: u.imagePath || null
        }))
        .filter(c => !!c.image);
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