package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.CintaService;

@RestController
@RequestMapping("cinta")
public class CintaPresenter {

    @Autowired
    CintaService cintaService;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> leerCinta() {
        return Response.ok(cintaService.leerCinta());
    }

    @RequestMapping(value = "/escribir", method = RequestMethod.POST)
    public ResponseEntity<Object> escribirCinta(@RequestBody List<String> cinta) {
        cintaService.escribirCinta(cinta);
        return Response.ok("Archivo sobrescrito con exito");
    }

    @RequestMapping(value = "/borrar", method = RequestMethod.POST)
    public ResponseEntity<Object> borrarCinta(@RequestBody List<String> cinta) {
        cintaService.borrarCinta(cinta);
        return Response.ok("Archivo borrado con exito");
    }

}