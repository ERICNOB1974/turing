package unpsjb.labprog.backend.presenter;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ParteMOService;
import unpsjb.labprog.backend.business.exception.NoExisteTurnoException;
import unpsjb.labprog.backend.model.ParteMO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping("partes")
public class ParteMOPresenter{

    @Autowired
    ParteMOService service;

    @RequestMapping(value ="/id/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> findById(@PathVariable("id") int id){
        ParteMO aParteMOOrNull = service.findById(id);
        return (aParteMOOrNull != null)?
            Response.ok(aParteMOOrNull):
            Response.notFound();
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> findAll(){
        return Response.ok(service.findAll());
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody ParteMO aParteMO){
            try {
                return Response.ok(
                    service.create(aParteMO), 
                    "Parte MO generado correctamente");
            } catch (NoExisteTurnoException e) {
                return Response.error(
    "Turno no disponible",
                e.getMessage());
            }
    }

    @RequestMapping(value = "/anularParte/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> anularParte(@PathVariable("id") int id){
        try {
            service.anularParte(id);
            return Response.ok("Parte " + id + " anulado con exito.");
        } catch (DataIntegrityViolationException e){
            return Response.error("Parte " + id + " no puede ser anulado",e.getMessage());
        }
    }

    @RequestMapping(value="/page", method=RequestMethod.GET)
    public ResponseEntity<Object> findByPage(
    @RequestParam(defaultValue = "0") int page, 
    @RequestParam(defaultValue = "10") int size){
        return Response.ok(service.findByPage(page, size));
    }

    @RequestMapping(value = {"/informe/{fecha}", "/informe/"}, method = RequestMethod.GET)
    public ResponseEntity<Object> informePartesPorFecha(
        @PathVariable(value = "fecha", required = false)
        @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<Date> fecha,
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "10") int size) {
        return Response.ok(service.informePartesPorFecha(fecha,page,size));
    }

    @RequestMapping(value = {"/validar/{fecha}", "/validar/"}, method = RequestMethod.GET)
    public ResponseEntity<Object> validar(@PathVariable(value = "fecha", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<Date> fecha) {
        return Response.ok(service.validar(fecha));
    } 

    @RequestMapping(value = {"/validarComoSupervisor/{fecha}/{legajoOperario}"}, method = RequestMethod.GET)
    public ResponseEntity<Object> validarComoSupervisor(@PathVariable(value = "fecha", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fecha, @PathVariable(value = "legajoOperario") String legajoOperario) {
        return Response.ok(service.validarComoSupervisor(legajoOperario, fecha),"Parte MO alterado correctamente");
    }

    @RequestMapping(value = {"/rechazarComoSupervisor/{fecha}/{legajoOperario}"}, method = RequestMethod.GET)
    public ResponseEntity<Object> rechazarComoSupervisor(@PathVariable(value = "fecha", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fecha, @PathVariable(value = "legajoOperario") String legajoOperario) {
        return Response.ok(service.rechazarComoSupervisor(legajoOperario, fecha),"Parte MO alterado correctamente");
    }

    @RequestMapping(value = {"/partesDeResumen/{fecha}/{legajoOperario}"}, method = RequestMethod.GET)
    public ResponseEntity<Object> partesDeUnResumen(@PathVariable(value = "fecha") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fecha, @PathVariable(value = "legajoOperario") String legajoOperario) {
        return Response.ok(service.partesDeUnResumen(legajoOperario,fecha));
    }

    @RequestMapping(value = {"/parteDadoProyectoYTarea/{fecha}/{legajoOperario}/{codigoProyecto}/{codigoTarea}"}, method = RequestMethod.GET)
    public ResponseEntity<Object> parteDadoOperarioFechaProyectoYTarea(@PathVariable(value = "fecha") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fecha, @PathVariable(value = "legajoOperario") String legajoOperario, @PathVariable(value = "codigoProyecto") String codigoProyecto, @PathVariable(value = "codigoTarea") String codigoTarea) {
        return Response.ok(service.parteDadoOperarioFechaProyectoYTarea(fecha,legajoOperario,codigoProyecto,codigoTarea));
    }

    @RequestMapping(value = {"/partesEstadoInvalido"}, method = RequestMethod.GET)
    public ResponseEntity<Object> partesConEstadoInvalido() {
        return Response.ok(service.partesConEstadoInvalido());
    }

    @RequestMapping(value = {"/partesEstadoCorregido"}, method = RequestMethod.GET)
    public ResponseEntity<Object> partesConEstadoCorregido() {
        return Response.ok(service.partesConEstadoCorregido());
    }

    @RequestMapping(value = {"/invalidos/{fecha}","/invalidos/"}, method = RequestMethod.GET)
    public ResponseEntity<Object> getInvalidosPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable("fecha") @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<Date> fecha) {
 
        return ResponseEntity.ok(service.obtenerInvalidos(fecha, page, size));
    }
    
    @RequestMapping(value = {"/validos/{fecha}","/validos/"}, method = RequestMethod.GET)
    public ResponseEntity<Object> getValidosPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable("fecha") @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<Date> fecha) {
   
        return ResponseEntity.ok(service.obtenerValidos(fecha, page, size));
    }
    
    @RequestMapping(value = {"/todos/{fecha}","/todos/"}, method = RequestMethod.GET)
    public ResponseEntity<Object> getTodosPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable("fecha") @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<Date> fecha) {
    
        return ResponseEntity.ok(service.obtenerTodos(fecha, page, size));
    }

    @RequestMapping(method=RequestMethod.PUT)
    public ResponseEntity<Object> update(@RequestBody ParteMO aParteMO){
        if (aParteMO.getId() <= 0){
            return Response.error(aParteMO,"Debe especificar un id valido para poder modificar un parte.");
        }

        return Response.ok(
            service.update(aParteMO), 
            "Parte MO alterado correctamente");
    }

}