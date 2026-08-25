export function createJobCardStub() {
  const article = document.createElement("article");
  article.className = "jc-portal-job-card";

  const title = document.createElement("h3");
  title.className = "jc-portal-job-card-title";
  title.textContent = "Tarjeta de empleo";

  const message = document.createElement("p");
  message.className = "jc-portal-job-card-message";
  message.textContent = "El catálogo visual se implementará en la Fase 2.";

  article.append(title, message);
  return article;
}
