import { Container, Typography, Grid, Card, CardContent, List, ListItem, ListItemText, Box } from "@mui/material";

export default function About() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        About This Job Portal
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 900 }}>
        We’re a student-built job portal focused on clarity and speed. Our mission is to
        connect candidates with teams through simple navigation, clean job descriptions,
        and fast applications—without dark patterns.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>What We Do</Typography>
              <List dense>
                <ListItem><ListItemText primary="Curate job listings across engineering, data, design, and more." /></ListItem>
                <ListItem><ListItemText primary="Showcase companies with logos and basic profiles." /></ListItem>
                <ListItem><ListItemText primary="Provide quick links to apply—no endless forms." /></ListItem>
                <ListItem><ListItemText primary="Keep content minimal so you can focus on the role." /></ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Our Principles</Typography>
              <List dense>
                <ListItem><ListItemText primary="Clarity over clutter" secondary="You shouldn’t need 10 clicks to get to Apply." /></ListItem>
                <ListItem><ListItemText primary="Realistic expectations" secondary="We highlight responsibilities and impact, not buzzwords." /></ListItem>
                <ListItem><ListItemText primary="Respect for time" secondary="Fast filtering, quick loading, and responsive UI." /></ListItem>
                <ListItem><ListItemText primary="Privacy aware" secondary="We don’t ask for data we don’t need." /></ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Roadmap</Typography>
        <Typography color="text.secondary">
          Upcoming: saved jobs, advanced filters, company tags, and role alerts.
        </Typography>
      </Box>
    </Container>
  );
}