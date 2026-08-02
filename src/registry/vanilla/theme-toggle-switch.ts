function getCurrentTheme(): "light" | "dark" {
	const el = document.documentElement;
	if (el.classList.contains("dark")) return "dark";
	if (el.classList.contains("light")) return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function setTheme(theme: "light" | "dark") {
	const el = document.documentElement;
	el.classList.remove("light", "dark");
	el.classList.add(theme);
	el.style.colorScheme = theme;
	localStorage.setItem("theme", theme);
	document.cookie = `_preferred-theme=${theme}; path=/; max-age=31536000`;
}

const TRANSITION_CSS: Record<string, string> = {
		"circle-reveal": `
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: circle-reveal 1s both;
}

.dark::view-transition-new(root) {
  animation: circle-reveal 1s both;
}

@keyframes circle-reveal {
  to {
    mask-size: 200vmax;
  }
}
	`,
	"circle-blur": `
::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur"/></svg>')
    center / 0 no-repeat;
  animation: circle-blur-reveal 1s both;
}

.dark::view-transition-new(root) {
  animation: circle-blur-reveal 1s both;
}

@keyframes circle-blur-reveal {
  to {
    mask-size: 200vmax;
  }
}

@keyframes expo-out {
  0 0%, 0.1684 2.66%, 0.3165 5.49%,
  0.446 8.52%, 0.5581 11.78%,
  0.6535 15.29%, 0.7341 19.11%,
  0.8011 23.3%, 0.8557 27.93%,
  0.8962 32.68%, 0.9283 38.01%,
  0.9529 44.08%, 0.9711 51.14%,
  0.9833 59.06%, 0.9915 68.74%, 1 100%
}
	`,
	"polygon-reveal": `
::view-transition-group(root) {
  animation-duration: 0.7s;
  animation-timing-function: var(--expo-out);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  animation-name: polygon-reveal-light;
  animation-fill-mode: both;
}

.dark::view-transition-new(root) {
  animation-name: polygon-reveal-dark;
  animation-fill-mode: both;
}

@keyframes polygon-reveal-dark {
  from {
    clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
  }
  to {
    clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
  }
}

@keyframes polygon-reveal-light {
  from {
    clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
  }
  to {
    clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
  }
}
	`,
	"gif-frog": `
::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/jNj-TzGDB9YAAAAm/cute-frog.gif')
    center / 0 no-repeat;
  animation: gif-frog-reveal 1.5s both;
}

.dark::view-transition-new(root) {
  animation: gif-frog-reveal 1.5s both;
}

@keyframes gif-frog-reveal {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
	`,
	"gif-penguin": `
::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/tGCwmrNRc9wAAAAi/dance-dancer.gif')
    center / 0 no-repeat;
  animation: gif-penguin-reveal 1.5s both;
}

.dark::view-transition-new(root) {
  animation: gif-penguin-reveal 1.5s both;
}

@keyframes gif-penguin-reveal {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
	`,
	"gif-cat": `
::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/GQAsycjoZG8AAAAi/scuba-scuba-cat.gif')
    center / 0 no-repeat;
  animation: gif-cat-reveal 1.5s both;
}

.dark::view-transition-new(root) {
  animation: gif-cat-reveal 1.5s both;
}

@keyframes gif-cat-reveal {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
	`,
	"fade": `
::view-transition-old(root) {
  animation: fade-out 300ms ease-in-out both;
}

::view-transition-new(root) {
  animation: fade-in 300ms ease-in-out both;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
	`,
	"slide": `
::view-transition-old(root) {
  animation: slide-out 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: slide-in 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes slide-out {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
	`,
	"scale": `
::view-transition-old(root) {
  animation: scale-out 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

::view-transition-new(root) {
  animation: scale-in 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes scale-out {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.8); opacity: 0; }
}

@keyframes scale-in {
  from { transform: scale(1.2); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
	`,
	"flip": `
::view-transition-old(root) {
  animation: flip-out 600ms ease-in-out both;
  transform-origin: left center;
  backface-visibility: hidden;
}

::view-transition-new(root) {
  animation: flip-in 600ms ease-in-out both;
  transform-origin: right center;
  backface-visibility: hidden;
}

@keyframes flip-out {
  from { transform: perspective(1200px) rotateY(0deg); }
  to { transform: perspective(1200px) rotateY(-90deg); }
}

@keyframes flip-in {
  from { transform: perspective(1200px) rotateY(90deg); }
  to { transform: perspective(1200px) rotateY(0deg); }
}
	`,
	"blur": `
::view-transition-old(root) {
  animation: blur-out 500ms ease-in-out both;
}

::view-transition-new(root) {
  animation: blur-in 500ms ease-in-out both;
}

@keyframes blur-out {
  from {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
  to {
    filter: blur(12px);
    opacity: 0;
    transform: scale(1.02);
  }
}

@keyframes blur-in {
  from {
    filter: blur(12px);
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
}
	`,
	"rotate": `
::view-transition-old(root) {
  animation: rotate-out 500ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: rotate-in 500ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes rotate-out {
  from { transform: rotate(0deg) scale(1); opacity: 1; }
  to { transform: rotate(-10deg) scale(0.9); opacity: 0; }
}

@keyframes rotate-in {
  from { transform: rotate(10deg) scale(0.9); opacity: 0; }
  to { transform: rotate(0deg) scale(1); opacity: 1; }
}
	`,
	"zoom": `
::view-transition-old(root) {
  animation: zoom-out 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: zoom-in 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes zoom-out {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.5); opacity: 0; }
}

@keyframes zoom-in {
  from { transform: scale(2); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
	`,
	"star-reveal": `
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><polygon points="20,2 24.5,15 38,15 27,23 31,36 20,28 9,36 13,23 2,15 15.5,15" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: star-reveal 1s both;
}

.dark::view-transition-new(root) {
  animation: star-reveal 1s both;
}

@keyframes star-reveal {
  to {
    mask-size: 200vmax;
  }
}
	`,
	"heart-reveal": `
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M20 34 C10 26 2 19 2 12 C2 6 7 2 12 2 C16 2 19 4 20 8 C21 4 24 2 28 2 C33 2 38 6 38 12 C38 19 30 26 20 34 Z" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: heart-reveal 1.2s both;
}

.dark::view-transition-new(root) {
  animation: heart-reveal 1.2s both;
}

@keyframes heart-reveal {
  to {
    mask-size: 200vmax;
  }
}
	`,
	"diagonal-wipe": `
::view-transition-group(root) {
  animation-duration: 600ms;
  animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  animation-name: diagonal-wipe-light;
  animation-fill-mode: both;
}

.dark::view-transition-new(root) {
  animation-name: diagonal-wipe-dark;
  animation-fill-mode: both;
}

@keyframes diagonal-wipe-dark {
  from {
    clip-path: polygon(-20% 0, 0% 0, -20% 120%, -40% 120%);
  }
  to {
    clip-path: polygon(-20% 0, 120% 0, 100% 120%, -40% 120%);
  }
}

@keyframes diagonal-wipe-light {
  from {
    clip-path: polygon(120% 0, 140% 0, 120% 120%, 100% 120%);
  }
  to {
    clip-path: polygon(120% 0, -20% 0, -40% 120%, 100% 120%);
  }
}
	`,
	"checkerboard-reveal": `
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="10" height="10" fill="white"/><rect x="10" y="10" width="10" height="10" fill="white"/><rect x="20" width="10" height="10" fill="white"/><rect x="20" y="20" width="10" height="10" fill="white"/><rect x="30" y="10" width="10" height="10" fill="white"/><rect x="30" y="30" width="10" height="10" fill="white"/><rect y="20" width="10" height="10" fill="white"/><rect x="10" y="30" width="10" height="10" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: checkerboard-reveal 1s both;
}

.dark::view-transition-new(root) {
  animation: checkerboard-reveal 1s both;
}

@keyframes checkerboard-reveal {
  to {
    mask-size: 200vmax;
  }
}
	`,
	"ripple-reveal": `
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="white" stroke-width="4"/><circle cx="20" cy="20" r="10" fill="none" stroke="white" stroke-width="4"/><circle cx="20" cy="20" r="2" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: ripple-reveal 1.1s both;
}

.dark::view-transition-new(root) {
  animation: ripple-reveal 1.1s both;
}

@keyframes ripple-reveal {
  to {
    mask-size: 220vmax;
  }
}
	`,
	"venetian-blinds-theme": `
::view-transition-group(root) {
  animation-duration: 700ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  animation-name: blinds-reveal;
  animation-fill-mode: both;
}

.dark::view-transition-new(root) {
  animation-name: blinds-reveal;
}

@keyframes blinds-reveal {
  from {
    clip-path: polygon(
      0 0%, 100% 0%, 100% 2%, 0 2%,
      0 12%, 100% 12%, 100% 14%, 0 14%,
      0 24%, 100% 24%, 100% 26%, 0 26%,
      0 36%, 100% 36%, 100% 38%, 0 38%,
      0 48%, 100% 48%, 100% 50%, 0 50%,
      0 60%, 100% 60%, 100% 62%, 0 62%,
      0 72%, 100% 72%, 100% 74%, 0 74%,
      0 84%, 100% 84%, 100% 86%, 0 86%,
      0 96%, 100% 96%, 100% 98%, 0 98%
    );
  }
  to {
    clip-path: polygon(
      0 0%, 100% 0%, 100% 10%, 0 10%,
      0 10%, 100% 10%, 100% 22%, 0 22%,
      0 22%, 100% 22%, 100% 34%, 0 34%,
      0 34%, 100% 34%, 100% 46%, 0 46%,
      0 46%, 100% 46%, 100% 58%, 0 58%,
      0 58%, 100% 58%, 100% 70%, 0 70%,
      0 70%, 100% 70%, 100% 82%, 0 82%,
      0 82%, 100% 82%, 100% 94%, 0 94%,
      0 94%, 100% 94%, 100% 100%, 0 100%
    );
  }
}
	`,
	"spiral-reveal": `
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M20 20 m0 -16 a16 16 0 1 1 -11.3 27.3 a11 11 0 1 1 7.8 -18.8 a6 6 0 1 1 -4.2 10.2" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>')
    center / 0 no-repeat;
  animation: spiral-reveal 1.3s both;
}

.dark::view-transition-new(root) {
  animation: spiral-reveal 1.3s both;
}

@keyframes spiral-reveal {
  to {
    mask-size: 220vmax;
  }
}
	`,
	"wave-reveal-theme": `
::view-transition-group(root) {
  animation-duration: 800ms;
  animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  animation-name: wave-reveal;
  animation-fill-mode: both;
}

.dark::view-transition-new(root) {
  animation-name: wave-reveal;
}

@keyframes wave-reveal {
  from {
    clip-path: polygon(
      0% 0%, 5% 0%, 10% 0%, 15% 0%, 0% 0%
    );
  }
  to {
    clip-path: polygon(
      0% 0%, 100% 0%, 100% 100%, 0% 100%,
      0% 60%, 5% 55%, 10% 60%, 15% 55%,
      20% 60%, 25% 55%, 0% 0%
    );
  }
}
	`,
	"curtain": `
::view-transition-old(root) {
  animation: curtain-out 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
}

::view-transition-new(root) {
  animation: curtain-in 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
}

@keyframes curtain-out {
  from {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
  to {
    clip-path: inset(0 50% 0 50%);
    opacity: 0;
  }
}

@keyframes curtain-in {
  from {
    clip-path: inset(0 50% 0 50%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
	`,
	"cube": `
::view-transition-old(root) {
  animation: cube-out 700ms ease-in-out both;
  transform-origin: right center;
}

::view-transition-new(root) {
  animation: cube-in 700ms ease-in-out both;
  transform-origin: left center;
}

@keyframes cube-out {
  from { transform: perspective(1500px) rotateY(0deg) translateZ(0); }
  to { transform: perspective(1500px) rotateY(-90deg) translateZ(-200px); }
}

@keyframes cube-in {
  from { transform: perspective(1500px) rotateY(90deg) translateZ(-200px); }
  to { transform: perspective(1500px) rotateY(0deg) translateZ(0); }
}
	`,
	"skew-slide": `
::view-transition-old(root) {
  animation: skew-slide-out 450ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: skew-slide-in 450ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes skew-slide-out {
  from { transform: skewX(0deg) translateX(0); opacity: 1; }
  to { transform: skewX(-8deg) translateX(-100%); opacity: 0; }
}

@keyframes skew-slide-in {
  from { transform: skewX(8deg) translateX(100%); opacity: 0; }
  to { transform: skewX(0deg) translateX(0); opacity: 1; }
}
	`,
	"page-curl": `
::view-transition-old(root) {
  animation: page-curl-out 650ms ease-in both;
  transform-origin: bottom right;
}

::view-transition-new(root) {
  animation: page-curl-in 650ms ease-out both;
}

@keyframes page-curl-out {
  from {
    transform: perspective(1400px) rotateX(0deg) rotateY(0deg);
    opacity: 1;
  }
  to {
    transform: perspective(1400px) rotateX(20deg) rotateY(-70deg);
    opacity: 0;
  }
}

@keyframes page-curl-in {
  from {
    transform: scale(0.96);
    opacity: 0.4;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
	`,
	"accordion": `
::view-transition-old(root) {
  animation: accordion-out 550ms ease-in-out both;
  transform-origin: left center;
}

::view-transition-new(root) {
  animation: accordion-in 550ms ease-in-out both;
  transform-origin: left center;
}

@keyframes accordion-out {
  from { transform: scaleX(1); opacity: 1; }
  to { transform: scaleX(0); opacity: 0.4; }
}

@keyframes accordion-in {
  from { transform: scaleX(0); opacity: 0.4; }
  to { transform: scaleX(1); opacity: 1; }
}
	`,
	"doorway": `
::view-transition-old(root) {
  animation: doorway-out 600ms ease-in both;
  transform-origin: left center;
}

::view-transition-new(root) {
  animation: doorway-in 600ms ease-out both;
}

@keyframes doorway-out {
  from { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
  to { transform: perspective(1200px) rotateY(-110deg); opacity: 0; }
}

@keyframes doorway-in {
  from { transform: scale(1.05); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
	`,
	"book-flip": `
::view-transition-old(root) {
  animation: book-flip-out 700ms ease-in-out both;
  transform-origin: center center;
}

::view-transition-new(root) {
  animation: book-flip-in 700ms ease-in-out both;
  transform-origin: center center;
}

@keyframes book-flip-out {
  from { transform: perspective(1600px) rotateX(0deg); opacity: 1; }
  to { transform: perspective(1600px) rotateX(90deg); opacity: 0.3; }
}

@keyframes book-flip-in {
  from { transform: perspective(1600px) rotateX(-90deg); opacity: 0.3; }
  to { transform: perspective(1600px) rotateX(0deg); opacity: 1; }
}
	`,
	"roll": `
::view-transition-old(root) {
  animation: roll-out 550ms cubic-bezier(0.4, 0, 0.2, 1) both;
  transform-origin: top center;
}

::view-transition-new(root) {
  animation: roll-in 550ms cubic-bezier(0.4, 0, 0.2, 1) both;
  transform-origin: top center;
}

@keyframes roll-out {
  from { transform: scaleY(1) translateY(0); opacity: 1; }
  to { transform: scaleY(0) translateY(-20%); opacity: 0; }
}

@keyframes roll-in {
  from { transform: scaleY(0) translateY(-20%); opacity: 0; }
  to { transform: scaleY(1) translateY(0); opacity: 1; }
}
	`,
	"fold": `
::view-transition-old(root) {
  animation: fold-out 600ms ease-in-out both;
  transform-origin: center center;
}

::view-transition-new(root) {
  animation: fold-in 600ms ease-in-out both;
}

@keyframes fold-out {
  from { transform: perspective(1200px) rotateY(0deg) scaleX(1); opacity: 1; }
  to { transform: perspective(1200px) rotateY(90deg) scaleX(0.3); opacity: 0; }
}

@keyframes fold-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
	`,
	"glitch": `
::view-transition-old(root) {
  animation: glitch-out 400ms steps(6, end) both;
}

::view-transition-new(root) {
  animation: glitch-in 400ms steps(6, end) both;
}

@keyframes glitch-out {
  0% { transform: translate(0, 0); opacity: 1; }
  20% { transform: translate(-6px, 2px); opacity: 0.9; }
  40% { transform: translate(6px, -2px); opacity: 0.7; }
  60% { transform: translate(-4px, 0); opacity: 0.5; }
  80% { transform: translate(4px, 2px); opacity: 0.2; }
  100% { transform: translate(0, 0); opacity: 0; }
}

@keyframes glitch-in {
  0% { transform: translate(4px, -2px); opacity: 0; }
  30% { transform: translate(-6px, 2px); opacity: 0.4; }
  60% { transform: translate(6px, 0); opacity: 0.8; }
  100% { transform: translate(0, 0); opacity: 1; }
}
	`,
	"iris-wipe-page": `
::view-transition-old(root) {
  animation: iris-close 350ms ease-in both;
}

::view-transition-new(root) {
  mask: radial-gradient(circle at center, white 0%, white 0%, transparent 0%);
  animation: iris-open 350ms 350ms ease-out both;
}

@keyframes iris-close {
  from { clip-path: circle(75% at center); }
  to { clip-path: circle(0% at center); }
}

@keyframes iris-open {
  from { mask: radial-gradient(circle at center, white 0%, white 0%, transparent 0%); }
  to { mask: radial-gradient(circle at center, white 100%, white 100%, transparent 100%); }
}
	`
};

let activeStyle: HTMLStyleElement | null = null;

function applyThemeTransition(
	target: "light" | "dark",
	css: string,
	duration: number,
	easing: string,
	onApplied?: () => void,
) {
	if (activeStyle) {
		activeStyle.remove();
		activeStyle = null;
	}

	const style = document.createElement("style");
	const customCSS = css
		.replace(/(\d+)ms/g, `${duration}ms`)
		.replace(/ease-in-out|cubic-bezier\([^)]+\)/g, easing);
	style.textContent = customCSS;
	document.head.appendChild(style);
	activeStyle = style;

	const apply = () => {
		setTheme(target);
		onApplied?.();
	};

	if (typeof document.startViewTransition !== "function") {
		apply();
		style.remove();
		activeStyle = null;
		return;
	}

	document
		.startViewTransition(apply)
		.finished.finally(() => {
			setTimeout(() => {
				style.remove();
				activeStyle = null;
			}, 50);
		});
}

