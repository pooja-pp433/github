import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Client },
  { path: 'bus-list', renderMode: RenderMode.Client },
  { path: 'book-ticket', renderMode: RenderMode.Client },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'register', renderMode: RenderMode.Client },
  { path: 'my-bookings', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender }
];