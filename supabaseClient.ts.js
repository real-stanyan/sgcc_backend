// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gdrofvndkwrpcuwtgudo.supabase.co"; // e.g. https://abcxyz.supabase.co
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkcm9mdm5ka3dycGN1d3RndWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Njg0MDMsImV4cCI6MjA2ODI0NDQwM30.W1ARD8qke7Bq8Cpr_wDuG4-JX3AdrHBz396r5EenBvg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
