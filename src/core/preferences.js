const STORAGE_KEY = "jobconnect.preferences";
const translations = {
  en: {
    Dashboard: "Dashboard", Inicio: "Home", Empleos: "Jobs", Guardados: "Saved", Postulaciones: "Applications", Entrevistas: "Interviews", Tareas: "Tasks", Empresas: "Companies", "Empresas clientes": "Client companies", "Cerrar sesión": "Sign out", Ingresar: "Sign in", "Módulos de trabajo": "Work modules", "Ofertas destacadas": "Featured jobs", "Resumen operativo": "Operational summary", "Datos cargados en esta sesión": "Data loaded in this session", Candidatos: "Candidates", Vacantes: "Vacancies", "Tareas pendientes": "Pending tasks", "Perfiles disponibles": "Available profiles", "Oportunidades activas": "Active opportunities", "Procesos en seguimiento": "Processes being tracked", "Acciones por completar": "Actions to complete", "Abrir módulo →": "Open module →", "Actividad reciente": "Recent activity", "Cómo funciona": "How it works", "CENTRO DE RECLUTAMIENTO": "RECRUITMENT CENTER", "Conecta talento con la oportunidad correcta": "Connect talent with the right opportunity", "Explorar candidatos": "Explore candidates", "Revisar vacantes": "Review vacancies", "Bienvenido de nuevo": "Welcome back", "Iniciar sesión": "Sign in", Registrarse: "Sign up", "Crear cuenta": "Create account", Usuario: "Username", "Nombre de usuario": "Username", Nombre: "First name", Apellidos: "Last name", Correo: "Email", Rol: "Role", "Contrasena normal": "Regular password", "PIN de acceso": "Access PIN", "Usar contrasena normal": "Use regular password", "Usar PIN con el candado": "Use PIN lock", Postulación: "Application", "Ver oferta": "View job", Guardar: "Save", Guardado: "Saved", "Explorar empleos": "Explore jobs", "Soy empresa": "I am an employer", "Buscar empleos": "Search jobs", Buscar: "Search", "Filtros de empleo": "Job filters", "Limpiar filtros": "Clear filters", "Perfil profesional": "Professional profile", "Empleos guardados": "Saved jobs", Postulantes: "Applicants", "Editar oferta": "Edit job", "Publicar oferta": "Publish job", "Ofertas de empresa": "Company jobs", Postularme: "Apply", "Volver a empleos": "Back to jobs", "Oferta no encontrada": "Job not found", "No hay postulaciones": "No applications", Actualizado: "Updated", LIVE: "LIVE", "Acciones": "Actions", "Nuevo registro": "New record", "Guardar cambios": "Save changes", Cancelar: "Cancel", Eliminar: "Delete", "Reintentar": "Retry", "Registros disponibles": "Records available", "Estamos en redes": "We are on social media", "Conecta con JobConnect": "Connect with JobConnect", "Contenido demostrativo": "Demo content", "Encuentra el trabajo que conecta con tu futuro": "Find the job that connects with your future", "Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica.": "Explore demo opportunities and discover your next career step in Costa Rica.", "Explorar empleos": "Explore jobs", "Soy empresa": "I am an employer", Puesto: "Position", Descripcion: "Description", Area: "Area", "Salario de referencia": "Reference salary", "Plazas disponibles": "Available positions", Empresa: "Company"
  },
  fr: {
    Dashboard: "Tableau", Inicio: "Accueil", Empleos: "Emplois", Guardados: "Enregistrés", Postulaciones: "Candidatures", Entrevistas: "Entretiens", Tareas: "Tâches", Empresas: "Entreprises", "Empresas clientes": "Entreprises clientes", "Cerrar sesión": "Se déconnecter", Ingresar: "Connexion", "Módulos de trabajo": "Modules de travail", "Ofertas destacadas": "Offres en vedette", "Resumen operativo": "Résumé opérationnel", Candidatos: "Candidats", Vacantes: "Postes", "Tareas pendientes": "Tâches en attente", "Actividad reciente": "Activité récente", "Cómo funciona": "Comment ça marche", "Explorar candidatos": "Explorer les candidats", "Revisar vacantes": "Revoir les postes", "Iniciar sesión": "Se connecter", Registrarse: "S'inscrire", "Crear cuenta": "Créer un compte", Usuario: "Nom d'utilisateur", Nombre: "Prénom", Apellidos: "Nom", Correo: "E-mail", Rol: "Rôle", Guardar: "Enregistrer", Guardado: "Enregistré", "Ver oferta": "Voir l'offre", Postulación: "Candidature", "Buscar empleos": "Rechercher des emplois", Buscar: "Rechercher", "Filtros de empleo": "Filtres d'emploi", "Limpiar filtros": "Effacer les filtres", "Perfil profesional": "Profil professionnel", "Empleos guardados": "Emplois enregistrés", Postulantes: "Candidats", "Editar oferta": "Modifier l'offre", "Publicar oferta": "Publier une offre", Postularme: "Postuler", "Volver a empleos": "Retour aux emplois", "Oferta no encontrada": "Offre introuvable", Actualizado: "Mis à jour", LIVE: "EN DIRECT", "Acciones": "Actions", Cancelar: "Annuler", Eliminar: "Supprimer", "Estamos en redes": "Nous sommes sur les réseaux", "Conecta con JobConnect": "Connectez-vous à JobConnect", "Encuentra el trabajo que conecta con tu futuro": "Trouvez le travail qui vous connecte à votre avenir", "Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica.": "Explorez des opportunités de démonstration et découvrez votre prochaine étape professionnelle au Costa Rica.", "Explorar empleos": "Explorer les emplois", "Soy empresa": "Je suis une entreprise", Puesto: "Poste", Descripcion: "Description", Area: "Domaine", "Salario de referencia": "Salaire de référence", "Plazas disponibles": "Postes disponibles", Empresa: "Entreprise"
  },
  pt: {
    Dashboard: "Painel", Inicio: "Início", Empleos: "Vagas", Guardados: "Salvos", Postulaciones: "Candidaturas", Entrevistas: "Entrevistas", Tareas: "Tarefas", Empresas: "Empresas", "Empresas clientes": "Empresas clientes", "Cerrar sesión": "Sair", Ingresar: "Entrar", "Módulos de trabajo": "Módulos de trabalho", "Ofertas destacadas": "Vagas em destaque", "Resumen operativo": "Resumo operacional", Candidatos: "Candidatos", Vacantes: "Vagas", "Tareas pendientes": "Tarefas pendentes", "Actividad reciente": "Atividade recente", "Cómo funciona": "Como funciona", "Explorar candidatos": "Explorar candidatos", "Revisar vacantes": "Revisar vagas", "Iniciar sesión": "Entrar", Registrarse: "Cadastrar", "Crear cuenta": "Criar conta", Usuario: "Usuário", Nombre: "Nome", Apellidos: "Sobrenome", Correo: "E-mail", Rol: "Função", Guardar: "Salvar", Guardado: "Salvo", "Ver oferta": "Ver vaga", Postulación: "Candidatura", "Buscar empleos": "Buscar vagas", Buscar: "Buscar", "Filtros de empleo": "Filtros de vagas", "Limpiar filtros": "Limpar filtros", "Perfil profesional": "Perfil profissional", "Empleos guardados": "Vagas salvas", Postulantes: "Candidatos", "Editar oferta": "Editar vaga", "Publicar oferta": "Publicar vaga", Postularme: "Candidatar-se", "Volver a empleos": "Voltar às vagas", "Oferta no encontrada": "Vaga não encontrada", Actualizado: "Atualizado", LIVE: "AO VIVO", "Acciones": "Ações", Cancelar: "Cancelar", Eliminar: "Excluir", "Estamos nas redes": "Estamos nas redes", "Conecta con JobConnect": "Conecte-se ao JobConnect", "Encuentra el trabajo que conecta con tu futuro": "Encontre o trabalho que conecta com seu futuro", "Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica.": "Explore oportunidades demonstrativas e descubra seu próximo passo profissional na Costa Rica.", "Explorar empleos": "Explorar vagas", "Soy empresa": "Sou uma empresa", Puesto: "Cargo", Descripcion: "Descrição", Area: "Área", "Salario de referencia": "Salário de referência", "Plazas disponibles": "Vagas disponíveis", Empresa: "Empresa"
  },
  es: {}
};

