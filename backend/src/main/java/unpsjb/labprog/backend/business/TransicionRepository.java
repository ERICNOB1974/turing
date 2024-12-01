package unpsjb.labprog.backend.business;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import org.springframework.stereotype.Repository;

@Repository
public class TransicionRepository {

    public List<String> leerTransiciones(String filePath) {
        List<String> transiciones = new ArrayList<>();
        try {
            Path path = Paths.get(filePath);
            List<String> lineas = Files.readAllLines(path, StandardCharsets.UTF_8);
            for (String linea : lineas) {
                linea = linea.trim();
                if (linea.isEmpty() || (linea.startsWith("#") && !linea.startsWith("#,"))) {
                    continue;
                }
                transiciones.addAll(Arrays.asList(linea.split(",")));
            }
        } catch (IOException e) {
            System.err.println("Error al leer el archivo: " + e.getMessage());
            e.printStackTrace();
        }
        return transiciones;
    }

}
