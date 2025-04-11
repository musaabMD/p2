// app/api/questions/[id]/route.js
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Initialize Airtable with server-side environment variables
    const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
    const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    
    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'Airtable configuration missing' }, 
        { status: 500 }
      );
    }
    
    const base = new Airtable({ apiKey }).base(baseId);
    
    // Prepare fields to update - make sure to match exact field names in Airtable
    const fieldsToUpdate = {};
    
    // Handle correct/incorrect counters
    if (data.correct !== undefined) {
      fieldsToUpdate.Correct = data.correct;
    }
    
    if (data.incorrect !== undefined) {
      fieldsToUpdate.inCorrect = data.incorrect;
    }
    
    // Handle flagged/pinned status
    if (data.flagged !== undefined) {
      fieldsToUpdate.Flagged = data.flagged;
    }
    
    console.log(`Updating question ${id} with fields:`, fieldsToUpdate);
    
    // Update record in Airtable - using the correct format for Airtable API
    const updatedRecord = await base('FullQ').update(id, fieldsToUpdate);
    
    console.log('Successfully updated record:', updatedRecord.id);
    
    // Transform the record to the format we need
    const question = {
      id: updatedRecord.id,
      flagged: updatedRecord.get('Flagged') || false,
      correct: updatedRecord.get('Correct') || 0,
      incorrect: updatedRecord.get('inCorrect') || 0,
    };
    
    // Return the updated question data
    return NextResponse.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update question in Airtable', 
        details: error.message,
        stack: error.stack
      }, 
      { status: 500 }
    );
  }
}