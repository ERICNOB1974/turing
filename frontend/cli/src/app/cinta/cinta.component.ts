import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { Constante } from '../constantes';
import { FormsModule } from '@angular/forms';
import { CintaService } from './cinta.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { TransicionesService } from '../seleccionarArchivo/transicion.service';

type Transition = {
  caracterActual: string;
  estadoActual: string;
  movimiento: 'L' | 'R' | 'Q';
  escritura: string;
  siguienteEstado: string;
};

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cinta.html' ,
  styleUrls: ['./cinta.css']
})
@Injectable({
  providedIn: 'root'
})
export class CintaComponent {
  palabraActual: string | null = null;
  cinta: string[] = [];
  cintaExpandida: string[] = [];
  posicionCabezal: number = 0;
  private estadoActual: string = 'q0';
  private transiciones: Transition[] = [];
  private intervalo: any;
  espaciosInfinitos = 3;
  maquinaCorriendo = false;
  mensajeEspaciosEliminados: string = "";
  velocidades = [
    { nombre: 'Lento', valor: Constante.LENTO },
    { nombre: 'Normal', valor: Constante.NORMAL },
    { nombre: 'Rápido', valor: Constante.RAPIDO },
    { nombre: 'Ansiedad', valor: Constante.ANSIEDAD },
    { nombre: 'Turbo ansiedad', valor: Constante.AUTOMATICO },
  ];
  velocidadActual = Constante.NORMAL;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private cintaService: CintaService, private transicionService : TransicionesService  ) { }

  async ngOnInit() {
    try {
      await this.cargarCinta();
      this.palabraActual = this.cinta[0];
      this.cargarTransiciones(); 
      this.actualizarCintaExpandida();
    } catch (error) {
      console.error('Error durante la inicialización:', error);
    }
  }
/* 
  async ngOnInit() {
    try {
      // Verifica si hay contenido del archivo pasado desde CsvUploaderComponent
      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras.state as { fileContent?: string };
  
      if (state?.fileContent) {
        this.cargarTransicionesDesdeContenido(state.fileContent);
      } else {
        // Si no hay contenido, usa el archivo definido en Constante
        this.cargarTransiciones(Constante.archivo);
      }
  
      await this.cargarCinta();
      this.palabraActual = this.cinta[0];
      this.actualizarCintaExpandida();
    } catch (error) {
      console.error('Error durante la inicialización:', error);
    }
  } */

  private actualizarCintaExpandida(): void {
    this.cintaExpandida = [
      ...Array(this.espaciosInfinitos).fill('Δ'),
      ...this.cinta,
      ...Array(this.espaciosInfinitos).fill('Δ')
    ];
  }
  private cargarTransiciones(): void {
    this.transicionService.obtenerTransiciones().subscribe({
        next: (response) => {
            if (response.status === 200 && response.data) {
              const rawData = response.data as string[];
              this.transiciones = this.procesarTransiciones(rawData);
            } else {
                console.error('Respuesta inesperada del backend:', response);
            }
        },
        error: (err) => console.error('Error cargando transiciones desde el backend:', err)
    });
}

/**
 * Método para procesar las transiciones recibidas del backend
 */
