// /configs/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejqkysectavyrdyuwrlj.supabase.co'; // remplace par ton URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcWt5c2VjdGF2eXJkeXV3cmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjEzODEsImV4cCI6MjA2MzQ5NzM4MX0.LJpSBxyUrVpbgnFbxXJJKqhuG-J2DB7UaMJSZGAD04I'; // remplace par ta clé Anon publique

export const supabase = createClient(supabaseUrl, supabaseKey);
