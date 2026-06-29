import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function PlantList({ session }) {
  const [plants, setPlants] = useState([])
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('Healthy')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPlants() }, [])

  async function fetchPlants() {
    setLoading(true)
    const { data } = await supabase.from('plants').select('*').order('created_at', { ascending: false })
    setPlants(data || [])
    setLoading(false)
  }

  async function addPlant(e) {
    e.preventDefault()
    await supabase.from('plants').insert([{ name, species, room_location: location, status, user_id: session.user.id }])
    setName(''); setSpecies(''); setLocation(''); setStatus('Healthy')
    fetchPlants()
  }

  async function deletePlant(id) {
    await supabase.from('plants').delete().eq('id', id)
    fetchPlants()
  }

  async function updateStatus(id, newStatus) {
    await supabase.from('plants').update({ status: newStatus }).eq('id', id)
    fetchPlants()
  }

  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.room_location.toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = { 'Healthy': 'green', 'Needs Watering': 'orange', 'Dormant': 'grey' }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🌱 My Plants</h1>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Log Out</button>
      </div>

      <form onSubmit={addPlant} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3>Add a Plant</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input placeholder="Plant name *" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '0.5rem' }} />
          <input placeholder="Species" value={species} onChange={e => setSpecies(e.target.value)} style={{ padding: '0.5rem' }} />
          <input placeholder="Room location *" value={location} onChange={e => setLocation(e.target.value)} required style={{ padding: '0.5rem' }} />
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.5rem' }}>
            <option>Healthy</option>
            <option>Needs Watering</option>
            <option>Dormant</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1.5rem', background: 'green', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Add Plant</button>
      </form>

      <input placeholder="🔍 Search by name, location or status..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', boxSizing: 'border-box', fontSize: '1rem' }} />

      {loading ? <p>Loading...</p> : filtered.length === 0 ? <p>No plants found.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a1a' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Species</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Location</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Added</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(plant => (
              <tr key={plant.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '0.75rem' }}>{plant.name}</td>
                <td style={{ padding: '0.75rem' }}>{plant.species || '—'}</td>
                <td style={{ padding: '0.75rem' }}>{plant.room_location}</td>
                <td style={{ padding: '0.75rem' }}>
                  <select value={plant.status} onChange={e => updateStatus(plant.id, e.target.value)} style={{ padding: '0.25rem', color: statusColor[plant.status] }}>
                    <option>Healthy</option>
                    <option>Needs Watering</option>
                    <option>Dormant</option>
                  </select>
                </td>
                <td style={{ padding: '0.75rem' }}>{new Date(plant.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem' }}>
                  <button onClick={() => deletePlant(plant.id)} style={{ padding: '0.25rem 0.75rem', background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}