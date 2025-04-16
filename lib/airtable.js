// // lib/airtable.js
// import Airtable from 'airtable';

// // Initialize Airtable with API key from environment variables
// const initAirtable = () => {
//   // Use the original environment variable names that are already working in your app
//   const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
//   const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  
//   if (!apiKey || !baseId) {
//     throw new Error('Airtable API key or Base ID is missing in environment variables');
//   }
  
//   // Log for debugging purposes (remove in production)
//   console.log('Initializing Airtable with Base ID:', baseId);
  
//   try {
//     return new Airtable({ apiKey }).base(baseId);
//   } catch (error) {
//     console.error('Error initializing Airtable:', error);
//     throw new Error('Failed to initialize Airtable connection');
//   }
// };

// // Get all flashcards from Airtable
// export async function getFlashcards() {
//   try {
//     const base = initAirtable();
    
//     // Use 'FullQ' table since it works for your questions API
//     const table = base('FullQ');
    
//     // Note: We're not specifying a view at all, which should retrieve all records
//     const records = await table.select({
//       // No view specified - get all records
//       // Specify the exact field names as seen in your Airtable screenshot
//       fields: [
//         'FlashcardQuestion',  // Question field
//         'FlashcardA',         // Answer field
//         'GOODCARD',           // Good counter
//         'AGAINCARD',          // Again counter
//         'Source',             // Subject/category
//         'Flagged'             // Flag status (if available)
//       ]
//     }).all();
    
//     console.log(`Retrieved ${records.length} records from Airtable`);
    
//     return records.map((record, index) => ({
//       id: record.id,
//       number: index + 1,
//       question: record.get('FlashcardQuestion') || '', 
//       answer: record.get('FlashcardA') || '',
//       subject: record.get('Source') || 'General',
//       goodCount: record.get('GOODCARD') || 0,
//       againCount: record.get('AGAINCARD') || 0,
//       flagged: record.get('Flagged') || false
//     }));
//   } catch (error) {
//     console.error('Error fetching flashcards:', error);
    
//     // More detailed error logging to help troubleshoot
//     if (error.statusCode === 403) {
//       console.error('Airtable authorization failed. Please check your API key and permissions.');
//     } else if (error.statusCode === 404) {
//       console.error('Airtable table or base not found. Please check your Base ID and table name.');
//     } else if (error.statusCode === 422) {
//       console.error('Invalid request - check view names and field names:', error.message);
//     }
    
//     throw error; // Re-throw to handle in the UI
//   }
// }

// // Update flashcard status in Airtable
// export async function updateFlashcardStatus(id, status) {
//   try {
//     const base = initAirtable();
//     const table = base('FullQ');
    
//     // Get current card data
//     const record = await table.find(id);
    
//     // Determine which field to update based on status
//     if (status === 'good') {
//       const currentValue = record.get('GOODCARD') || 0;
//       await table.update(id, { 'GOODCARD': currentValue + 1 });
//     } else if (status === 'again') {
//       const currentValue = record.get('AGAINCARD') || 0;
//       await table.update(id, { 'AGAINCARD': currentValue + 1 });
//     }
    
//     return true;
//   } catch (error) {
//     console.error(`Error updating flashcard ${id} status:`, error);
//     return false;
//   }
// }

// // Toggle flag status
// export async function toggleFlashcardFlag(id) {
//   try {
//     const base = initAirtable();
//     const table = base('FullQ');
    
//     // Get current flag status
//     const record = await table.find(id);
//     const currentFlagged = record.get('Flagged') || false;
    
//     // Toggle flag status
//     await table.update(id, {
//       'Flagged': !currentFlagged
//     });
    
//     return true;
//   } catch (error) {
//     console.error('Error toggling flashcard flag:', error);
//     return false;
//   }
// }
// lib/airtable.js
import Airtable from 'airtable';

// Initialize Airtable with API key from environment variables
const initAirtable = () => {
  // Try server-side env vars first, then fallback to client-side vars
  // This helps with both local development and Vercel deployment
  const apiKey = process.env.AIRTABLE_API_KEY || process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  
  // Debug log for troubleshooting (you can remove this in production)
  if (!apiKey) console.error('Airtable API key is missing!');
  if (!baseId) console.error('Airtable Base ID is missing!');
  
  if (!apiKey || !baseId) {
    throw new Error('Airtable API key or Base ID is missing in environment variables');
  }
  
  try {
    return new Airtable({ apiKey }).base(baseId);
  } catch (error) {
    console.error('Error initializing Airtable:', error);
    throw new Error('Failed to initialize Airtable connection');
  }
};

// Get all flashcards from Airtable
export async function getFlashcards() {
  try {
    const base = initAirtable();
    
    // Use 'FullQ' table since it works for your questions API
    const table = base('FullQ');
    
    // Note: We're not specifying a view at all, which should retrieve all records
    const records = await table.select({
      // No view specified - get all records
      // Specify the exact field names as seen in your Airtable screenshot
      fields: [
        'FlashcardQuestion',  // Question field
        'FlashcardA',         // Answer field
        'GOODCARD',           // Good counter
        'AGAINCARD',          // Again counter
        'Source',             // Subject/category
        'Flagged'             // Flag status (if available)
      ]
    }).firstPage();  // Changed from .all() to .firstPage() for better performance
    
    console.log(`Retrieved ${records.length} records from Airtable`);
    
    return records.map((record, index) => ({
      id: record.id,
      number: index + 1,
      question: record.get('FlashcardQuestion') || '', 
      answer: record.get('FlashcardA') || '',
      subject: record.get('Source') || 'General',
      goodCount: record.get('GOODCARD') || 0,
      againCount: record.get('AGAINCARD') || 0,
      flagged: record.get('Flagged') || false
    }));
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    
    // More detailed error logging to help troubleshoot
    if (error.statusCode === 403) {
      console.error('Airtable authorization failed. Please check your API key and permissions.');
    } else if (error.statusCode === 404) {
      console.error('Airtable table or base not found. Please check your Base ID and table name.');
    } else if (error.statusCode === 422) {
      console.error('Invalid request - check view names and field names:', error.message);
    }
    
    throw error; // Re-throw to handle in the UI
  }
}

// Update flashcard status in Airtable
export async function updateFlashcardStatus(id, status) {
  try {
    const base = initAirtable();
    const table = base('FullQ');
    
    // Get current card data
    const record = await table.find(id);
    
    // Determine which field to update based on status
    if (status === 'good') {
      const currentValue = record.get('GOODCARD') || 0;
      await table.update(id, { 'GOODCARD': currentValue + 1 });
    } else if (status === 'again') {
      const currentValue = record.get('AGAINCARD') || 0;
      await table.update(id, { 'AGAINCARD': currentValue + 1 });
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating flashcard ${id} status:`, error);
    return false;
  }
}

// Toggle flag status
export async function toggleFlashcardFlag(id) {
  try {
    const base = initAirtable();
    const table = base('FullQ');
    
    // Get current flag status
    const record = await table.find(id);
    const currentFlagged = record.get('Flagged') || false;
    
    // Toggle flag status
    await table.update(id, {
      'Flagged': !currentFlagged
    });
    
    return true;
  } catch (error) {
    console.error('Error toggling flashcard flag:', error);
    return false;
  }
}