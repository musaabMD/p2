// // app/api/filters/route.js
// import { NextResponse } from 'next/server';
// import Airtable from 'airtable';

// export async function GET() {
//   try {
//     // Initialize Airtable with server-side environment variables
//     const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
//     const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    
//     if (!apiKey || !baseId) {
//       return NextResponse.json(
//         { error: 'Airtable configuration missing' }, 
//         { status: 500 }
//       );
//     }
    
//     const base = new Airtable({ apiKey }).base(baseId);
    
//     // Fetch records from Airtable - IMPORTANT: Removed view parameter
//     const records = await base('FullQ').select({
//       fields: ['Subject', 'Source']
//     }).firstPage();
    
//     // Extract unique subjects and sources
//     const subjectsSet = new Set();
//     const sourcesSet = new Set();
    
//     records.forEach(record => {
//       const subject = record.get('Subject');
//       const source = record.get('Source');
      
//       if (subject) subjectsSet.add(subject);
//       if (source) sourcesSet.add(source);
//     });
    
//     // Transform to the format needed by the UI
//     const subjects = Array.from(subjectsSet).map(subject => ({
//       label: subject,
//       value: subject
//     }));
    
//     const sources = Array.from(sourcesSet).map(source => ({
//       label: source,
//       value: source
//     }));
    
//     return NextResponse.json({ subjects, sources });
//   } catch (error) {
//     console.error('Error fetching filter options:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch filter options from Airtable', details: error.message }, 
//       { status: 500 }
//     );
//   }
// }
// app/api/filters/route.js
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

export async function GET() {
  try {
    // Initialize Airtable with server-side environment variables
    // Try both server-side and client-side environment variables
    const apiKey = process.env.AIRTABLE_API_KEY || process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID || process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    
    if (!apiKey || !baseId) {
      console.error('Missing Airtable credentials:', { 
        hasApiKey: !!apiKey, 
        hasBaseId: !!baseId 
      });
      
      return NextResponse.json(
        { error: 'Airtable configuration missing' }, 
        { status: 500 }
      );
    }
    
    const base = new Airtable({ apiKey }).base(baseId);
    
    // Fetch records from Airtable - IMPORTANT: Removed view parameter
    const records = await base('FullQ').select({
      fields: ['Subject', 'Source']
    }).firstPage();
    
    // Extract unique subjects and sources
    const subjectsSet = new Set();
    const sourcesSet = new Set();
    
    records.forEach(record => {
      const subject = record.get('Subject');
      const source = record.get('Source');
      
      if (subject) subjectsSet.add(subject);
      if (source) sourcesSet.add(source);
    });
    
    // Transform to the format needed by the UI
    const subjects = Array.from(subjectsSet).map(subject => ({
      label: subject,
      value: subject
    }));
    
    const sources = Array.from(sourcesSet).map(source => ({
      label: source,
      value: source
    }));
    
    return NextResponse.json({ subjects, sources });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options from Airtable', details: error.message }, 
      { status: 500 }
    );
  }
}