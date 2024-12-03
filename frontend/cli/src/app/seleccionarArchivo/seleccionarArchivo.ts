import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransicionesService } from './transicion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-csv-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="csv-uploader">
  <h1>Sube tu archivo CSV</h1>

  <!-- Sección para subir un nuevo archivo -->
  <div class="file-upload">
    <input 
      #fileInput 
      type="file" 
      accept=".csv" 
      (change)="onFileSelected($event)" 
      required 
    />
    <label for="fileInput">Seleccionar archivo</label>
  </div>

  <!-- Mostrar el archivo actualmente seleccionado -->
  <p *ngIf="fileName" class="selected-file">📄 Archivo seleccionado: <strong>{{ fileName }}</strong></p>

  <!-- Botones para visualizar o usar el archivo seleccionado -->
  <div *ngIf="fileName || archivoSeleccionado" class="action-buttons">
    <button (click)="useFile()">📂 Usar archivo</button>
  </div>

  <!-- Sección para mostrar archivos disponibles -->
  <div *ngIf="archivosDisponibles.length" class="available-files">
    <h2>Archivos disponibles</h2>
    <ul>
      <li *ngFor="let archivo of archivosDisponibles">
        <span>{{ archivo }}</span>
        <button (click)="seleccionarArchivoExistente(archivo, fileInput)">Seleccionar</button>
      </li>
    </ul>
  </div>

  <!-- Mostrar matriz del archivo -->
  <div *ngIf="fileMatrix.length" class="file-matrix">
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
  styleUrls: ['./seleccionarArchivo.css'],
})
export class CsvUploaderComponent implements OnInit {
  selectedFile: File | null = null;
  showVisualizeButton = false;
  fileMatrix: Array<{
    caracter: string;
    estadoInicial: string;
    movimientoCabezal: string;
    escritura: string;
    siguienteEstado: string;
  }> = [];
  fileContent: string = '';
  fileName: string = '';
 archivoSeleccionado: string = '';

  archivosDisponibles: string[] = [];

  constructor(private router: Router, private transicionesService: TransicionesService) { }

  ngOnInit(): void {
    this.cargarArchivosDisponibles();
  }

  /**
   * Maneja el archivo seleccionado por el usuario (cuando está bien separado)
   * @param event Evento del input de archivo
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.resetSelection();
      this.selectedFile = input.files[0];
      this.archivoSeleccionado = this.selectedFile.name;


      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        this.parseCsvToMatrix(content); // Procesamos el archivo bien separado
      };
      reader.onerror = () => {
        alert('Ocurrió un error al leer el archivo.');
      };
      reader.readAsText(this.selectedFile);
    }
  }

  /**
   * Procesa el archivo CSV cuando el usuario sube un archivo bien separado
   * @param content Contenido del archivo CSV
   */
  private parseCsvToMatrix(content: string): void {
    const lines = content.split('\n').filter(line => line.trim());
    this.fileMatrix = lines.map(line => {
      const [caracter, estadoInicial, movimientoCabezal, escritura, siguienteEstado] = line.split(',');
      return { caracter, estadoInicial, movimientoCabezal, escritura, siguienteEstado };
    });
  }

  /**
   * Muestra el contenido del archivo CSV subido
   */
  visualizeFile(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        this.parseCsvToMatrix(content); // Procesa el archivo bien separado
      };
      reader.onerror = () => {
        alert('Ocurrió un error al leer el archivo.');
      };
      reader.readAsText(this.selectedFile);
    } else {
      alert('Por favor, selecciona un archivo primero.');
    }
  }

  /**
   * Resetea la selección de archivo
   */
  private resetSelection(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.archivoSeleccionado = '';
    this.showVisualizeButton = false;
    this.fileMatrix = [];
  }

  /**
   * Usa el archivo seleccionado
   */
  useFile(): void {
    if (this.fileName) {
      console.log("ENTRE ACA");
      this.transicionesService.actualizarRutaArchivo(this.fileName).subscribe({
        next: () => {
          alert(`Archivo "${this.fileName}" seleccionado exitosamente.`);
          this.router.navigate(['/cinta']);
        },
        error: (err) => {
          console.error('Error al seleccionar el archivo:', err);
          alert('Ocurrió un error al intentar usar el archivo.');
        },
      });
    } else if (this.selectedFile) {
      console.log("ENTRE ACA BIEN");

    if (this.archivosDisponibles.includes(this.archivoSeleccionado)) {
      alert(`El archivo "${this.archivoSeleccionado}" ya ha sido cargado anteriormente.`);
    }else{
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.archivoSeleccionado);

      // Si el archivo no está duplicado, lo subimos al backend
      this.transicionesService.subirArchivo(formData).subscribe({
        next: () => {
          // Después de subir el archivo, actualizamos la ruta
          this.transicionesService.actualizarRutaArchivo(this.archivoSeleccionado).subscribe({
            next: () => {
              alert(`Archivo "${this.archivoSeleccionado}" seleccionado y subido exitosamente.`);
              this.router.navigate(['/cinta']);
            },
            error: (err) => {
              console.error('Error al seleccionar el archivo:', err);
              alert('Ocurrió un error al intentar usar el archivo.');
            },
          });
        },
        error: (err) => {
          console.error('Error al subir el archivo:', err);
          alert('Ocurrió un error al intentar subir el archivo.');
        },
      });
    }
    } else {
      alert('Por favor, selecciona un archivo primero.');
    }
  }

  /**
   * Carga los archivos disponibles desde el backend
   */
  private cargarArchivosDisponibles(): void {
    this.transicionesService.obtenerArchivosCargados().subscribe({
      next: (archivos) => {
        this.archivosDisponibles = archivos.data as string[];
      },
      error: (err) => {
        console.error('Error al obtener los archivos disponibles:', err);
      },
    });
  }

  /**
   * Selecciona un archivo existente del backend
   * @param nombreArchivo Nombre del archivo a seleccionar
   */
  seleccionarArchivoExistente(nombreArchivo: string, fileInput: HTMLInputElement): void {
    this.transicionesService.obtenerContenidoArchivo(nombreArchivo).subscribe({
      next: (contenido) => {
        if (Array.isArray(contenido.data)) {
          const fileContent = contenido.data.join('\n');
          this.fileName = nombreArchivo;
          this.procesarArchivoCSV(fileContent);
          
          // Limpiar el input de archivo
          fileInput.value = '';  // Esto borra el archivo seleccionado
        } else {
          console.error('El contenido no tiene el formato esperado:', contenido.data);
          alert('El archivo seleccionado tiene un formato no válido.');
        }
      },
      error: (err) => {
        console.error('Error al obtener el contenido del archivo:', err);
        alert('Ocurrió un error al intentar cargar el archivo.');
      },
    });
  }
  /**
   * Procesa el contenido del archivo CSV cuando es traído del backend (necesita ser separado)
   * @param content Contenido del archivo CSV
   */
  private procesarArchivoCSV(content: string): void {
    const lines = content.split('\n').filter(line => line.trim() );
    this.fileMatrix = [];

    for (let i = 0; i < lines.length; i += 5) {
      const [caracterActual, estadoActual, movimiento, escritura, siguienteEstado] = lines.slice(i, i + 5);
      
      // Agregar la transición a la matriz con los 5 elementos
      this.fileMatrix.push({
        caracter: caracterActual,
        estadoInicial: estadoActual,
        movimientoCabezal: movimiento as 'L' | 'R' | 'Q',
        escritura,
        siguienteEstado
      });
    }
  }

}
