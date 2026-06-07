const lista = document.getElementById("lista");

let modal;

document.addEventListener("DOMContentLoaded", () => {

    modal = new bootstrap.Modal(
        document.getElementById("modalEditar")
    );

    carregarDenuncias();

});

function carregarDenuncias() {

    lista.innerHTML = "";

    const denuncias = JSON.parse(
        localStorage.getItem("denuncias")
    ) || [];

    denuncias.forEach((denuncia) => {

        const item = document.createElement("div");

        item.className =
            "list-group-item d-flex justify-content-between align-items-center";

        item.innerHTML = `

            <div>

                <h5>
                    Denúncia #${denuncia.id}
                </h5>

                <small>
                    Postagem: ${denuncia.postagemId}
                </small>

                <br>

                <small>
                    Usuário: ${denuncia.usuarioId}
                </small>

                <br>

                <small>
                    Status: ${denuncia.status}
                </small>

                <p class="mt-2 mb-0">
                    ${denuncia.descricao}
                </p>

            </div>

            <div>

                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="abrirModal(${denuncia.id})">

                    Editar

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="excluir(${denuncia.id})">

                    Excluir

                </button>

            </div>
        `;

        lista.appendChild(item);

    });

}

function abrirModal(id) {

    const denuncias = JSON.parse(
        localStorage.getItem("denuncias")
    ) || [];

    const denuncia = denuncias.find(
        d => d.id === id
    );

    document.getElementById("editId").value =
        denuncia.id;

    document.getElementById("editStatus").value =
        denuncia.status;

    document.getElementById("editDescricao").value =
        denuncia.descricao;

    modal.show();

}

function salvarEdicao() {

    const id = Number(
        document.getElementById("editId").value
    );

    const novoStatus =
        document.getElementById("editStatus").value;

    const novaDescricao =
        document.getElementById("editDescricao").value;

    const denuncias = JSON.parse(
        localStorage.getItem("denuncias")
    ) || [];

    const index = denuncias.findIndex(
        d => d.id === id
    );

    denuncias[index].status = novoStatus;

    denuncias[index].descricao = novaDescricao;

    localStorage.setItem(
        "denuncias",
        JSON.stringify(denuncias)
    );

    modal.hide();

    carregarDenuncias();

}

function excluir(id) {

    if (!confirm("Deseja excluir esta denúncia?")) {
        return;
    }

    let denuncias = JSON.parse(
        localStorage.getItem("denuncias")
    ) || [];

    denuncias = denuncias.filter(
        d => d.id !== id
    );

    localStorage.setItem(
        "denuncias",
        JSON.stringify(denuncias)
    );

    carregarDenuncias();

}