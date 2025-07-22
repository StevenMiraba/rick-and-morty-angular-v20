import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly API_URL = 'https://rickandmortyapi.com/api/character'; 

  private charactersSignal = signal<Character[]>([]); // Define esto como una señal<Character[]>

  private readonly http = inject(HttpClient); // Define esto como una señal de solo lectura

  public readonly characters = this.charactersSignal.asReadonly();

  getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap((response: ApiResponse) => {
  this.charactersSignal.set(response.results);
})
    );
  }

  searchCharacters(name: string): Observable<ApiResponse> {
    const trimmedName = name.trim();

    if (trimmedName === '') {
      // Si nombre vacío, devuelve todos
      return this.getCharacters();
    } else {
      const searchUrl = `${this.API_URL}?name=${encodeURIComponent(trimmedName)}`;
      return this.http.get<ApiResponse>(searchUrl).pipe(
        tap((response: ApiResponse) => {
  this.charactersSignal.set(response.results);
})
      );
    }
  }
}
