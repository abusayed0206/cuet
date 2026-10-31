import type { APIRoute } from 'astro';
import { apiError, preflight } from '../../lib/api';

export const GET: APIRoute = () => apiError(404, 'not_found', 'Unknown endpoint. See https://cuet.sayed.app/api for the list.');
export const OPTIONS: APIRoute = () => preflight();
