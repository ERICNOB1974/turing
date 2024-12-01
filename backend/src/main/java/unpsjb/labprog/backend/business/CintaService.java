package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CintaService {

    @Autowired
    CintaRepository cintaRepository;

    public List<String> leerCinta() {
        return cintaRepository.leerCinta();
    }

    public void escribirCinta(List<String> cinta) {
        cintaRepository.escribirCinta(cinta);
    }
    public void borrarCinta(List<String> cinta) {
        cintaRepository.borrarCinta(cinta);
    }

}
