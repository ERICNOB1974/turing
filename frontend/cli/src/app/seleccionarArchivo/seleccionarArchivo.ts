import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngFor
import { Router } from '@angular/router';

@Component({
    selector: 'app-csv-uploader',
    standalone: true, // Componente independiente
    imports: [CommonModule], // Asegúrate de incluir CommonModule
    template: `
    <div class="csv-uploader">
      <h1>Selecciona un archivo CSV</h1>
      <input 
        type="file" 
        accept=".csv" 
        (change)="onFileSelected($event)" 
        required
      />
      <p *ngIf="fileName">Archivo seleccionado: {{ fileName }}</p>

      <button *ngIf="showVisualizeButton" (click)="visualizeFile()">Visualizar</button>
            <button *ngIf="showVisualizeButton" (click)="useFile()">Usar archivo</button>

<div *ngIf="fileMatrix.length">
  <h2>Matriz del archivo</h2>
  <div class="scrollable-table">
    <table>
      <thead>
        <tr>
          <th># Caracter Actual</th>
          <th>Estado Inicial</th>
          <th>Movimiento Cabezal</th>
          <th>Escritura</th>
          <th>Siguiente Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of fileMatrix">
          <td>{{ row.caracter }}</td>
          <td>{{ row.estadoInicial }}</td>
          <td>{{ row.movimientoCabezal }}</td>
          <td>{{ row.escritura }}</td>
          <td>{{ row.siguienteEstado }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
    </div>
  `,
    styleUrls: ['./seleccionarArchivo.css']
})
export class CsvUploaderComponent {
    selectedFile: File | null = null;
    fileName: string = '';
    showVisualizeButton = false;
    fileMatrix: Array<{
        caracter: string;
        estadoInicial: string;
        movimientoCabezal: string;
        escritura: string;
        siguienteEstado: string
    }> = [];

    constructor(private router: Router) {}

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
            this.selectedFile = input.files[0];
            this.fileName = this.selectedFile.name;
            this.showVisualizeButton = true;

            if (!this.fileName.endsWith('.csv')) {
                alert('Por favor, selecciona un archivo con extensión .csv');
                this.resetSelection();
            }
        }
    }

    visualizeFile(): void {
        if (this.selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                this.parseCsvToMatrix(content);
            };
            reader.onerror = () => {
                alert('Ocurrió un error al leer el archivo.');
            };
            reader.readAsText(this.selectedFile);
        }
    }

    private parseCsvToMatrix(content: string): void {
        const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
        this.fileMatrix = lines.map(line => {
            const [caracter, estadoInicial, movimientoCabezal, escritura, siguienteEstado] = line.split(',');
            return { caracter, estadoInicial, movimientoCabezal, escritura, siguienteEstado };
        });
    }

    private resetSelection(): void {
        this.selectedFile = null;
        this.fileName = '';
        this.showVisualizeButton = false;
        this.fileMatrix = [];
    }

    useFile(): void {
        // Navega a la ruta '/cinta'
        this.router.navigate(['/cinta']);
      }
}