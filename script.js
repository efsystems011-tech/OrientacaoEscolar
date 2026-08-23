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
        turma: "2° Ano B",
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
                tamanho: "1.2MB",
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
            },

            {
                nome: "Reunião com responsável",
                data: "2026-04-20",
                duracao: "30:45"
            }
        ]
    },
    {
        id: 2,

        nome: "Alice Hemanoelly Xavier Vill",

        turma: "2º Ano B",

        idade: 8,

        matricula: "002150",

        telefone: "(69) 99213-8877",

        email: "daiarax8@gmail.com",

        frequencia: 55,

        desempenho: "Muito bom",

        responsavel: [
            {
                nome: "Daiara Corrêa Xavier Vill",
                parentesco: "Mãe",
                telefone: "(69) 99213-8877"
            },

            {
                nome: "Alex Junior Vill dos Santos",
                parentesco: "Pai",
                telefone: "(69)98469-7545"
            }
        ],

        ocorrencias: [],

        documentos: [],

        audios: []

    },


    {
        id: 3,

        nome: "Arthur Cordeiro Assíry",

        turma: "2º Ano B",

        idade: 8,

        matricula: "002152",

        telefone: "(69)8447-6047",

        email: "",

        frequencia: 89,

        desempenho: "Em desenvolvimento",

        responsavel: [
            {
                nome: "Gleiciele Cordeiro da Cruz",
                parentesco: "Mãe",
                telefone: "(69)8447-6047"
            },

            {
                nome: "Pablo Assíry da Cruz",
                parentesco: "Pai",
                telefone: "(69)98487-7985"
            }
        ],

        ocorrencias: [

            {
                id: 4,
                tipo: "Aprendizagem",
                data: "2026-08-11",
                descrição:
                    "Apresenta dificuldade na fala."
            }

        ],

        documentos: [],

        audios: []

    }
];

/*
===============================================
   LOCAL STORAGE

===============================================

*/

let alunos = JSON.parse(
    localStorage.getItem("orientacaoAlunos")
) || alunosIniciais;

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

    document.getElementById("studentSearch").addEventListener(
        "input",
        event => renderizarAlunos(event.target.value)
    );

    document.getElementById("searchAluno").addEventListener(
        "input",
        event => renderizarAlunos(event.target.value)
    );

    lucide.createIcons();
    prepararDiretorio();

});

/*
===============================================
    DASHBOARD

===============================================

*/

function atualizarDashboard() {

    document.getElementById("totalAlunos").textContent = alunos.length;

    const ocorrencias = alunos.reduce(
        (total, aluno) => total + (aluno.ocorrencias || []).length, 0
    );

    document.getElementById(
        "totalOcorrencias"
    ).textContent = ocorrencias;

    const reunioes = alunos.reduce(
        (total, aluno) => total + (aluno.audios || []).length, 0
    );

    document.getElementById(
        "totalReunioes"
    ).textContent = reunioes;

    const documentos = alunos.reduce(
        (total, aluno) => total + (aluno.documentos || []).length, 0
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

function renderizarAlunos(filtro = "") {
    const lista = document.getElementById("studentList");

    if (!lista) 
        return;

    lista.innerHTML = "";

    const termo = filtro.trim().toLowerCase();
    const filtrados = alunos.filter(aluno => `${aluno.nome} ${aluno.turma} ${aluno.matricula}`.toLowerCase().includes(termo));
    const grupos = filtrados.reduce((acc, aluno) => {
        const turma = aluno.turma || "Sem turma";
        (acc[turma] ||= []).push(aluno);
        return acc;
    }, {});
    Object.keys(grupos).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true })).forEach(turma => {
        const heading = document.createElement("div");
        heading.className = "student-group-title";
        heading.innerHTML = `<span>${turma}</span><small>${grupos[turma].length} aluno${grupos[turma].length !== 1 ? "s" : ""}</small>`;
        lista.appendChild(heading);
        
        grupos[turma].forEach(aluno => {
            const div = document.createElement("div");
            div.className = "student";
            if (alunoSelecionado && alunoSelecionado.id === aluno.id) div.classList.add("selected");
            div.innerHTML = `<div class="avatar teacher-avatar">${iniciais(aluno.nome)}</div><div class="student-main-info"><strong>${aluno.nome}</strong><small>Matrícula ${aluno.matricula || "-"}</small></div><i data-lucide="chevron-right" class="student-arrow"></i>`;
            div.onclick = () => selecionarAluno(aluno.id);
            lista.appendChild(div);
        });
    });
    if (!filtrados.length) lista.innerHTML = `<div class="empty-small">Nenhum aluno encontrado.</div>`;
    lucide.createIcons();
}

