import { updateFlashcardStatus } from '../../../lib/airtable';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, status } = await request.json();
    
    // Validate required fields
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id and status' },
        { status: 400 }
      );
    }
    
    let result;
    
    // For now, handle flag status client-side only
    if (status === 'flag') {
      // Just return success since we're handling flags client-side
      result = true;
    } else {
      // Handle good/again status in Airtable
      result = await updateFlashcardStatus(id, status);
    }
    
    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update card status' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating card:', error);
    
    // Provide more specific error messages based on error type
    if (error.statusCode === 403) {
      return NextResponse.json(
        { error: 'Authorization error: Please check your Airtable API key and permissions' },
        { status: 403 }
      );
    } else if (error.statusCode === 404) {
      return NextResponse.json(
        { error: 'Record not found: The card ID may be invalid or the table structure may have changed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}