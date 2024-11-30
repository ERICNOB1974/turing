package unpsjb.labprog.backend.business;

import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import org.springframework.stereotype.Repository;

@Repository
public class CintaRepository {

    private static final String FILE_PATH = "src/main/resources/cinta/cinta.csv";

    public List<String> leerCinta() {
        try {
            Path path = Paths.get(FILE_PATH); 
            String contenido = Files.readString(path, StandardCharsets.UTF_8).trim();
            return Arrays.asList(contenido.split(","));
        } catch (Exception e) {
            System.err.println("Error al leer el archivo: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public void escribirCinta(List<String> cinta) {
        try {
            Path path = Paths.get(FILE_PATH); 
            String contenido = String.join(",", cinta);
            
            Files.writeString(path, contenido, StandardCharsets.UTF_8, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("Archivo sobrescrito con éxito: " + contenido);
        } catch (Exception e) {
            System.err.println("Error al escribir en el archivo: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