/*
===============================================
    SELECIONAR ALUNO

===============================================

*/

function selecionarAluno(id) {
    alunoSelecionado = alunos.find(
        aluno => aluno.id === id
    );

    if (!alunoSelecionado)
        return

    document.getElementById(
        "emptyState"
    ).style.display = "none";

    document.getElementById(
        "studentProfile"
    ).style.display = "block";


    atualizarPerfil();
    mostrarAba("overview", document.querySelector(".tab"));

    renderizarAlunos(
        document.getElementById(
            "studentSearch"
        ).value
    );

    lucide.createIcons();
}

/*
===============================================
  PERFIL

===============================================

*/

function atualizarPerfil() {
    const aluno = alunoSelecionado;

    document.getElementById(
        "studentName"
    ).textContent = aluno.nome;

    document.getElementById(
        "studentInfo"
    ).textContent = `
        ${aluno.turma} = ${aluno.idade} anos • matricula: ${aluno.matricula}
    `;

    document.getElementById(
        "studentPhone"
    ).textContent = aluno.telefone || "Não informado";

    document.getElementById(
        "studentEmail"
    ).textContent = aluno.email || "Não informado";

    document.getElementById(
        "studentAvatar"
    ).textContent = iniciais(aluno.nome);

    const frequency = document.getElementById("frequency");
    if (frequency) {
        frequency.textContent = `${aluno.frequencia}%`;
    }

    const performance = document.getElementById("performance");
    if (performance) {
        performance.textContent = aluno.desempenho;
    }

    renderizarAlunos();

    renderizarOcorrencias();

    renderizarDocumentos();

    renderizarAudios();

    renderizarResponsaveis();

    lucide.createIcons();
}

// ========================================================
// INICIAIS
// ========================================================

function iniciais(nome) {
    return nome
        .split(" ")
        .slice(0, 2)
        .map(
            palavra =>
                palavra[0]
        )
        .join("")
        .toUpperCase();
};

// ========================================================
// OCORRÊNCIAS
// ========================================================

function renderizarOcorrencias() {
    const ocorrencias = alunoSelecionado.ocorrencias || alunoSelecionado.ocorrencia || [];

    const recentes = ocorrencias.slice(-3).reverse();


    const container = document.getElementById(
        "recentOccurrences"
    );

    container.innerHTML = recentes.length
        ? recentes.map(
            criarOcorrenciaHTML
        ).join("") : `
                                <div class="empty-small">
                                    Nenhuma ocorrência registrada.
                                </div>
                            `;

    const todas = document.getElementById(
        "allOccurrences"
    );

    if (todas) {
        todas.innerHTML =
            ocorrencias.length
                ? ocorrencias
                    .slice()
                    .reverse()
                    .map(
                        criarOcorrenciaHTML
                    )
                    .join("")
                : `
                    <div class="empty-small">
                        Nenhuma ocorrência registrada.
                    </div>
                `;
    }
}

function criarOcorrenciaHTML(ocorrencia) {
    return `
    <div class="occurrence">
        <div class="occurrence-icon">
            <i data-lucide="${iconeOcorrencia(
        ocorrencia.tipo
    )}"></i>
        </div>

        <div>
            <h4>
                ${ocorrencia.tipo}
            </h4>

            <p>
                ${ocorrencia.descrição || ocorrencia.descricao || "Descrição não informada."}
            </p>

            <small>
                ${formatarData(
        ocorrencia.data
    )}
            </small>
        </div>
        </div>
    `;
}


