// Declarando uma variável "clientes" como um array vazio para armazenar dados dos clientes.
let clientes = []

// Definindo uma constante "url" que contém o endereço da API onde os dados dos clientes serão armazenados.
const url = "https://6533083dd80bd20280f63a75.mockapi.io/cliente"


function salvar(){
     // Obtendo o valor do campo de entrada com id "txtNome" e armazenando na variável "nome".
    const nome = document.querySelector('#txtNome').value
    // Obtendo o valor do campo de entrada com id "txtEmail" e armazenando na variável "email".
    const email = document.querySelector('#txtEmail').value
    // Criando um objeto "json" que contém as variáveis "nome" e "email". (Essa linha parece estar incorreta, pois não cria um objeto JSON válido.)
    let json = (nome, email)

    // Enviando uma solicitação POST para a URL da API, passando o objeto "json" como corpo da requisição e definindo os cabeçalhos apropriados.
    fetch(url, {
        method: 'POST', 
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify(json)
    }).then(value => { // Quando a solicitação for concluída com sucesso...
        alert('Inserido com Sucesso!') // Exibindo um alerta informando que o cliente foi inserido com sucesso
        listarClientes()  // Chamando a função "listarClientes" para atualizar a tabela com os novos dados.
    })
}


function listarClientes(){
    // Realizando uma solicitação GET para a URL da API.
    fetch(url).then(resposta => resposta.json())   // Convertendo a resposta da solicitação para JSON.
    .then(valor => {  // Quando a resposta for convertida com sucesso...
        clientes = valor  // Atribuindo o valor retornado à variável "clientes".
        carregarTabela(clientes) // Chamando a função "carregarTabela" para exibir os clientes na interface
    })
}



 // Definindo uma função chamada "carregarTabela" que recebe como parâmetro um array de clientes.
function carregarTabela(clientes){
    // Selecionando o elemento "tbody" da tabela.
    let tbody = document.querySelector("tbody")
    // Limpando o conteúdo atual do elemento "tbody".
    tbody.textContent = ""
    // Iterando sobre cada cliente no array "clientes".
    clientes.forEach(cli => {
        // Criando elementos HTML para exibir os dados do cliente na tabela.
        let tr = document.createElement('tr')
        let thId = document.createElement('th')
        let tdNome = document.createElement('td')
        let tdEmail = document.createElement('td')
        let tdAcoes = document.createElement('td')

         // Preenchendo os elementos com os dados do cliente.
        thId.textContent = cli.id
        tdNome.textContent = cli.nome
        tdEmail.textContent = cli.email

         // Criando botões de ação para excluir
        let btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('btn', 'btn-danger', 'me-5');
        btnExcluir.innerHTML = '<i class="bi bi-trash"></i> Excluir';
        btnExcluir.addEventListener('click', () => excluirCliente(cli.id));
        tdAcoes.appendChild(btnExcluir);

         // Criando botões de ação para alterar o cliente.
        let btnAlterar = document.createElement('button');
        btnAlterar.textContent = 'Alterar';
        btnAlterar.classList.add('btn', 'btn-success');
        btnAlterar.innerHTML = '<i class="bi bi-pencil"></i> Alterar';
        btnAlterar.addEventListener('click', () => abrirModalEditar(cli));
        tdAcoes.appendChild(btnAlterar);

        tdAcoes.appendChild(btnExcluir);
        tdAcoes.appendChild(btnAlterar);

        // Adicionando os elementos à linha da tabela.
        tr.appendChild(thId)
        tr.appendChild(tdNome)
        tr.appendChild(tdEmail)
        tr.appendChild(tdAcoes)
        // Adicionando a linha à tabela.
        tbody.appendChild(tr)
    });
}

function pesquisar(){
    // Obtendo o texto digitado no campo de pesquisa e armazenando na variável "texto".
    let texto = document.querySelector("#txtPesquisar").value
    // Filtrando os clientes cujo nome ou email contenham o texto pesquisado
    let clientesFiltrados = clientes.filter(cli => cli.nome.includes(texto) || cli.email.includes(texto))
    // Chamando a função "carregarTabela" para exibir os clientes filtrados na tabela.
    carregarTabela(clientesFiltrados)
}

 // Definindo uma função chamada "excluirCliente" que recebe o ID do cliente a ser excluído como parâmetro.
function excluirCliente(id) {
     // Enviando uma solicitação DELETE para a URL da API, especificando o ID do cliente a ser excluído.
    fetch(url + '/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json()) // Convertendo a resposta da solicitação para JSON.
    .then(data => {  // Quando a exclusão for concluída com sucesso...
        alert('Cliente excluído com sucesso!');   // Exibindo um alerta informando que o cliente foi excluído com sucesso.
        listarClientes(); // Atualizando a tabela de clientes.
    })
     // Lidando com erros, se ocorrerem, e exibindo no console.
    .catch(error => console.error('Erro ao excluir o cliente:', error));
}

// Definindo uma função chamada "abrirModalEditar" que recebe um objeto cliente como parâmetro.
function abrirModalEditar(cliente) {
    // Definindo o valor do campo de edição de nome como o nome do cliente.
    document.querySelector('#txtNomeEditar').value = cliente.nome;
    // Definindo o valor do campo de edição de email como o email do cliente.
    document.querySelector('#txtEmailEditar').value = cliente.email;

     // Selecionando o botão de salvar edição.
    const btnSalvarEdicao = document.querySelector('#btnSalvarEdicao');
    // Definindo o ID do cliente como um atributo personalizado do botão de salvar edição.
    btnSalvarEdicao.dataset.clienteId = cliente.id;

    // Criando uma instância de modal para o modal de edição.
    const modalEditar = new bootstrap.Modal(document.getElementById('editarCliente'));
    // Exibindo o modal de edição.
    modalEditar.show();
}

function salvarEdicao() {
     // Obtendo o novo nome digitado no campo de edição de nome.
    const novoNome = document.querySelector('#txtNomeEditar').value;
    // Obtendo o novo email digitado no campo de edição de email.
    const novoEmail = document.querySelector('#txtEmailEditar').value;
     // Obtendo o ID do cliente a ser editado a partir do atributo personalizado do botão de salvar edição.
    const clienteId = document.querySelector('#btnSalvarEdicao').dataset.clienteId;
    
    // Criando um objeto com os dados atualizados do cliente.
    const dadosAtualizados = {
        nome: novoNome,
        email: novoEmail
    };

     // Enviando uma solicitação PUT para a URL da API, especificando o ID do cliente e incluindo os novos dados no corpo da requisição.
    fetch(`${url}/${clienteId}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
    },
body: JSON.stringify(dadosAtualizados)
})
.then(response => {  // Quando a atualização for concluída com sucesso...
     // Exibindo um alerta informando que o cliente foi atualizado com sucesso.
    if (response.ok) {
        alert('Cliente atualizado com sucesso!');
        const modalEditar = new bootstrap.Modal(document.getElementById('editarCliente'));
         // Ocultando o modal de edição.
        modalEditar.hide();
        // Atualizando a tabela de clientes.
        listarClientes();
    } else {
        throw new Error('Erro ao atualizar cliente');
    }
})
    // Lidando com erros, se ocorrerem, e exibindo no console.
    .catch(error => console.error('Erro ao atualizar o cliente:', error));
}