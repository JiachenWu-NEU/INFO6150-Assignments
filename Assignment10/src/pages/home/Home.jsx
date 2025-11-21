import { Link as RouterLink } from "react-router-dom";
import {
  Box, Container, Typography, Button, Grid, Card, CardContent, Chip, Stack
} from "@mui/material";

export default function Home() {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 8 }}>
        <Container>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Find your next great job
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: 720 }}>
            A simple, fast job portal to browse roles, discover companies, and apply in minutes.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              component={RouterLink}
              to="/jobs"
              variant="contained"
              color="secondary"
            >
              Browse Jobs
            </Button>
            <Button
              component={RouterLink}
              to="/companies"
              variant="outlined"
              sx={{ color: "inherit", borderColor: "rgba(255,255,255,0.7)" }}
            >
              Explore Companies
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Quick stats */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={2}>
          {[
            { label: "Open Roles", value: "1,200+" },
            { label: "Companies", value: "180+" },
            { label: "Avg. Response", value: "3 days" },
          ].map((s, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured categories */}
      <Container sx={{ pb: 6 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Featured Categories
        </Typography>
        <Grid container spacing={2}>
          {["Full-Stack", "Data Science", "Product", "Design", "Marketing", "Support"].map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{c}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Hand-picked roles from vetted teams. Updated daily.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip size="small" label="Remote" />
                    <Chip size="small" label="Hybrid" />
                    <Chip size="small" label="On-site" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: "grey.100", py: 6 }}>
        <Container>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={700}>Ready to apply?</Typography>
              <Typography color="text.secondary">
                Create an account and start applying to jobs that match your skills.
              </Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              <Button component={RouterLink} to="/jobs" variant="contained">
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}