function iconeOcorrencia(tipo) {
    const icones = {
        Saúde: "heart-pulse",
        Comportamento: "message-circle",
        Aprendizagem: "book-open",
        Frequência: "calendar-x",
        Família: "users",
        Outro: "clipboard"
    };

    return (
        icones[tipo] || "clipboard"
    );

}

// ========================================================
// MODAL OCORRÊNCIA
// ========================================================

function abrirOcorrencia() {
    if (!alunoSelecionado) {
        alert("Selecione um aluno primeiro");
        return;
    };

    document.getElementById(
        "occurrenceDate"
    ).value = new Date().toISOString().split("T")[0];

    document.getElementById(
        "occurrenceModal"
    ).classList.add("show");
}

const occurrenceForm = document.getElementById("occurrenceForm");

occurrenceForm?.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const novaOcorrencia = {
            id: Date.now(),
            tipo:
                document.getElementById(
                    "occurrenceType"
                ).value,

            data:
                document.getElementById(
                    "occurrenceDate"
                ).value,

            descrição:
                document.getElementById(
                    "occurrenceDescription"
                ).value
        };

        alunoSelecionado.ocorrencias.push(
            novaOcorrencia
        );

        salvarDados();

        atualizarDashboard();

        atualizarPerfil();

        fecharModal(
            "occurrenceModal"
        );

        this.reset();
    }
);

// ========================================================
// DOCUMENTOS
// ========================================================


function renderizarDocumentos() {

    if (!document.getElementById("documentList")) {
        return;
    }

    const documentos = alunoSelecionado.documentos || alunoSelecionado.documento || [];

    const html = documentos.length
        ? documentos.map(
            criarDocumentoHTML
        ).join("")
        : `
                        <div class="empty-small">
                            Nenhum documentos anexado
                        </div>
                    `;

    document.getElementById(
        "documentList"
    ).innerHTML =
        documentos
            .slice(0, 3)
            .map(criarDocumentoHTML)
            .join("");

    document.getElementById(
        "allDocuments"
    ).innerHTML = html;

    lucide.createIcons();
}

function criarDocumentoHTML(documento) {
    return `
        <div class="document">
            <div class="document-icon">
                <i data-lucide="file-text"></i>
            </div>

            <div>
                <strong title="${documento.nome}">
                    ${documento.nome}
                </strong>
                <small>
                    ${documento.tamanho}
                    •
                    ${documento.data}
                </small>
            </div>
        </div>
    `;
}

// ========================================================
// UPLOAD DE DOCUMENTO
// ========================================================

const documentUpload = document.getElementById("documentUpload");

documentUpload?.addEventListener(
    "change",
    function () {
        const arquivo =
            this.files[0];

        if (!arquivo)
            return;

        alunoSelecionado.documentos.push({
            nome: arquivo.name,
            tamanho: formatarTamanho(
                arquivo.size
            ),
            data: new Date()
                .toLocaleDateString(
                    "pt-BR"
                )
        });

        salvarDados();

        atualizarDashboard();

        renderizarDocumentos();

        this.value = "";
    }
);

// ========================================================
// ÁUDIOS
// ========================================================


function renderizarAudios() {

    if (!document.getElementById("audioList")) {
        return;
    }

    const audios = alunoSelecionado.audios || alunoSelecionado.audio || [];

    const html = audios.length
        ? audios.map(
            criarAudioHTML
        ).join("")
        : `
                        <div class="empty-small">
                            Nenhum áudio registrado.
                        </div>
                    `;


    document.getElementById(
        "audioList"
    ).innerHTML =
        audios
            .slice(0, 3)
            .map(criarAudioHTML)
            .join("");

    document.getElementById(
        "allAudios"
    ).innerHTML = html;


    lucide.createIcons();
}


function criarAudioHTML(audio) {
    return `
        <div class="audio">
            <button class="play"
                    onclick="alert('Aqui será conectado o player de áudio)"
            >

                <i data-lucide="play"></i>
            </button>

            <div class="audio-info">
                <strong>
                    ${audio.nome}
                </strong>

                <small>
                    ${audio.data}
                </small>
            </div>

            <small>
                ${audio.duracao}
            </small>
        </div>
        
    `;
}

