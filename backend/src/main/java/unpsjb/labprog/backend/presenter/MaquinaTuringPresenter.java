package unpsjb.labprog.backend.presenter;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.business.MaquinaTuringService;

@RestController
@RequestMapping("maquinaTuring")
public class MaquinaTuringPresenter{

    MaquinaTuringService maquinaTuringService;

}