function triggerLiveTransition(css: string, duration: number, easing: string) {
	const next = getCurrentTheme() === "light" ? "dark" : "light";
	triggerThemeTransition(next, css, duration, easing);
}

function triggerThemeTransition(
	target: "light" | "dark",
	css: string,
	duration: number,
	easing: string,
	onApplied?: () => void,
) {
	applyThemeTransition(target, css, duration, easing, onApplied);
}

export interface ThemeToggleSwitchOptions {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

export function createThemeToggleSwitch(
	options: ThemeToggleSwitchOptions = {},
): HTMLButtonElement {
	const { transition = "fade", css, duration, easing } = options;

	const button = document.createElement("button");
	button.type = "button";
	button.role = "switch";
	button.setAttribute("aria-label", "Toggle theme");
	Object.assign(button.style, {
		display: "inline-flex",
		alignItems: "center",
		width: "2.75rem",
		height: "1.5rem",
		flexShrink: "0",
		cursor: "pointer",
		borderRadius: "9999px",
		border: "2px solid transparent",
		transition: "background-color 0.15s",
		outline: "none",
	});

	const thumb = document.createElement("span");
	Object.assign(thumb.style, {
		pointerEvents: "none",
		display: "block",
		width: "1.25rem",
		height: "1.25rem",
		borderRadius: "9999px",
		backgroundColor: "var(--background)",
		boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
		transition: "transform 0.15s",
	});
	button.appendChild(thumb);

	const srOnly = document.createElement("span");
	srOnly.className = "sr-only";
	srOnly.textContent = "Toggle theme";
	button.appendChild(srOnly);

	function updateSwitch() {
		const isDark = getCurrentTheme() === "dark";
		button.setAttribute("aria-checked", String(isDark));
		button.style.backgroundColor = isDark
			? "var(--foreground)"
			: "var(--muted)";
		thumb.style.transform = isDark
			? "translateX(1.25rem)"
			: "translateX(0)";
	}

	function toggleTheme() {
		const t = TRANSITION_CSS[transition];
		const resolvedCSS = css ?? t;
		if (resolvedCSS) {
			const resolvedDuration = duration ?? (t ? undefined : 300);
			const resolvedEasing = easing ?? (t ? undefined : "ease-in-out");
			triggerLiveTransition(
				resolvedCSS,
				resolvedDuration ?? 300,
				resolvedEasing ?? "ease-in-out",
			);
		}
		updateSwitch();
	}

	button.addEventListener("click", toggleTheme);

	const observer = new MutationObserver(() => updateSwitch());
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});

	updateSwitch();

	return button;
}

export { getCurrentTheme, setTheme, triggerLiveTransition, TRANSITION_CSS };