### GUÍA DE INSTALACIÓN - MÁQUINA DE TURING

## FACUNDO ESPAÑOL, ERIC ANDERSON Y LUCAS SAN MARTIN
## UNPSJB

# Guia de instalación
# Requisitos previos 

El proyecto requiere que el sistema tenga instalado docker y docker compose previamente. Ver apéndice para configurarlo correctamente.

## 1. Descarga e inicio del proyecto
Descarga el proyecto y abre una consola en tu sistema operativo. Navega hasta la carpeta donde se encuentra el proyecto (la carpeta se llama turing, dentro de la misma hay otra que también se llama turing, en esta última se debe ingresar) y ejecuta el comando chmod +x lpl y luego ./lpl up. Este comando descarga todo lo necesario para Docker y la arquitectura web del proyecto. El proceso puede tardar algunos minutos.

## 2. Verificar el estado de los contenedores
Una vez finalizado el paso anterior, verifica que los contenedores del backend y frontend se hayan iniciado correctamente ejecutando los comandos ./lpl log frontend para el frontend y ./lpl log backend para el backend. Si los logs del frontend muestran un error relacionado con Angular, sigue el siguiente procedimiento.

## 3. Solución de errores relacionados con Angular
Primero, baja los contenedores ejecutando ./lpl down. Luego, abre el archivo docker-compose.yml, que se encuentra dentro de la carpeta del proyecto. Localiza la configuración del contenedor de frontend, identificada por la línea que comienza con frontend:, y realiza las siguientes modificaciones: comenta la línea command: ng serve --host=0.0.0.0 --port=3200 (añadiendo un # al inicio de la línea) y agrega debajo la línea command: sh.
A continuación, levanta los contenedores con el comando ./lpl up. Una vez que los contenedores estén activos, accede al contenedor del frontend ejecutando ./lpl sh frontend y, dentro del contenedor, instala las dependencias de Angular y TypeScript con el comando npm i. Cuando finalice la instalación, escribe exit para salir del contenedor.
Luego, baja nuevamente los contenedores con ./lpl down. Vuelve al archivo docker-compose.yml y dejalo tal cual estaba, eliminando la línea command: sh y descomentando la línea command: ng serve --host=0.0.0.0 --port=3200. Finalmente, levanta los contenedores nuevamente ejecutando ./lpl up. Esto debería resolver los errores relacionados con Angular.

## 4. Acceso a la aplicación web
Una vez que el proyecto esté instalado correctamente, abre cualquier navegador web y escribe en la barra de direcciones http://localhost:3200. Esto te llevará a la página principal del proyecto, donde podrás empezar a utilizar el programa.


### Apéndice
## Configurar docker
Para configurar correctamente docker posteriormente a la instalación, seguir los siguientes pasos:
Escribir en una terminal lo siguiente:
sudo groupadd docker
sudo usermod -aG docker $USER
Para hacer efectivos los cambios en los grupos, reiniciar la terminal o ejecutar
newgrp docker
Opcional: Para que docker no arranque de forma automática al inicio ejecutar:
sudo systemctl disable docker.service
sudo systemctl disable containerd.service
Crear el archivo /etc/docker/daemon.json con el siguiente contenido:
{
  "userns-remap": "TU_NOMBRE_DE_USUARIO"
}
Editar los archivos /etc/subuid y /etc/subgid. Agregar la línea:
TU_NOMBRE_DE_USUARIO:1000:65536
Iniciar servicio docker escribiendo:
sudo systemctl start docker
Este comando puede variar según la distro de linux utilizada.



### MANUAL DE USUARIO - MÁQUINA DE TURING

## Introducción al programa
Este programa realizado en una arquitectura web está diseñado para ejecutar y trabajar con Máquinas de Turing, permitiendo a los usuarios cargar máquinas en formato CSV para posteriormente ejecutarlas. Además, permite personalizar la cinta inicial, ajustar la velocidad de ejecución (incluso una vez iniciada), ejecutar paso a paso, y detener el proceso en cualquier momento. 
	El programa ya viene con tres máquinas de turing precargadas: Fibonacci, antecesor y sucesor binario.
# Método de uso
La pantalla inicial presenta las máquinas de Turing precargadas para seleccionar. Al seleccionar una, se genera una tabla que muestra una vista previa del archivo CSV, permitiendo visualizar todos los estados y transiciones definidos en el mismo. Además, existe un botón para cargar un archivo CSV personalizado, creado por el usuario.

Una vez seleccionada y/o cargada una máquina, se muestra su vista previa junto con un botón de "Usar archivo", que al presionarlo redirige a la siguiente pantalla. En esta nueva pantalla, se visualiza la cinta de la máquina de Turing junto con los siguientes botones y funcionalidades:
1. Iniciar: Al presionar este botón, la máquina comienza a ejecutarse sobre la cinta inicial cargada. Antes o durante la ejecución, es posible ajustar la velocidad entre cinco opciones: Lento, Normal, Rápido, Ansiedad y Turbo Ansiedad. Estas velocidades van de menor a mayor, siendo "Turbo Ansiedad".
2. Paso: Este botón permite ejecutar la máquina paso a paso. Cada vez que se presiona, se ejecuta una transición que puede incluir un movimiento del cabezal o una escritura en la cinta. La velocidad seleccionada no afecta en este caso.
3. Detener: Este botón está desactivado por defecto y se habilita al iniciar la máquina. Permite detener la ejecución en cualquier momento, dejando el cabezal y las instrucciones en el estado actual. Una vez detenido, es posible reanudar la ejecución o continuar paso a paso desde el punto en que se detuvo.
4. Borrar cinta: Este botón, cuando está habilitado, borra todo el contenido de la cinta y la deja con solo dos celdas vacías.
5. Configurar cinta: Al presionar este botón, se despliega un apartado debajo de la cinta que permite configurarla. Este apartado incluye:
Dos flechas para desplazarse a lo largo de la cinta cargada y posicionar el cabezal.
Un campo de texto donde se puede ingresar un valor. Al presionar el botón de Modificar, se escribe dicho valor en la celda actual del cabezal. Al presionar la tecla enter, también se escribirá el contenido deseado en la celda, y te llevará a la siguiente celda automáticamente, agilizando la carga de la cinta. Si el campo se deja vacío, se escribirá un vacío, representado con la letra delta.
Botones para añadir o eliminar celdas en la cinta.
Un botón para cerrar la configuración.
6. Volver: Este botón redirige a la pantalla inicial, permitiendo seleccionar otra máquina de Turing.

# Crear CSV de máquina de Turing
Para crear un archivo CSV personalizado, es necesario seguir el siguiente formato en cada línea:
Carácter actual, Estado inicial, Movimiento del cabezal, Escritura, Siguiente estado
Es importante respetar este orden y comenzar siempre con el estado q0.
Luego de cada coma no se debe dejar un espacio, así como no se debe dejar un espacio al final de la línea.
Ejemplo de línea válida: “a,q0,R,b,q1”.
Movimientos del cabezal válidos:
1. R: Mover el cabezal hacia la derecha (Right).
2. L: Mover el cabezal hacia la izquierda (Left).
3. Q: Mantener el cabezal quieto (Quiet). Este movimiento se utiliza para finalizar la ejecución de la máquina en una posición específica.
Si se quieren colocar comentarios en este archivo, la línea debe empezar con un numeral (#) y no debe seguir con una coma. Ejemplos:
Un comentario válido es “#comentario”. 
Un comentario invalido es “#,hola”.

# Máquina de Turing precargada: Fibonacci en números binarios.
Una de las máquinas de Turing precargadas es la que genera la sucesión de Fibonacci en formato binario. Esta máquina comienza con una cinta vacía representada como "ΔΔ". En su primera ejecución, carga los dos primeros números de la sucesión, separados por caracteres numerales (#), quedando la cinta en el siguiente estado: "Δ#0#1#Δ".
A partir de este punto, la máquina sigue un proceso iterativo para calcular los números siguientes de esta sucesión:
Copiar valores:
Copia el último número en la derecha de la cinta y el anteúltimo en la izquierda.
Verificar condición inicial:
Si el número de la izquierda es 0, la máquina arregla la cinta y finaliza la ejecución para prepararse para la próxima ejecución.
Si el número de la izquierda no es 0, continúa al siguiente paso.
Resta y suma binaria:
Resta 1 al número de la izquierda.
Luego, se mueve hasta el número copiado a la derecha y le suma 1.
Iteración:
Repite los pasos anteriores hasta que el número de la izquierda sea 0.
Ajustar la cinta:
Limpia cualquier contenido innecesario en la cinta.
Añade los separadores faltantes (#).
Pone espacios (Δ) en lugar de los ceros que quedaron en el número copiado a la izquierda.
Finalización:
La máquina finaliza dejando el cabezal en el espacio del lado izquierdo, más cercano a la cadena, preparado para la siguiente ejecución.
Este proceso se puede repetir indefinidamente, generando siempre el próximo número de la sucesión de Fibonacci al sumar los dos últimos números en binario.