Object.assign(translations.en, {
  "Guardar oferta": "Save job",
  "Vacante demostrativa de JobConnect creada para practicar la exploración de oportunidades laborales.": "Demo JobConnect job created to practice exploring career opportunities.",
  Tecnología: "Technology", Soporte: "Support", Puesto: "Position", Descripcion: "Description", Area: "Area", "Salario de referencia": "Reference salary", "Plazas disponibles": "Available positions", Empresa: "Company",
  "Encuentra el trabajo que conecta con tu futuro": "Find the job that connects with your future",
  "Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica.": "Explore demo opportunities and discover your next career step in Costa Rica.",
  "Contenido demostrativo. Las empresas, vacantes y salarios mostrados no representan ofertas reales.": "Demo content. Companies, jobs and salaries shown do not represent real offers."
});
Object.assign(translations.fr, {
  "Guardar oferta": "Enregistrer l'offre",
  "Vacante demostrativa de JobConnect creada para practicar la exploración de oportunidades laborales.": "Offre de démonstration JobConnect créée pour pratiquer l'exploration des opportunités professionnelles.",
  Tecnología: "Technologie", Soporte: "Support", Puesto: "Poste", Descripcion: "Description", Area: "Domaine", "Salario de referencia": "Salaire de référence", "Plazas disponibles": "Postes disponibles", Empresa: "Entreprise",
  "Encuentra el trabajo que conecta con tu futuro": "Trouvez le travail qui vous connecte à votre avenir",
  "Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica.": "Explorez des opportunités de démonstration et découvrez votre prochaine étape professionnelle au Costa Rica.",
  "Contenido demostrativo. Las empresas, vacantes y salarios mostrados no representan ofertas reales.": "Contenu de démonstration. Les entreprises, offres et salaires affichés ne sont pas réels."
});
Object.assign(translations.pt, {
  "Guardar oferta": "Salvar vaga",
  "Vacante demostrativa de JobConnect creada para practicar la exploración de oportunidades laborales.": "Vaga demonstrativa do JobConnect criada para praticar a exploração de oportunidades profissionais.",
  Tecnología: "Tecnologia", Soporte: "Suporte", Puesto: "Cargo", Descripcion: "Descrição", Area: "Área", "Salario de referencia": "Salário de referência", "Plazas disponibles": "Vagas disponíveis", Empresa: "Empresa",
  "Encuentra el trabajo que conecta con tu futuro": "Encontre o trabalho que conecta com seu futuro",
  "Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica.": "Explore oportunidades demonstrativas e descubra seu próximo passo profissional na Costa Rica.",
  "Contenido demostrativo. Las empresas, vacantes y salarios mostrados no representan ofertas reales.": "Conteúdo demonstrativo. As empresas, vagas e salários exibidos não são reais."
});
translations.fr["Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica."] = "Explorez des opportunités de démonstration et découvrez votre prochaine étape professionnelle au Costa Rica.";
translations.pt["Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica."] = "Explore oportunidades demonstrativas e descubra seu próximo passo profissional na Costa Rica.";

