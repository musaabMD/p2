import FlashcardClient from '../../components/FlashcardClient';
import { getFlashcards } from '../../lib/airtable';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function NotesPage() {
  // Fetch flashcards from Airtable (server-side)
  let flashcards = [];
  let error = null;
  
  try {
    flashcards = await getFlashcards();
    console.log(`Fetched ${flashcards.length} flashcards successfully`);
  } catch (err) {
    console.error('Failed to fetch flashcards:', err);
    error = err.message || 'Failed to fetch flashcards';
    // Continue with empty array - the error UI will be shown by the client component
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Flashcards</h1>
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-4xl mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error fetching flashcards</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <FlashcardClient initialCards={flashcards} />
      )}
    </div>
  );
}