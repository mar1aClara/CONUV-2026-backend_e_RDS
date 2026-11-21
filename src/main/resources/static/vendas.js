
const API_VENDAS = "/vendas";
const API_CLIENTES = "/clientes";
const API_PRODUTOS = "/produtos";

const form = document.getElementById("formVenda");

async function carregarClientes() {
    const resposta = await fetch(API_CLIENTES);
    const clientes = await resposta.json();

    const campo = document.getElementById("cliente");
    campo.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach(cliente => {
        const opcao = document.createElement("option");
        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;
        campo.appendChild(opcao);
    });
}

async function carregarProdutos() {
    const resposta = await fetch(API_PRODUTOS);
    const produtos = await resposta.json();

    const campo = document.getElementById("produto");
    campo.innerHTML = '<option value="">Selecione um produto</option>';

    produtos.forEach(produto => {
        const opcao = document.createElement("option");
        opcao.value = produto.id;
        opcao.textContent = `${produto.nome} - R$ ${Number(produto.preco).toFixed(2)}`;
        campo.appendChild(opcao);
    });
}

async function carregarVendas() {
    const resposta = await fetch(API_VENDAS);
    const vendas = await resposta.json();

    const tabela = document.getElementById("tabelaVendas");
    tabela.innerHTML = "";

    vendas.forEach(venda => {
        const linha = document.createElement("tr");

        const dados = [
            venda.id,
            venda.data,
            venda.loja,
            venda.cliente?.nome || "Cliente não informado",
            venda.produto?.nome || "Produto não informado",
            venda.quantidade,
            `R$ ${Number(venda.valorVenda).toFixed(2)}`
        ];

        dados.forEach(dado => {
            const coluna = document.createElement("td");
            coluna.textContent = dado;
            linha.appendChild(coluna);
        });

        const acoes = document.createElement("td");

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.onclick = () => editarVenda(venda);

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.onclick = () => excluirVenda(venda.id);

        acoes.appendChild(botaoEditar);
        acoes.appendChild(botaoExcluir);
        linha.appendChild(acoes);

        tabela.appendChild(linha);
    });
}

form.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const id = document.getElementById("id").value;

    const venda = {
        data: document.getElementById("data").value,
        loja: document.getElementById("loja").value,
        cliente: {
            id: Number(document.getElementById("cliente").value)
        },
        produto: {
            id: Number(document.getElementById("produto").value)
        },
        quantidade: Number(document.getElementById("quantidade").value)
    };

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_VENDAS}/${id}` : API_VENDAS;

    const resposta = await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(venda)
    });

    if (!resposta.ok) {
        alert("Erro ao salvar venda!");
        return;
    }

    alert("Venda salva com sucesso!");

    limparFormulario();
    carregarVendas();
});

async function editarVenda(venda) {
    document.getElementById("id").value = venda.id;
    document.getElementById("data").value = venda.data;
    document.getElementById("loja").value = venda.loja;
    document.getElementById("cliente").value = venda.cliente.id;
    document.getElementById("produto").value = venda.produto.id;
    document.getElementById("quantidade").value = venda.quantidade;

    document.getElementById("btnSalvar").textContent = "Atualizar venda";
}

async function excluirVenda(id) {
    if (!confirm("Deseja realmente excluir esta venda?")) {
        return;
    }

    const resposta = await fetch(`${API_VENDAS}/${id}`, {
        method: "DELETE"
    });

    if (!resposta.ok) {
        alert("Erro ao excluir venda!");
        return;
    }

    alert("Venda excluída!");
    carregarVendas();
}

function limparFormulario() {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("btnSalvar").textContent = "Cadastrar venda";
}

async function iniciarPagina() {
    await carregarClientes();
    await carregarProdutos();
    await carregarVendas();
}

iniciarPagina();
