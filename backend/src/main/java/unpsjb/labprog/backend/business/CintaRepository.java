package unpsjb.labprog.backend.business;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class CintaRepository {

    private static final String FILE_PATH = "./archivos/cinta.txt";

    public List<String> leerCinta() {
        try {
            return Files.readAllLines(Paths.get(FILE_PATH));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null; 
    }

}