// ========================================================
// UPLOAD DE ÁUDIO
// ========================================================

const audioUpload = document.getElementById("audioUpload");

audioUpload?.addEventListener(
    "change",
    function () {
        const arquivo = this.files[0];

        if (!arquivo)
            return;

        alunoSelecionado.audios.push({
            nome: arquivo.name,
            data: new Date()
                .toLocaleDateString(
                    "pt-BR"
                ),

            duracao: "Novo áudio"
        });

        salvarDados();

        atualizarDashboard();

        renderizarAudios();

        this.value = "";
    }
);


// ========================================================
// RESPONSÁVEIS
// ========================================================

function renderizarResponsaveis() {

    const container =
        document.getElementById(
            "guardians"
        );

    if (!container) {
        return;
    }


    container.innerHTML =
        (alunoSelecionado.responsavel || alunoSelecionado.responsaveis || [])
            .map(
                responsavel => `

                    <div class="guardian">

                        <div class="guardian-icon">

                            <i data-lucide="user"></i>

                        </div>

                        <div>

                            <strong>
                                ${responsavel.nome}
                            </strong>

                            <span>
                                ${responsavel.parentesco}
                                •
                                ${responsavel.telefone}
                            </span>

                        </div>

                    </div>

                `
            )
            .join("");


    lucide.createIcons();

}

// ========================================================
// ABAS
// ========================================================

function mostrarAba(aba, botao = null) {
    const abas = ["overview", "ocorrencias", "documentos", "audios", "historico"];
    abas.forEach(nome => {
        const elemento = document.getElementById(nome);
        if (elemento) elemento.style.display = nome === aba ? "block" : "none";
    });
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    if (botao) botao.classList.add("active");
    else {
        const padrao = [...document.querySelectorAll(".tab")].find(t => t.getAttribute("onclick")?.includes(`'${aba}'`));
        if (padrao) padrao.classList.add("active");
    }
    lucide.createIcons();
}

// ========================================================
// NAVEGAÇÃO PRINCIPAL
// ========================================================

function navegarSecao(secao, botao) {
    document.querySelectorAll(".menu").forEach(item => item.classList.remove("active"));
    if (botao) botao.classList.add("active");
    const dashboard = document.querySelector(".content");
    const diretorio = document.getElementById("studentsDirectory");
    if (secao === "dashboard") {
        dashboard.style.display = "block";
        diretorio.style.display = "none";
        return;
    }
    if (secao === "alunos") {
        dashboard.style.display = "none";
        diretorio.style.display = "block";
        prepararDiretorio();
        return;
    }
    dashboard.style.display = "block";
    diretorio.style.display = "none";
    const mapa = { ocorrencias: "ocorrencias", documentos: "documentos", audios: "audios" };
    if (mapa[secao] && alunoSelecionado) {
        const tab = [...document.querySelectorAll(".tab")].find(t => t.getAttribute("onclick")?.includes(`'${mapa[secao]}'`));
        mostrarAba(mapa[secao], tab);
    } else if (!alunoSelecionado) {
        alert("Selecione um aluno primeiro.");
    }
}

