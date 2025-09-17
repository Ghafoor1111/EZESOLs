// pages/search.js
export async function getServerSideProps(context) {
  const q = context.query.q || "";
  if (!q) return { props: { q: "", results: null, error: null } };

  try {
    const per_page = 24;
    const apiUrl = `https://api.shutterstock.com/v2/images/search?query=${encodeURIComponent(q)}&per_page=${per_page}&view=minimal`;

    const r = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.SHUTTERSTOCK_TOKEN}`,
        Accept: 'application/json'
      }
    });

    if (!r.ok) {
      const text = await r.text();
      return { props: { q, results: null, error: `Shutterstock error ${r.status}: ${text}` } };
    }

    const data = await r.json();
    return { props: { q, results: data.data || [], error: null } };
  } catch (err) {
    return { props: { q, results: null, error: err.message } };
  }
}

export default function SearchPage({ q, results, error }) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Roboto, Arial", padding: 20 }}>
      <h1>Shutterstock search: {q}</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!results && !error && <div>Type a search or open via a share link.</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginTop: 12 }}>
        {results && results.map(img => (
          <div key={img.id} style={{border:"1px solid #eee", padding:8, borderRadius:8}}>
            {img.assets?.preview?.url ? (
              <img src={img.assets.preview.url} alt={img.description||''} style={{width:"100%", height:140, objectFit:"cover", borderRadius:6}} />
            ) : <div style={{height:140, background:"#f3f3f3"}}/>}
            <div style={{marginTop:8, fontSize:13}}>
              <div style={{fontWeight:600}}>{img.description || "Untitled"}</div>
              <div style={{color:"#666", fontSize:12}}>ID: {img.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
