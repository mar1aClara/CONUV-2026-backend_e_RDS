package br.com.conuv.crud_produtos.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import br.com.conuv.crud_produtos.entity.Venda;
import br.com.conuv.crud_produtos.service.ServicoVendas;

@RestController
@RequestMapping("/vendas")
@CrossOrigin(origins = "*")
public class VendaController {

    private final ServicoVendas servicoVendas;

    public VendaController(ServicoVendas servicoVendas) {
        this.servicoVendas = servicoVendas;
    }

    @PostMapping
    public Venda create(@RequestBody Venda venda) {
        return servicoVendas.create(venda);
    }

    @GetMapping
    public List<Venda> list() {
        return servicoVendas.list();
    }

    @PutMapping("/{id}")
    public Venda update(@PathVariable long id, @RequestBody Venda venda) {
        venda.setId(id);
        return servicoVendas.update(venda);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        servicoVendas.delete(id);
    }
}