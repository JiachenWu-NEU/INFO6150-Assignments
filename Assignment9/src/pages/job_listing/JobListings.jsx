const jobPosts = [
  { id:1, title:"Full Stack Developer", description:"...", lastUpdated:"Last updated 2 days ago", applyLink:"#"},
  { id:2, title:"Digital Marketing Specialist", description:"...", lastUpdated:"Last updated 1 day ago", applyLink:"#"},
];

export default function JobListings(){
  return (
    <div style={{padding:16}}>
      {jobPosts.map(j=>(
        <div key={j.id} style={{border:"1px solid #eee",borderRadius:8,padding:12,marginBottom:12}}>
          <h3>{j.title}</h3>
          <p>{j.description}</p>
          <small>{j.lastUpdated}</small><br/>
          <a href={j.applyLink} target="_blank" rel="noreferrer">Apply</a>
        </div>
      ))}
    </div>
  );
}