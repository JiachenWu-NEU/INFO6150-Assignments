import { Card, CardContent, CardActions, Button, Typography, Grid } from "@mui/material";

const jobPosts = [
  { id:1, title:"Full Stack Developer",
    description:"Join our dynamic team to work on cutting-edge technologies. Develop and maintain sophisticated web applications for our diverse client base.",
    lastUpdated:"Last updated 2 days ago",
    applyLink:"https://example.com/apply/full-stack-developer" },
  { id:2, title:"Digital Marketing Specialist",
    description:"Elevate our digital marketing strategies to promote our innovative products. Proficiency in SEO, SEM, and social media marketing is highly valued.",
    lastUpdated:"Last updated 1 day ago",
    applyLink:"https://example.com/apply/digital-marketing-specialist" },
  { id:3, title:"UX/UI Designer",
    description:"Shape engaging user experiences and create visually captivating designs. Work alongside cross-functional teams to turn ideas into reality.",
    lastUpdated:"Last updated 4 hours ago",
    applyLink:"https://example.com/apply/ux-ui-designer" },
  { id:4, title:"Data Scientist",
    description:"Leverage advanced analytics and machine learning to uncover insights from vast data sets. Proficiency with Python and R is a must.",
    lastUpdated:"Last updated 3 days ago",
    applyLink:"https://example.com/apply/data-scientist" },
  { id:5, title:"Customer Support Representative",
    description:"Deliver unparalleled customer service and support. Exceptional communication skills and a knack for solving problems are key.",
    lastUpdated:"Last updated 6 hours ago",
    applyLink:"https://example.com/apply/customer-support-representative" },
  { id:6, title:"Project Manager",
    description:"Guide and coordinate project teams to ensure successful project delivery. Strong organizational and leadership skills are required.",
    lastUpdated:"Last updated 1 week ago",
    applyLink:"https://example.com/apply/project-manager" },
];

export default function JobListings() {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {jobPosts.map(job => (
        <Grid item xs={12} md={6} lg={4} key={job.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="body2" sx={{ my:1 }}>{job.description}</Typography>
              <Typography variant="caption" color="text.secondary">{job.lastUpdated}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" href={job.applyLink} target="_blank" rel="noreferrer">Apply</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}