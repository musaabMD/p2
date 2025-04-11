import { getFlashcards } from '../../../lib/airtable';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get flashcards from Airtable
    const flashcards = await getFlashcards();
    
    if (flashcards && flashcards.length > 0) {
      return NextResponse.json({ flashcards });
    } else {
      return NextResponse.json({ 
        flashcards: [],
        message: 'No flashcards found'
      });
    }
  } catch (error) {
    console.error('Error in flashcards API:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}