private procesarTransiciones(rawData: string[]): any[] {
  const transiciones = [];
  const dataLimpia = rawData.flatMap(item => item.split('\n')); // Divide las cadenas con '\n' en líneas separadas

  for (let i = 0; i < dataLimpia.length; i += 5) {
    const caracterActual = dataLimpia[i];
    const estadoActual = dataLimpia[i + 1];
    const movimiento = dataLimpia[i + 2] as 'L' | 'R' | 'Q';
    const escritura = dataLimpia[i + 3];
    const siguienteEstado = dataLimpia[i + 4];

    transiciones.push({
      caracterActual,
      estadoActual,
      movimiento,
      escritura,
      siguienteEstado
    });
  }

  console.info("Transiciones procesadas:", transiciones);
  return transiciones;
}


  private cargarCinta(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cintaService
        .obtenerCinta()
        .pipe(
          map((response) => {
            if (response.status === 200 && Array.isArray(response.data)) {
              console.info(response.data);
              return response.data as string[];
            } else {
              throw new Error('Formato de datos inválido');
            }
          })
        )
        .subscribe({
          next: (data) => {
            this.cinta = data;
            this.verificarBordes();
            resolve();
          },
          error: (err) => {
            console.error('Error cargando la cinta desde el servicio:', err);
            reject(err);
          },
        });
    });
  }

  iniciar() {
    this.maquinaCorriendo = true;
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => this.correr(), this.velocidadActual);
  }

  cambiarVelocidad() {
    if (this.maquinaCorriendo) {
      clearInterval(this.intervalo);
      this.intervalo = setInterval(() => this.correr(), this.velocidadActual);
    }
  }  

  private detenerMaquina(): void {
    clearInterval(this.intervalo);
    this.maquinaCorriendo = false;
    this.guardarCinta();
    this.estadoActual = 'q0';
  }

  private correr(): void {
    const caracterActual = this.cinta[this.posicionCabezal];
  
    const transicion = this.transiciones.find(
      t => t.caracterActual === caracterActual && t.estadoActual === this.estadoActual
    );

    if (!transicion) {
      this.palabraActual = "∞";
      console.log('No se encontró una transición válida, deteniendo la máquina.');
      this.guardarCinta();
      clearInterval(this.intervalo);
      return;
    }
  
    this.cinta[this.posicionCabezal] = transicion.escritura;
    this.estadoActual = transicion.siguienteEstado;
    this.palabraActual = this.cinta[this.posicionCabezal];
  
    //this.cdr.detectChanges();

    if (transicion.movimiento === Constante.DERECHA) {
      this.posicionCabezal++;
    } else if (transicion.movimiento === Constante.IZQUIERDA) {
      this.posicionCabezal--;
    } else if (transicion.movimiento === Constante.QUIETO) {
      console.log('Cinta detenida.');
      clearInterval(this.intervalo);
      this.maquinaCorriendo = false;
      this.guardarCinta();
      this.detenerMaquina();
      return;
    }
  
    if (this.posicionCabezal < 0) {
      clearInterval(this.intervalo);
      return;
    } else if (this.posicionCabezal > this.cinta.length) {
      this.cinta.push('Δ');
    }
  
    this.palabraActual = this.cinta[this.posicionCabezal];


    this.verificarBordes();
  }
  
  private guardarCinta(): void {
    this.cintaService.escribirCinta(this.cinta).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.log('Cinta guardada con éxito en el backend:', response.message);
        } else {
          console.error('Error al guardar la cinta:', response.message);
        }
      },
      error: (err) => console.error('Error en la solicitud al backend:', err)
    });
  }  

  private verificarBordes(): void {

    if (this.posicionCabezal < 0) {
      this.cinta.unshift('Δ');
      this.posicionCabezal = 0;
    }

    if (this.posicionCabezal >= this.cinta.length) {
      this.cinta.push('Δ');
    }

    if (this.cinta[0] !== 'Δ') {
      this.cinta.unshift('Δ');
    }
    if (this.cinta[this.cinta.length - 1] !== 'Δ') {
      this.cinta.push('Δ');
    }
  }

  paso() {
    if (!this.maquinaCorriendo) {
      this.correr();
    }
  }

  detenerMaquinaBoton(): void {
    clearInterval(this.intervalo);
    this.maquinaCorriendo = false;
  }
  
  reiniciarCinta(): void {
    this.cintaService.borrarCinta(this.cinta).subscribe({
      next: () => {
        this.cargarCinta().then(() => {
          this.actualizarCintaExpandida();
          this.posicionCabezal = 0;
          this.estadoActual = 'q0';
        });
      },
      error: (err) => {
        console.error('Error al reiniciar la cinta:', err);
      },
    });
  }
}