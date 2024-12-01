package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import unpsjb.labprog.backend.business.TransicionService;
import unpsjb.labprog.backend.Response;

@RestController
@RequestMapping("transiciones")
public class TransicionPresenter {

    @Autowired
    private TransicionService transicionService;

    /**
     * Método para obtener las transiciones
     * @return Las transiciones leídas del archivo
     */
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> leerTransiciones() {
        return Response.ok(transicionService.leerTransiciones());
    }

    /**
     * Método para actualizar la ruta del archivo de transiciones
     * @param rutaArchivo La nueva ruta del archivo
     * @return Mensaje de éxito
     */
    @RequestMapping(value = "/setRuta", method = RequestMethod.POST)
    public ResponseEntity<Object> setRutaArchivo(@RequestBody String rutaArchivo) {
        transicionService.actualizarRutaArchivo(rutaArchivo);
        return Response.ok("Ruta del archivo actualizada con éxito");
    }

    /**
 * Método para obtener la lista de archivos disponibles
 * @return Lista de nombres de archivos en la carpeta configurada
 */
@RequestMapping(value = "/archivos", method = RequestMethod.GET)
public ResponseEntity<Object> obtenerArchivosCargados() {
    return Response.ok(transicionService.obtenerArchivosCargados());
}

/**
 * Método para obtener el contenido de un archivo específico
 * @param nombreArchivo Nombre del archivo solicitado
 * @return Contenido del archivo como texto
 */
@RequestMapping(value = "/contenido/{nombreArchivo}", method = RequestMethod.GET)
public ResponseEntity<Object> obtenerContenidoArchivo(@PathVariable String nombreArchivo) {
    return Response.ok(transicionService.leerTransicionesDeArchivo(nombreArchivo));
}

   /**
     * Método para subir un archivo
     * @param file El archivo que se desea cargar
     * @return Mensaje de éxito
     */
    @PostMapping("/subir-archivo")
    public ResponseEntity<Object> subirArchivo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No se ha seleccionado ningún archivo");
        }

        try {
            // Lógica para guardar el archivo, por ejemplo en el sistema de archivos o base de datos
            transicionService.guardarArchivo(file);
            return Response.ok("Archivo subido con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al subir el archivo: " + e.getMessage());
        }
    }
}
