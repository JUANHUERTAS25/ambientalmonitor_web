import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uilmukggyjgidhpadlqj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG11a2dneWpnaWRocGFkbHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1MDExODcsImV4cCI6MjA0MjA3NzE4N30.wK0rKx4k_V-QZXm2F8-7Sj6l9h0_tYpqL4zE9QxF_qw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
