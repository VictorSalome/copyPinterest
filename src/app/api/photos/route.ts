import { getPhotos } from '@/lib/api';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1');

  try {
    const photos = await getPhotos(page, query || undefined);
    return Response.json(photos);
  } catch {
    return Response.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
} 