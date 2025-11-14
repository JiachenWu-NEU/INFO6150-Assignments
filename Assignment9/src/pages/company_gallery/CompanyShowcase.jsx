import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CompanyShowcase(){
  const [companies,setCompanies] = useState([]);
  useEffect(()=>{
    (async ()=>{
      const { data } = await api.get("/user/getAll");
      const list = (data.users||[]).map(u=>({
        name: u.fullName || u.email,
        image: u.imagePath || null
      })).filter(c=>c.image);
      setCompanies(list);
    })();
  },[]);
  return (
    <div style={{padding:16,display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))"}}>
      {companies.map((c,i)=>(
        <div key={i} style={{border:"1px solid #eee",borderRadius:8,overflow:"hidden"}}>
          <img src={c.image} alt={c.name} style={{width:"100%",height:160,objectFit:"cover"}}/>
          <div style={{padding:12}}>{c.name}</div>
        </div>
      ))}
    </div>
  );
}