function readPreferences() {
  try { return { language: "es", colorblind: false, speech: false, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") }; } catch { return { language: "es", colorblind: false, speech: false }; }
}

function savePreferences(preferences) { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); }

const originalText = new WeakMap();
let translating = false;
let translationObserver;

function translate(root, language) {
  const dictionary = translations[language] ?? translations.es;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement?.closest("script, style, select, option") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  translating = true;
  nodes.forEach((node) => {
    const source = originalText.get(node) ?? node.nodeValue;
    originalText.set(node, source);
    const trimmed = source.trim();
    if (!trimmed) return;
    const translated = dictionary[trimmed] ?? translateDynamic(trimmed, dictionary);
    node.nodeValue = source.replace(trimmed, translated);
  });
  translating = false;
  document.documentElement.lang = language;
}

function translateDynamic(value, dictionary) {
  return value
    .replace(/^Estado: /, `${dictionary.Estado ?? "Status"}: `)
    .replace(/^Candidato: /, `${dictionary.Candidato ?? "Candidate"}: `)
    .replace(/^Registros de /, `${dictionary["Registros de"] ?? "Records of"} `)
    .replace(/^([0-9]+) ofertas encontradas$/, `$1 ${dictionary["ofertas encontradas"] ?? "jobs found"}`);
}

export function applyPreferences() {
  const preferences = readPreferences();
  document.documentElement.classList.toggle("jc-colorblind", preferences.colorblind);
  translate(document, preferences.language);
  if (preferences.speech) enableSpeech();
  if (!translationObserver) {
    translationObserver = new MutationObserver(() => {
      if (!translating) translate(document, readPreferences().language);
    });
    translationObserver.observe(document.body, { childList: true, subtree: true });
  }
}

function enableSpeech() {
  if (document.body.dataset.speechReady) return;
  document.body.dataset.speechReady = "true";
  document.addEventListener("mouseover", (event) => {
    const target = event.target.closest("button, a, label, h1, h2, h3, p, small, strong, span");
    if (!target || target.dataset.speechIgnore || !target.textContent.trim()) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(target.textContent.trim()));
  });
}

export function createPreferenceControls() {
  const preferences = readPreferences();
  const controls = document.createElement("div");
  controls.className = "jc-preference-controls";
  controls.innerHTML = `<select aria-label="Idioma"><option value="es">ES</option><option value="en">EN</option><option value="fr">FR</option><option value="pt">PT</option></select><button type="button" aria-label="Modo daltonismo" title="Modo daltonismo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg></button><button type="button" aria-label="Lectura por voz" title="Lectura por voz"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm13.5-3a8 8 0 0 1 0 12M15.5 9a4 4 0 0 1 0 6"></path></svg></button>`;
  const language = controls.querySelector("select");
  const colorblind = controls.querySelectorAll("button")[0];
  const speech = controls.querySelectorAll("button")[1];
  language.value = preferences.language;
  colorblind.classList.toggle("is-active", preferences.colorblind);
  speech.classList.toggle("is-active", preferences.speech);
  language.addEventListener("change", () => { const next = { ...readPreferences(), language: language.value }; savePreferences(next); applyPreferences(); });
  colorblind.addEventListener("click", () => { const next = { ...readPreferences(), colorblind: !readPreferences().colorblind }; savePreferences(next); applyPreferences(); colorblind.classList.toggle("is-active", next.colorblind); });
  speech.addEventListener("click", () => { const next = { ...readPreferences(), speech: !readPreferences().speech }; savePreferences(next); applyPreferences(); speech.classList.toggle("is-active", next.speech); });
  return controls;
}