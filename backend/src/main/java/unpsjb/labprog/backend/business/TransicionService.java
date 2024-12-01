package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.nio.file.Path;
import java.nio.file.Paths;
@Service
public class TransicionService {

    @Autowired
    private TransicionRepository transicionRepository;

  // Ruta base predeterminada
    private static final String RUTA_BASE = "src/main/resources/transiciones";

    // Variable para almacenar la ruta del archivo (se concatenará el nombre del archivo a esta ruta base)
    private String rutaArchivo = RUTA_BASE + "/parcial.csv"; // Ruta predeterminada con archivo

    /**
     * Método para leer las transiciones del archivo configurado
     * @return Lista de transiciones leídas desde el archivo
     */
    public List<String> leerTransiciones() {
        return transicionRepository.leerTransiciones(rutaArchivo);
    }

    /**
     * Método para actualizar la ruta del archivo de transiciones
     * @param nuevaRuta La nueva ruta del archivo de transiciones
     */
    public void actualizarRutaArchivo(String nuevaRuta) {
        this.rutaArchivo = RUTA_BASE + "/" +  nuevaRuta;
        System.out.println(this.rutaArchivo);
    }

        public List<String> obtenerArchivosCargados() {
        File carpeta = new File(RUTA_BASE);
        if (carpeta.exists() && carpeta.isDirectory()) {
            return Arrays.stream(carpeta.listFiles())
                    .filter(file -> file.isFile() && file.getName().endsWith(".csv"))
                    .map(File::getName)
                    .collect(Collectors.toList());
        }
        return List.of(); // Lista vacía si no hay archivos
    }

     public List<String> leerTransicionesDeArchivo(String nombreArchivo) {
        return transicionRepository.leerTransiciones(RUTA_BASE + "/" + nombreArchivo);
    }

        public void guardarArchivo(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("El archivo está vacío");
        }

        // Crear la ruta del archivo
        Path path = Paths.get(RUTA_BASE, file.getOriginalFilename());

        // Guardar el archivo en el sistema de archivos
        Files.copy(file.getInputStream(), path);
    }
}
