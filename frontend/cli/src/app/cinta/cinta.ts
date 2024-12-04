/* 
private correr(): void {
    const caracterActual = this.cinta[this.posicionCabezal];
    console.log("FACU");

    if (!this.escribe) {
      this.transicion = this.transiciones.find(
        t => t.caracterActual === caracterActual && t.estadoActual === this.estadoActual
      );
      console.log("LUCAS");
    }
    if (!this.transicion) {
      this.palabraActual = "∞";
      console.log('No se encontró una transición válida, deteniendo la máquina.');
      this.guardarCinta();
      clearInterval(this.intervalo);
      return;
    }

    if (this.transicion.caracterActual != this.transicion.escritura && !this.escribe) {
      this.escribe = true;
      console.log("aca andamos");
      this.cinta[this.posicionCabezal] = this.transicion.escritura;
      clearInterval(this.intervalo);
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
      console.log('Cinta detenida.');
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
      console.log("ERIC");

    }
  }


quiero que cada vez que lo corra se fije lo siguiente: Si escribe lo mismo que estaba en esa posicion, que siga el curso normal.
Si escribe algo distinto a lo que estaba que termine esa corrida digamos, y que resetee el intervalo para que vuelva a dormir */