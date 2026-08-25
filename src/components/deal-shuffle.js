const STAGGER_DELAY = 100;
const ANIMATION_DURATION = 680;

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function randomBetween(minimum, maximum) {
  return Math.round(minimum + Math.random() * (maximum - minimum));
}

function revealImmediately(card) {
  card.classList.remove("is-deal-shuffle-pending", "is-deal-shuffle-visible");
  card.classList.add("is-deal-shuffle-complete");
}

function finishAnimation(card) {
  card.classList.remove("is-deal-shuffle-pending", "is-deal-shuffle-visible");
  card.classList.add("is-deal-shuffle-complete");
}

const observer = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
    const cardsToReveal = entries
      .filter((entry) => entry.isIntersecting)
      .map((entry) => entry.target)
      .sort((firstCard, secondCard) => (
        firstCard.compareDocumentPosition(secondCard) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      ));

    cardsToReveal.forEach((card, index) => {
      observer.unobserve(card);
      window.setTimeout(() => {
        card.classList.add("is-deal-shuffle-visible");
        window.setTimeout(() => finishAnimation(card), ANIMATION_DURATION);
      }, index * STAGGER_DELAY);
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px 12% 0px",
  })
  : null;

/**
 * Prepara las cards recién insertadas para la animación Deal Shuffle.
 * La función se usa desde el renderizado de CRUD para cubrir carga, filtro y paginación.
 */
export function observeDealShuffleCards(cards) {
  const cardList = Array.from(cards);

  cardList.forEach((card) => {
    if (card.classList.contains("is-deal-shuffle-complete") || card.dataset.dealShuffleObserved === "true") {
      return;
    }

    card.dataset.dealShuffleObserved = "true";

    if (reducedMotionQuery.matches || !observer) {
      revealImmediately(card);
      return;
    }

    card.style.setProperty("--jc-deal-shuffle-x", `${randomBetween(-24, 24)}px`);
    card.style.setProperty("--jc-deal-shuffle-y", `${randomBetween(18, 44)}px`);
    card.style.setProperty("--jc-deal-shuffle-rotation", `${randomBetween(-12, 12)}deg`);
    card.classList.add("is-deal-shuffle-pending");
    observer.observe(card);
  });
}

export default observeDealShuffleCards;
