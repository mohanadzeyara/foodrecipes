import React from 'react';
import axios from 'axios';

export default function RecipeCard({ r, api, user, token, onDeleted }){
  const onDelete = async () => {
    if (!token) return alert('Login required');
    if (!confirm('Delete recipe?')) return;
    await axios.delete(`${api}/api/recipes/${r._id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (onDeleted) onDeleted();
  };
  return (
    <div className="card">
      {r.image ? <img className="recipe-img" src={`${api}/images/${r.image}`} alt={r.title} /> : null}
      <h4>{r.title}</h4>
      <div className="small">By: {r.author?.name || 'Unknown'}</div>
      <p>{r.description}</p>
      <strong>Ingredients</strong>
      <ul>{(r.ingredients||[]).map((ing,i)=><li key={i}>{ing}</li>)}</ul>
      <strong>Steps</strong>
      <ol>{(r.steps||[]).map((s,i)=><li key={i}>{s}</li>)}</ol>
      {user && r.author && user.id === r.author._id ? <button onClick={onDelete}>Delete</button> : null}
    </div>
  );
}
