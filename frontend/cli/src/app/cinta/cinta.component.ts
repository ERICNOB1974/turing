import { ChangeDetectorRef, Component, Injectable, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Constante } from '../constantes';
import { FormsModule } from '@angular/forms';
import { CintaService } from './cinta.service';
import { map } from 'rxjs';
import { TransicionesService } from '../seleccionarArchivo/transicion.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



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
  imports: [CommonModule, FormsModule, MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './cinta.html',
  styleUrls: ['./cinta.css']
})
@Injectable({
  providedIn: 'root'
})
export class CintaComponent {
  palabraActual: string | null = null;
  nuevaCinta: string[] = ['Δ', 'Δ'];
  cinta: string[] = [];
  cintaExpandida: string[] = [];
  posicionCabezal: number = 0;
  private estadoActual: string = 'q0';
  private transiciones: Transition[] = [];
  transicion: Transition | undefined;
  private intervalo: any;
  espaciosInfinitos = 3;
  maquinaCorriendo = false;
  mensajeEspaciosEliminados: string = "";
  celdaSeleccionada: number = 0;
  nuevoCaracter: string = '';
  velocidades = [
    { nombre: 'Lento', valor: Constante.LENTO },
    { nombre: 'Normal', valor: Constante.NORMAL },
    { nombre: 'Rápido', valor: Constante.RAPIDO },
    { nombre: 'Ansiedad', valor: Constante.ANSIEDAD },
    { nombre: 'Turbo ansiedad', valor: Constante.AUTOMATICO },
  ];
  velocidadActual = Constante.NORMAL;
  escribe: boolean = false;
  @ViewChild('modalInvitarAmigos') modalInvitarAmigos!: TemplateRef<any>;

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog,
    private cintaService: CintaService, private transicionService: TransicionesService) { }

  async ngOnInit() {
    try {
      await this.cargarCinta();
      this.palabraActual = this.cinta[0];
      this.cargarTransiciones();
      this.actualizarCintaExpandida();
      this.ponerCabezalEnElEspacioDeMasALaDerecha();
    } catch (error) {
      console.error('Error durante la inicialización:', error);
    }
  }


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

    return transiciones;
  }


  private cargarCinta(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cintaService
        .obtenerCinta()
        .pipe(
          map((response) => {
            if (response.status === 200 && Array.isArray(response.data)) {
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
  iniciar() {
    this.maquinaCorriendo = true;
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => this.correr(), this.velocidadActual);
  }

  private correr(): void {
    const caracterActual = this.cinta[this.posicionCabezal];

    if (!this.escribe) {
      this.transicion = this.transiciones.find(
        t => t.caracterActual === caracterActual && t.estadoActual === this.estadoActual
      );
    }
    if (!this.transicion) {
      this.palabraActual = "∞";
      console.log('No se encontró una transición válida, deteniendo la máquina.');
      this.guardarCinta();
      clearInterval(this.intervalo);
      return;
    }

    if (this.transicion.escritura !== caracterActual) {
      this.escribe = false;
      if (!this.escribe) {
        this.escribe = true;
        this.cinta[this.posicionCabezal] = this.transicion.escritura;
      }

      this.palabraActual = this.cinta[this.posicionCabezal];
      // Detener el intervalo actual y reiniciar desde 'iniciar'
      //this.iniciar(); // Llama nuevamente a iniciar
      return;
    }
    this.cinta[this.posicionCabezal] = this.transicion.escritura;

    this.estadoActual = this.transicion.siguienteEstado;
    //this.palabraActual = this.cinta[this.posicionCabezal];

    //this.cdr.detectChanges();

    if (this.transicion.movimiento === Constante.DERECHA) {
      this.posicionCabezal++;
    } else if (this.transicion.movimiento === Constante.IZQUIERDA) {
      this.posicionCabezal--;
    } else if (this.transicion.movimiento === Constante.QUIETO) {
      this.maquinaCorriendo = false;
      this.guardarCinta();
      this.detenerMaquina();
      clearInterval(this.intervalo);
      return;
    }


    this.verificarBordes();
    this.palabraActual = this.cinta[this.posicionCabezal];
    if (this.escribe) {
      this.escribe = false;

    }
  }

  private guardarCinta(): void {
    this.cintaService.escribirCinta(this.cinta).subscribe();
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
        this.posicionCabezal = 0;
        this.estadoActual = 'q0';
        this.cargarCinta().then(() => {
          this.actualizarCintaExpandida();
        });
      },
      error: (err) => {
        console.error('Error al reiniciar la cinta:', err);
      },
    });
  }

  private ponerCabezalEnElEspacioDeMasALaDerecha(): void {
    let cont = 0;
    for (let i=0;i<this.cinta.length;i++){
      if (this.cinta[i] === "Δ"){
        cont++;
      }
    }
    if (cont == this.cinta.length){
      this.posicionCabezal = 0;
      return; 
    }
    for (let i=0;i<this.cinta.length;i++){
      if (this.cinta[i] === "Δ"){
        this.posicionCabezal = i;
      } else {
        return;
      }
    }
  }




}