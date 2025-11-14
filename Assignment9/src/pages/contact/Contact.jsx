import { useState } from "react";
import {
  Container, Typography, Grid, TextField, Button, Card, CardContent, Snackbar, Alert, Box
} from "@mui/material";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // 这里仅前端演示：真实项目可 POST 到 /support/tickets
    console.log("Contact submit:", { name, email, msg });
    setOk(true);
    setName(""); setEmail(""); setMsg("");
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Contact Us</Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 900 }}>
        Questions about a role or a company listing? Send us a message and we’ll get back within 1–2 business days.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent component="form" onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Name" fullWidth value={name} onChange={e=>setName(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email" type="email" fullWidth value={email} onChange={e=>setEmail(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Message" fullWidth multiline minRows={4} value={msg} onChange={e=>setMsg(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">Send</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Support</Typography>
              <Box sx={{ color: "text.secondary" }}>
                <div>Email: support@jobportal.example</div>
                <div>Hours: Mon–Fri, 9:00–18:00 (ET)</div>
                <div>FAQ: We’ll soon add a knowledge base for common questions.</div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={ok} autoHideDuration={2500} onClose={()=>setOk(false)}>
        <Alert severity="success" variant="filled" onClose={()=>setOk(false)}>
          Message sent. We’ll reply soon!
        </Alert>
      </Snackbar>
    </Container>
  );
}