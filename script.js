/*
===============================================
    ORIENTAÇÃO ESCOLAR

    Sistema de acompanhamento e alunos

===============================================

*/

/*
===============================================
   DADOS INICIAIS

===============================================

*/

const alunosIniciais = [
    {
        id: 1,
        nome: "Alexsandro da Silva Cardoso",
        idade: 8,
        matricula: "002149",
        telefone: "(69) 99250-1903",
        email: "",
        frequencia: 92,
        desempenho: "ruim",

        responsavel: [
            {
                nome: "Raquel Aparecida da Silva",
                parentesco: "Mãe",
                telefone: "(69) 99250-1903"
            },

            {
                nome: "Marciano Penha Cardoso",
                parentesco: "Pai",
                telefone: "(69) 99250-1903"
            }
        ],

        ocorrencias: [
            {
                id: 1,
                tipo: "Saúde",
                data: "2026-06-14",
                descrição: "Aluno começou chorar sem parar no meio da aula."
            },

            {
                id: 2,
                tipo: "Aprendizagem",
                data: "2026-07-10",
                descrição: "Aluno tem uma grande dificuldade de aprendizagem e tem dormido com frequencia na sala de aula."
            }
        ],

        documentos: [
            {
                nome: "Relatório Pedagógico.pdf",
                tamanho:"1.2MB",
                data: "2026-04-21"
            },

             {
                nome: "Plano de Atendimento.docx",
                tamanho: "980 KB",
                data: "05/08/2026"
            }
        ],

        audios: [
            {
                nome: "Reunião com responsável",
                data: "2026-07-14",
                duracao: "12:45"
            }
        ]
    }
];

/*
===============================================
   LOCAL STORAGE

===============================================

*/

let alunos = JSON.parse(
    localStorage.getItem("orientacaoAlunos")
)||alunosIniciais;

function salvarDados() {
    localStorage.setItem("orientacaoAlunos", JSON.stringify(alunos));
}

/*
===============================================
   ESTADO

===============================================

*/

let alunoSelecionado = null;


/*
===============================================
INICIALIZAÇÃO

===============================================

*/


document.addEventListener("DOMContentLoaded", () => {

    atualizarDashboard();

    renderizarAlunos();

    lucide.createIcons();

});

/*
===============================================
    DASHBOARD

===============================================

*/

function atualizarDashboard() {

    document.getElementById("totalAlunos").textContent = alunos.length;

    const ocorrencias = alunos.reduce(
        (total, aluno) => total + aluno.ocorrencias.length, 0
    );

    document.getElementById(
        "totalOcorrencias"
    ).textContent = ocorrencias;

    const reunioes = alunos.reduce(
        (total, aluno) => total + aluno.audios.length, 0
    );

    document.getElementById(
        "totalReunioes"
    ).textContent = reunioes;

    const documentos = alunos.reduce(
        (total, aluno) => total + aluno.documentos.length, 0
    );

    document.getElementById(
        "totalDocumentos"
    ).textContent = documentos;
}

/*
===============================================
    LISTA DE aLUNOS

===============================================

*/

function renderizarAlunos(
    filtro = ""
) {
    const lista = document.getElementById("studentList");

    lista.innerHTML = "";

    const filtrados = alunos.filter(
        aluno => aluno.nome
        .toLowercase()
        .includes(
            filtro.toLowerCase()
        )
    );


    filtrados.forEach(
        aluno => {
            const div = document.createElement(
                "div"
            );

            div.className = "student";

            if(
                alunoSelecionado && alunoSelecionado.id === aluno.id
            ) {
                div.classList.add(
                    "selected"
                );
            }


            div.innerHTML = `
                <div class="avatar teacher-avatar">
                    ${iniciais(aluno.nome)}
                </div>

                <div>
                    <strong> ${aluno.nome} </strong>
                    <small> ${aluno.turma} </small>
                </div>
            `;

            div.onclick = () => selecionarAluno(aluno.id);

            lista.appendChild(div);
        }
    );
}

/*
===============================================
    LISTA DE aLUNOS

===============================================

*/