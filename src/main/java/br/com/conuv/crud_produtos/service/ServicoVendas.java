package br.com.conuv.crud_produtos.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.conuv.crud_produtos.entity.Venda;
import br.com.conuv.crud_produtos.entity.Cliente;
import br.com.conuv.crud_produtos.entity.Produto;

import br.com.conuv.crud_produtos.repository.RepositorioVendas;
import br.com.conuv.crud_produtos.repository.RepositorioClientes;
import br.com.conuv.crud_produtos.repository.RepositorioProdutos;

@Service
public class ServicoVendas {

    private final RepositorioVendas repositorioVendas;
    private final RepositorioClientes repositorioClientes;
    private final RepositorioProdutos repositorioProdutos;

    public ServicoVendas(
            RepositorioVendas repositorioVendas,
            RepositorioClientes repositorioClientes,
            RepositorioProdutos repositorioProdutos) {

        this.repositorioVendas = repositorioVendas;
        this.repositorioClientes = repositorioClientes;
        this.repositorioProdutos = repositorioProdutos;
    }

    public Venda create(Venda venda) {

        Cliente cliente = repositorioClientes.findById(venda.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Produto produto = repositorioProdutos.findById(venda.getProduto().getId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        venda.setCliente(cliente);
        venda.setProduto(produto);

        BigDecimal valor = BigDecimal.valueOf(produto.getPreco())
                .multiply(BigDecimal.valueOf(venda.getQuantidade()));

        venda.setValorVenda(valor);

        return repositorioVendas.save(venda);
    }

    public List<Venda> list() {
        return repositorioVendas.findAll();
    }

    public Venda update(Venda venda) {
        if (!repositorioVendas.existsById(venda.getId())) {
            throw new RuntimeException("Venda não encontrada");
        }

        return create(venda);
    }

    public void delete(long id) {
        repositorioVendas.deleteById(id);
    }
}