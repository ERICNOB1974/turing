package unpsjb.labprog.backend.presenter;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.business.CintaService;

@RestController
@RequestMapping("cinta")
public class CintaPresenter{

    CintaService cintaService;

    // @RequestMapping(method = RequestMethod.GET)
    // public ResponseEntity<Object> findAll(){
    //     return Response.ok(cintaService.findAll());
    // }

}