// // app/api/questions/route.js
// import { NextResponse } from 'next/server';
// import Airtable from 'airtable';

// export async function GET(request) {
//   try {
//     // Get query parameters for filtering
//     const url = new URL(request.url);
//     const subject = url.searchParams.get('subject');
//     const source = url.searchParams.get('source');
//     const searchTerm = url.searchParams.get('search');
//     const review = url.searchParams.get('review');

//     console.log('API Filter Params:', { subject, source, searchTerm, review });

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
    
//     // Build filter formula based on query parameters
//     let filterFormula = '';
    
//     if (subject) {
//       // Handle multiple subjects by splitting comma-separated values
//       const subjects = subject.split(',');
//       if (subjects.length > 0) {
//         const subjectConditions = subjects.map(s => `{Subject} = '${s}'`).join(', ');
//         filterFormula += `OR(${subjectConditions})`;
//       }
//     }
    
//     if (source) {
//       const sourceCondition = `{Source} = '${source}'`;
//       filterFormula = filterFormula ? `AND(${filterFormula}, ${sourceCondition})` : sourceCondition;
//     }
    
//     if (searchTerm) {
//       const searchCondition = `FIND('${searchTerm.toLowerCase()}', LOWER({fullQ}))`;
//       filterFormula = filterFormula ? `AND(${filterFormula}, ${searchCondition})` : searchCondition;
//     }
    
//     if (review === 'review_pinned') {
//       const pinnedCondition = `{Flagged} = TRUE()`;
//       filterFormula = filterFormula ? `AND(${filterFormula}, ${pinnedCondition})` : pinnedCondition;
//     } else if (review === 'review_incorrect') {
//       const incorrectCondition = `{inCorrect} > 0`;
//       filterFormula = filterFormula ? `AND(${filterFormula}, ${incorrectCondition})` : incorrectCondition;
//     }
    
//     // Log the filter formula for debugging
//     console.log('Filter formula:', filterFormula || 'No filters applied');
    
//     // Set up query params for Airtable - IMPORTANT: Removed view parameter
//     const queryParams = {};
    
//     if (filterFormula) {
//       queryParams.filterByFormula = filterFormula;
//     }
    
//     // Fetch records from Airtable
//     const records = await base('FullQ').select(queryParams).firstPage();
    
//     console.log(`Retrieved ${records.length} records from Airtable`);
    
//     // Transform records to the format we need
//     const questions = records.map(record => {
//       // Get question options (A, B, C, D) from number fields
//       const choices = [
//         { id: "A", text: record.get('1') || "Option A" },
//         { id: "B", text: record.get('2') || "Option B" },
//         { id: "C", text: record.get('3') || "Option C" },
//         { id: "D", text: record.get('4') || "Option D" },
//       ];
      
//       // Convert numeric CorrectAnswer (1,2,3,4) to letter (A,B,C,D)
//       const correctAnswerNum = record.get('CorrectAnswer');
//       const correctAnswer = correctAnswerNum ? String.fromCharCode(64 + correctAnswerNum) : "";
      
//       return {
//         id: record.id,
//         qid: record.get('QID'),
//         question: record.get('fullQ') || "No question text available",
//         correctAnswer: correctAnswer,
//         subject: record.get('Subject') || "Unknown",
//         source: record.get('Source') || "Unknown",
//         pinned: record.get('Flagged') || false,
//         correct: record.get('Correct') || 0,
//         incorrect: record.get('inCorrect') || 0,
//         choices: choices,
//         explanation: record.get('explanation') || "No explanation provided",
//         questionImage: record.get('image Question') || [],
//         explanationImage: record.get('image in explination') || [],
//         answered: null,
//         explanationVisible: false,
//       };
//     });
    
//     // Return the questions as JSON
//     return NextResponse.json(questions);
//   } catch (error) {
//     console.error('Error fetching questions:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to fetch questions from Airtable', 
//         details: error.message,
//         stack: error.stack
//       }, 
//       { status: 500 }
//     );
//   }
// }
// app/api/questions/route.js
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

export async function GET(request) {
  try {
    // Get query parameters for filtering
    const url = new URL(request.url);
    const subject = url.searchParams.get('subject');
    const source = url.searchParams.get('source');
    const searchTerm = url.searchParams.get('search');
    const review = url.searchParams.get('review');

    console.log('API Filter Params:', { subject, source, searchTerm, review });

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
    
    // Build filter formula based on query parameters
    let filterFormula = '';
    
    if (subject) {
      // Handle multiple subjects by splitting comma-separated values
      const subjects = subject.split(',');
      if (subjects.length > 0) {
        const subjectConditions = subjects.map(s => `{Subject} = '${s}'`).join(', ');
        filterFormula += `OR(${subjectConditions})`;
      }
    }
    
    if (source) {
      const sourceCondition = `{Source} = '${source}'`;
      filterFormula = filterFormula ? `AND(${filterFormula}, ${sourceCondition})` : sourceCondition;
    }
    
    if (searchTerm) {
      const searchCondition = `FIND('${searchTerm.toLowerCase()}', LOWER({fullQ}))`;
      filterFormula = filterFormula ? `AND(${filterFormula}, ${searchCondition})` : searchCondition;
    }
    
    if (review === 'review_pinned') {
      const pinnedCondition = `{Flagged} = TRUE()`;
      filterFormula = filterFormula ? `AND(${filterFormula}, ${pinnedCondition})` : pinnedCondition;
    } else if (review === 'review_incorrect') {
      const incorrectCondition = `{inCorrect} > 0`;
      filterFormula = filterFormula ? `AND(${filterFormula}, ${incorrectCondition})` : incorrectCondition;
    }
    
    // Log the filter formula for debugging
    console.log('Filter formula:', filterFormula || 'No filters applied');
    
    // Set up query params for Airtable - IMPORTANT: Removed view parameter
    const queryParams = {};
    
    if (filterFormula) {
      queryParams.filterByFormula = filterFormula;
    }
    
    // Fetch records from Airtable
    const records = await base('FullQ').select(queryParams).firstPage();
    
    console.log(`Retrieved ${records.length} records from Airtable`);
    
    // Transform records to the format we need
    const questions = records.map(record => {
      // Get question options (A, B, C, D) from number fields
      const choices = [
        { id: "A", text: record.get('1') || "Option A" },
        { id: "B", text: record.get('2') || "Option B" },
        { id: "C", text: record.get('3') || "Option C" },
        { id: "D", text: record.get('4') || "Option D" },
      ];
      
      // Convert numeric CorrectAnswer (1,2,3,4) to letter (A,B,C,D)
      const correctAnswerNum = record.get('CorrectAnswer');
      const correctAnswer = correctAnswerNum ? String.fromCharCode(64 + correctAnswerNum) : "";
      
      return {
        id: record.id,
        qid: record.get('QID'),
        question: record.get('fullQ') || "No question text available",
        correctAnswer: correctAnswer,
        subject: record.get('Subject') || "Unknown",
        source: record.get('Source') || "Unknown",
        pinned: record.get('Flagged') || false,
        correct: record.get('Correct') || 0,
        incorrect: record.get('inCorrect') || 0,
        choices: choices,
        explanation: record.get('explanation') || "No explanation provided",
        questionImage: record.get('image Question') || [],
        explanationImage: record.get('image in explination') || [],
        answered: null,
        explanationVisible: false,
      };
    });
    
    // Return the questions as JSON
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch questions from Airtable', 
        details: error.message,
        stack: error.stack
      }, 
      { status: 500 }
    );
  }
}