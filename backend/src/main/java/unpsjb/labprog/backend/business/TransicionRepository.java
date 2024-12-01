package unpsjb.labprog.backend.business;

import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import org.springframework.stereotype.Repository;

@Repository
public class TransicionRepository {

    /**
     * Método para leer las transiciones de un archivo CSV
     * @param filePath Ruta del archivo a leer
     * @return Lista de transiciones leídas
     */
    public List<String> leerTransiciones(String filePath) {
        try {
            Path path = Paths.get(filePath); 
            String contenido = Files.readString(path, StandardCharsets.UTF_8).trim();
            return Arrays.asList(contenido.split(","));
        } catch (Exception e) {
            System.err.println("Error al leer el archivo: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
