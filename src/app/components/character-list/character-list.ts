import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Character } from '../../models/character';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {
  // Inyectar el servicio Api
  private api = inject(Api);

  // Conectar señal pública de personajes
  public characters = this.api.characters;

  // Estado UI
  public searchTerm: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';

  // Señal computada que indica si hay personajes
  public hasCharacters = computed(() => this.characters().length > 0);

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getCharacters()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          // No es necesario actualizar characters aquí,
          // porque el servicio ya actualiza la señal con tap()
        },
        error: (error) => {
          this.errorMessage = 'Error cargando personajes. Intenta de nuevo.';
          console.error('Error en getCharacters:', error);
        }
      });
  }

  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.searchCharacters(this.searchTerm)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          // La señal characters ya se actualiza en el servicio
        },
        error: (error) => {
          this.errorMessage = 'Error en la búsqueda. Intenta con otro término.';
          console.error('Error en searchCharacters:', error);
        }
      });
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}