function prepararDiretorio() {
    const select = document.getElementById("directoryTurma");
    const input = document.getElementById("directorySearch");

    if (!select || !input)
        return;

    const atual = select.value;
    const turmas = [...new Set(alunos.map(a => a.turma).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
    select.innerHTML = `<option value="">Todas as turmas</option>` + turmas.map(t => `<option value="${t}">${t}</option>`).join("");
    select.value = turmas.includes(atual) ? atual : "";
    const render = () => {
        const termo = input.value.trim().toLowerCase();
        const turma = select.value;
        const filtrados = alunos.filter(a => `${a.nome} ${a.turma} ${a.matricula} ${a.telefone}`.toLowerCase().includes(termo) && (!turma || a.turma === turma));
        renderizarDiretorio(filtrados);
    };
    input.oninput = render;
    select.onchange = render;
    render();
}

function renderizarDiretorio(lista) {
    const container = document.getElementById("directoryList");
    if (!container) return;
    const grupos = lista.reduce((acc, aluno) => { (acc[aluno.turma || "Sem turma"] ||= []).push(aluno); return acc; }, {});
    container.innerHTML = Object.keys(grupos).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true })).map(turma => `
        <section class="class-card">
            <div class="class-card-header"><div><h2>${turma}</h2><span>${grupos[turma].length} aluno${grupos[turma].length !== 1 ? "s" : ""}</span></div></div>
            <div class="directory-students">
                ${grupos[turma].map(aluno => `<button class="directory-student" onclick="abrirFichaAluno(${aluno.id})"><span class="avatar teacher-avatar">${iniciais(aluno.nome)}</span><span class="directory-student-text"><strong>${aluno.nome}</strong><small>${aluno.telefone || "Telefone não informado"}</small></span><i data-lucide="chevron-right"></i></button>`).join("")}
            </div>
        </section>`).join("") || `<div class="empty-state compact"><i data-lucide="users-round"></i><h2>Nenhum aluno encontrado</h2><p>Cadastre um aluno ou ajuste os filtros.</p></div>`;
    lucide.createIcons();
}

function abrirFichaAluno(id) {
    selecionarAluno(id);
    const dashboardBtn = document.querySelector('[data-section="dashboard"]');
    navegarSecao("dashboard", dashboardBtn);
}

// ========================================================
// CADASTRO DE ALUNO
// ========================================================

function abrirCadastroAluno() {
    document.getElementById(
        "studentModal"
    ).classList.add("show");
}

document.getElementById(
    "studentForm"
).addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const novoAluno = {

            id: Date.now(),
            nome: document.getElementById(
                "newStudentName"
            ).value,

            turma:
                document.getElementById(
                    "newStudentClass"
                ).value,

            idade: calcularIdade(
                document.getElementById("newStudentBirth").value
            ),

            matricula:
                String(
                    Math.floor(
                        Math.random() * 900000
                    )
                ),

            telefone:
                document.getElementById(
                    "newStudentPhone"
                ).value,

            email:
                document.getElementById(
                    "newStudentEmail"
                ).value,

            frequencia: 100,

            desempenho:
                "Em acompanhamento",

            responsavel: [],

            ocorrencias: [],

            documentos: [],

            audios: []

        };

        alunos.push(
            novoAluno
        );

        salvarDados();

        atualizarDashboard();

        renderizarAlunos();

        fecharModal(
            "studentModal"
        );

        selecionarAluno(
            novoAluno.id
        );

        this.reset();
    }
);

// ========================================================
// MODAIS
// ========================================================

function fecharModal(id) {
    document.getElementById(id)
        .classList.remove("show");
}


// ========================================================
// EDITAR ALUNO
// ========================================================

function editarAluno() {
    if (!alunoSelecionado)
        return;

    const novoNome = prompt(
        "Nome do aluno",
        alunoSelecionado.nome
    );

    if (!novoNome)
        return

    alunoSelecionado.nome = novoNome;

    salvarDados();
    atualizarPerfil();
    renderizarAlunos();
}

// ========================================================
// UTILIDADES
// ========================================================

function calcularIdade(dataNascimento) {
    if (!dataNascimento) {
        return 0;
    }

    const nascimento = new Date(`${dataNascimento}T00:00:00`);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const aniversarioAindaNaoChegou =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() &&
            hoje.getDate() < nascimento.getDate());

    if (aniversarioAindaNaoChegou) {
        idade--;
    }

    return idade;
}

function formatarData(data) {
    if (!data)
        return "";

    return new Date(
        data + "T00:00:00"
    ).toLocaleDateString(
        "pt-BR"
    );
}

function formatarTamanho(bytes) {
    if (bytes < 1024)
        return bytes + " B ";

    if (bytes < 1024 * 1024)
        return (
            (bytes / 1024).toFixed(0)
            + "KB"
        );

    return (
        (bytes / (1024 * 1024)).toFixed(1) + " MB"
    );
}


function mostrarTodosAlunos() {
    document.getElementById(
        "studentSearch"
    ).value = "";

    renderizarAlunos();
}