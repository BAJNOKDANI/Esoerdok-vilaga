const questions = [
    {
        question: "Melyik állatot nevezik gyakran az esőerdő egyik legfontosabb ragadozójának?",
        options: ["Jaguár", "Nyúl", "Pingvin", "Sün"],
        answer: 0,
        fact: "A jaguár csúcsragadozó, ezért fontos szerepe van az ökoszisztéma egyensúlyában."
    },
    {
        question: "Miért fontosak az esőerdők a Föld klímája szempontjából?",
        options: ["Mert megállítják a szelet", "Mert szabályozzák a szén-dioxid mennyiségét", "Mert mindig hidegek", "Mert csak éjszaka léteznek"],
        answer: 1,
        fact: "Az esőerdők nagy mennyiségű szenet tárolnak, ezért a klíma szabályozásában is fontosak."
    },
    {
        question: "Melyik kontinensen található az Amazonas esőerdő?",
        options: ["Európa", "Afrika", "Dél-Amerika", "Észak-Amerika"],
        answer: 2,
        fact: "Az Amazonas a világ legnagyobb trópusi esőerdeje."
    },
    {
        question: "Mi az egyik legnagyobb veszély az esőerdőkre?",
        options: ["Erdőirtás", "Túl sok felhő", "Kevés napsütés", "Sok turista"],
        answer: 0,
        fact: "Az erdőirtás miatt élőhelyek tűnnek el, és rengeteg faj kerül veszélybe."
    },
    {
        question: "Melyik állat él gyakran az esőerdők lombkoronájában?",
        options: ["Lajhár", "Jegesmedve", "Fóka", "Pingvin"],
        answer: 0,
        fact: "A lajhár lassú mozgásával energiatakarékosan él a fák között."
    },
    {
        question: "Mit jelent a biodiverzitás?",
        options: ["Sokféle élőlény jelenlétét", "Nagy mennyiségű vizet", "Magas hegyeket", "Hosszú teleket"],
        answer: 0,
        fact: "Az esőerdők a Föld leggazdagabb élőhelyei közé tartoznak fajok számában."
    },
    {
        question: "Miért különlegesek az esőerdők növényei?",
        options: ["Mert minden növény sárga", "Mert sok közülük gyógyhatású lehet", "Mert nem nő bennük semmi", "Mert csak mohákból állnak"],
        answer: 1,
        fact: "Számos gyógyszer alapanyaga erdei növényekből származik."
    },
    {
        question: "Mit tehetünk mi az esőerdők védelméért?",
        options: ["Fenntartható termékeket választunk", "Mindent eldobunk", "Csak egyszer használatos dolgokat veszünk", "Nem foglalkozunk vele"],
        answer: 0,
        fact: "A tudatos vásárlás sokat számít, például az FSC-jelölésű termékeknél."
    },
    {
        question: "Melyik állat híres a lassú mozgásáról?",
        options: ["Lajhár", "Gepárd", "Sas", "Delfin"],
        answer: 0,
        fact: "A lajhár annyira lassan mozog, hogy algák is megtelepedhetnek a bundáján."
    },
    {
        question: "Miért fontosak az esőerdők az élővilág számára?",
        options: ["Mert otthont adnak rengeteg fajnak", "Mert mindenhol hó van bennük", "Mert üresek", "Mert csak turistáknak készültek"],
        answer: 0,
        fact: "Az esőerdőkben a szárazföldi fajok óriási része megtalálható."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const questionCounter = document.getElementById("questionCounter");
const progressBar = document.getElementById("progressBar");
const scoreDisplay = document.getElementById("scoreDisplay");
const didYouKnowBox = document.getElementById("didYouKnowBox");

function renderQuestion() {

    nextBtn.style.display = "inline-block";
    answered = false;

    const q = questions[currentQuestion];
    questionText.textContent = q.question;
    questionCounter.textContent = `${currentQuestion + 1} / ${questions.length}`;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    optionsContainer.innerHTML = "";
    didYouKnowBox.style.display = "none";
    didYouKnowBox.innerHTML = "";

    nextBtn.disabled = true;
    nextBtn.textContent = "Következő";

    q.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-btn";
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.addEventListener("click", () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(index, clickedButton) {
    if (answered) return;
    answered = true;

    const q = questions[currentQuestion];
    const allButtons = [...optionsContainer.querySelectorAll(".option-btn")];

    allButtons.forEach(btn => btn.disabled = true);

    if (index === q.answer) {
        clickedButton.classList.add("correct");
        score++;
        scoreDisplay.textContent = score;
    } else {
        clickedButton.classList.add("wrong");
        allButtons[q.answer].classList.add("correct");
    }

    didYouKnowBox.style.display = "block";
    didYouKnowBox.innerHTML = `
    <h3 class="h5 fw-bold mb-2">Tudtad?</h3>
    <p class="mb-0">${q.fact}</p>
  `;

    nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
    if (!answered) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        showResult();
    }
});

restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    scoreDisplay.textContent = score;
    nextBtn.style.display = "inline-block";
    renderQuestion();
});

function showResult() {
    nextBtn.style.display = "none";
    questionText.textContent = `Végeztél! ${score} / ${questions.length} helyes válaszod lett.`;
    optionsContainer.innerHTML = `
    <div class="result-box p-4">
      <p class="mb-2 fw-semibold">Eredményed:</p>
      <p class="mb-0">
        ${score === questions.length
            ? "Tökéletes. Ez már majdnem gyanúsan jó."
            : score >= 7
                ? "Nagyon szép eredmény. Látszik, hogy figyeltél."
                : score >= 4
                    ? "Egész jó. Még van mit csiszolni, de ez már vállalható."
                    : "Még gyakorolni kell, de legalább most már tudod, miről szól az egész."}
      </p>
    </div>
  `;

    didYouKnowBox.style.display = "block";
    didYouKnowBox.innerHTML = `
    <h3 class="h5 fw-bold mb-2">Tudtad?</h3>
    <p class="mb-0">Az esőerdők a Föld egyik leggazdagabb és legfontosabb élőhelyei közé tartoznak.</p>
  `;

    restartBtn.style.display = "inline-block";
    questionCounter.textContent = `${questions.length} / ${questions.length}`;
    progressBar.style.width = "100%";
}

renderQuestion();