import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://snosxbzquryktwbprvkg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNub3N4YnpxdXJ5a3R3YnBydmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzI0MTIsImV4cCI6MjA5ODMwODQxMn0.GgLrI67svaHgSS34d2sZ0_tyJBU-fL4M92utIaalIWQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
