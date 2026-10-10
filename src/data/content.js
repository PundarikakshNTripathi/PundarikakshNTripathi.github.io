// All site copy lives here. Components only decide how it looks.

export const person = {
  name: 'Pundarikaksh Narayan Tripathi',
  firstName: 'Pundarikaksh',
  lastName: 'Narayan Tripathi',
  email: 'pundarikaksh.dev@gmail.com',
  // One résumé per kind of role. The first is the default and keeps the old URL, so links shared
  // before the split still open a current résumé.
  resumes: [
    { id: 'systems', label: 'ML systems and GPU', note: 'Kernels, CUDA, distributed training', file: '/resume/Pundarikaksh_NT_Resume.pdf' },
    { id: 'research', label: 'AI research', note: 'Causal ML, differentiable rendering', file: '/resume/Pundarikaksh_NT_Resume_AI_Research.pdf' },
    { id: 'engineering', label: 'AI engineering', note: 'Agent security, serving, federated learning', file: '/resume/Pundarikaksh_NT_Resume_AI_Engineering.pdf' },
    { id: 'data', label: 'Data science', note: 'Causal inference, evaluation, experiments', file: '/resume/Pundarikaksh_NT_Resume_Data_Science.pdf' },
    { id: 'swe', label: 'Software engineering', note: 'Systems, infrastructure, testing', file: '/resume/Pundarikaksh_NT_Resume_Software_Engineering.pdf' },
  ],
  location: 'Lucknow, India',
  lab: {
    name: 'Quiet Intelligence',
    role: 'Founder and Lead Researcher',
    url: 'https://quietintelligence.org',
    tagline: 'Signal, not noise.',
    links: [
      { label: 'Website', url: 'https://quietintelligence.org' },
      { label: 'GitHub', url: 'https://github.com/Quiet-Intelligence' },
      { label: 'LinkedIn', url: 'https://linkedin.com/company/quietintelligence' },
      { label: 'X', url: 'https://x.com/qi_research' },
    ],
  },
  updated: 'September 2026',
};

export const socialLinks = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/PundarikakshNTripathi' },
  { id: 'lab', label: 'Quiet Intelligence', url: 'https://quietintelligence.org' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/pundarikakshnarayantripathi' },
  { id: 'x', label: 'X (Twitter)', url: 'https://x.com/PundarikakshNT' },
  { id: 'huggingface', label: 'Hugging Face', url: 'https://huggingface.co/Pundarikaksh' },
  { id: 'kaggle', label: 'Kaggle', url: 'https://kaggle.com/kzeckt' },
];

export const hero = {
  lead:
    "I'm a final-year computer science student and an independent researcher. I work on the layer of machine learning that most people never have to look at: the kernels, the memory traffic, and the systems that decide whether a model is fast enough, and safe enough, to be useful.",
  now: [
    { label: 'Working', text: 'ML engineering intern at FlyRank AI, on ranking and causal inference.' },
    { label: 'Leading', text: 'Quiet Intelligence, the research lab I founded. Building Aegis and TernixEngine there.' },
    { label: 'Studying', text: 'B.Tech CSE (AI) at BBDU, Lucknow. Graduating in 2027.' },
  ],
};

// Paragraphs may contain {note:id} markers; the matching sidenote renders in the margin.
export const story = {
  paragraphs: [
    "I learn things by building a smaller version of them. When I wanted to understand how distributed training moves data between machines, I wrote nanoDist in plain NumPy, derived every backward pass by hand, and simulated the all-reduce one step at a time. When the 1.58-bit papers came out{note:ternary}, I wanted to know how fast a ternary model could actually run on an ordinary CPU, so I wrote the kernels myself in C++ and AVX2.",
    "Somewhere along the way I realized that the parts of AI I cared about most sat underneath the model definitions: where the memory goes, why a kernel is slow, what the GPU is actually waiting on. My coursework mostly stops at calling the library, and I kept wanting to know what the library was doing.",
    "Being independent means nobody hands me problems. I pick questions I can't stop thinking about, build until I can measure something, and write down what I find. This year I founded Quiet Intelligence{note:qi}, a small research lab for that work, with three threads: the systems that run models, the models themselves, and interpretability, which is the other half of the same curiosity: how a trained network works on the inside.",
    "At FlyRank AI I learned that a model can tell you who will leave and still have nothing useful to say about what to do, and I've been reading causal inference ever since. And after watching coding agents get tricked into doing things no single permission would have allowed, I started building Aegis, which watches what an agent does in the kernel and learns what normal looks like.",
    "I graduate in 2027. After that I'd like to be somewhere the systems people and the modeling people sit in the same room{note:room}, because the most interesting problems I've found live between them.",
  ],
  notes: {
    ternary:
      'BitNet b1.58 (Ma et al., 2024). Each weight is −1, 0 or +1, and three possible values carry log₂3 ≈ 1.58 bits of information, hence the name. Multiplying by such a weight means adding the input, subtracting it, or leaving it out, so a matrix multiply needs no multiplications at all.',
    qi: 'The name is the philosophy. From the manifesto: “True intelligence does not require hype; a well-designed architecture speaks entirely through its performance.”',
    room: 'Figuratively. I would also take a shared Slack channel.',
  },
};

export const interests = [
  'Inference optimization and low-bit quantization',
  'Causal inference and counterfactual reasoning',
  'Security and oversight for autonomous agents',
  'Small language models and state-space models',
  'Vision-language and audio models',
  'World models',
  'Mechanistic interpretability',
  'GPU architecture and kernel design',
];

export const toolbox = [
  { group: 'Languages', items: 'C, C++17/20, CUDA C++, Triton, Python, Go, SQL' },
  { group: 'ML', items: 'PyTorch, JAX, ONNX, scikit-learn, XGBoost, LightGBM, Hugging Face, OpenCV' },
  { group: 'Causal and RL', items: 'EconML, DoWhy, double machine learning, LinUCB contextual bandits, process reward models' },
  { group: 'Systems', items: 'SIMD and AVX2 intrinsics, GPU programming, eBPF and Linux security modules, AWS Cedar, CMake' },
  { group: 'Data and infrastructure', items: 'DuckDB, Apache Arrow, Docker, Kubernetes, gRPC, FastAPI, Kafka, Spark, Redis, PostgreSQL' },
  { group: 'Experiments', items: 'Weights & Biases, MLflow, Optuna, Prometheus, AWS SageMaker, PyTorch DDP' },
];

export const work = [
  {
    id: 'flyrank',
    role: 'Machine Learning Engineering Intern',
    org: 'FlyRank AI',
    url: 'https://flyrank.ai',
    where: 'Remote',
    period: 'July 2026 – present',
    body: [
      "FlyRank AI runs its internship as a structured, project-based program, and mine is about recommendation. I built a ranking pipeline over more than 79 million interaction records in DuckDB and scikit-learn, with features for how discoverable a piece of content is and how engagement with it changes over time.",
      "The part that changed how I think was causal inference. User behavior is full of confounders, so I used leakage-safe train and test splits and causal methods to separate what people did because of the content from what they would have done anyway.",
      "The program sets a target, and I hit it: Precision@50 went from 0.24 for the heuristic baselines to 0.74, a 208% relative improvement, once I had a proper framework for evaluating which features actually mattered.",
    ],
  },
];

export const research = {
  intro:
    "I haven't published a paper yet. My research lives at Quiet Intelligence, and these are the questions behind it. The interpretability work is still in progress and will come out first as a preprint; notes and papers will show up here as they're ready.",
  questions: [
    {
      q: 'How far can low-bit inference go on hardware people already own?',
      a: 'Ternary weights remove the multiply. TernixEngine is my test bed for how much of that saving survives contact with a real CPU: memory bandwidth, register pressure and unpacking cost.',
      project: 'ternix-engine',
    },
    {
      q: 'Can an agent sandbox learn what normal behavior looks like?',
      a: 'Static sandboxes allow or deny single actions, but the attacks that worry me are sequences of individually allowed steps. Aegis tests whether a behavior graph built from kernel events, plus a bandit that tunes its own thresholds, can catch those sequences without getting in the way of honest work.',
      project: 'aegis',
    },
  ],
};

// Numbers come from the benchmark tables in each repo's README; `setup` says what they were measured on.
// Featured projects get a schematic figure (see ProjectFigure.jsx) with a caption.
export const projects = [
  {
    id: 'aegis',
    title: 'Aegis',
    status: 'Active research',
    summary: 'A kernel-level security and memory layer for autonomous coding agents.',
    body: "Aegis started with a real vulnerability, in which a prompt-injected agent used perfectly legitimate git commands to escape its workspace. No single step was forbidden; the sequence was the attack. eBPF hooks in the Linux Security Module layer stream every file open, connection and exec into a Go daemon that builds a temporal graph of what the agent is doing. Sequences it has judged before are recalled from a local vector memory, new ones go to a pluggable LLM adjudicator, and a LinUCB bandit tunes how sensitive the scorer is. Hard rules are written in AWS Cedar and compiled straight into kernel maps.",
    results: [
      ['Sustained event rate, no drops', '5,120 events/s'],
      ['Pipeline latency, p50 / p99', '0.045 / 0.42 ms'],
      ['Cedar policy compile', '15.4 µs'],
      ['Honest multi-step tasks not falsely blocked', '90%'],
    ],
    setup: "From the repo's automated benchmark and trajectory evals, 20 adversarial runs.",
    stack: 'Go, eBPF, SQLite, AWS Cedar',
    figure: 'layers',
    caption: 'Syscalls cross the kernel boundary into a behavior graph. Allowed steps pass; the sequence that adds up to an attack is stopped at the hook.',
    link: 'https://github.com/Quiet-Intelligence/aegis',
    featured: true,
  },
  {
    id: 'ternix-engine',
    title: 'TernixEngine',
    status: 'Active research',
    summary: 'A dependency-free C++20 and CUDA inference engine for 1.58-bit ternary LLMs.',
    body: "With ternary weights you never need to multiply. On the CPU, TernixEngine unpacks the weights inside registers and turns matrix products into branchless AVX2 adds and subtracts, using sign instructions so the branch predictor never has to guess. The CUDA path streams weights into shared memory with cp.async and reduces across each warp with shuffles. A 32-byte-aligned allocator keeps every load aligned, and PyBind11 exposes the whole thing to Python.",
    results: [
      ['Scalar, branching on each weight', '122.4 ms'],
      ['AVX2, tiled and branchless', '15.0 ms (8.2×)'],
    ],
    setup: '512×512 ternary matrix multiply on an Intel i7‑14650HX.',
    stack: 'C++20, AVX2, PyBind11, CMake',
    figure: 'ternary',
    caption: 'A ternary weight matrix. Every entry is +1, −1 or 0, so each output is a sum of some activations minus others.',
    link: 'https://github.com/Quiet-Intelligence/TernixEngine',
    featured: true,
  },
  {
    id: 'amlc-2026',
    title: 'Amazon ML Challenge 2026',
    status: 'Provisional rank 3',
    summary: 'Business entity resolution: matching the same business across three noisy directories.',
    body: "For every business in one source, find all of its records in two others, from messy names and addresses, scored by macro F0.5. One region showed up only in the test set, with no labels at all, which was most of the difficulty. My team currently ranks third on both the public and private leaderboards; that's provisional until Amazon announces the official results. I'm keeping the approach itself under wraps for now, since we still have a write-up to submit.",
    results: [
      ['Leaderboard rank (provisional), public and private', '3rd'],
      ['Leaderboard score', '0.991762'],
    ],
    setup: 'Official results and the approach write-up are pending.',
    stack: 'Python, PyTorch',
    figure: 'resolve',
    caption: 'Records for one business scattered across three sources; most candidate pairs are lookalikes, not matches.',
    link: null,
    linkNote: 'Code private until the results are announced',
    featured: true,
  },
  {
    id: 'voltasplat',
    title: 'VoltaSplat',
    summary: 'A differentiable 3D Gaussian Splatting rasterizer in CUDA, plugged into PyTorch through ATen.',
    body: 'I wanted to see the whole path from a million Gaussians to pixels and back to gradients, so I wrote both passes myself. Gaussians are projected to screen space, depth-sorted with 64-bit keys using NVIDIA CUB, and composited tile by tile, with each thread block staging its splats in shared memory. Gradients accumulate with atomics.',
    results: [
      ['Rendering, 100k Gaussians', '476 FPS'],
      ['Forward pass, 1M Gaussians', '16.2 ms'],
      ['Backward pass, 1M Gaussians', '45.3 ms'],
      ['Peak VRAM, 1M Gaussians', '951 MB'],
    ],
    setup: 'RTX 5060 Laptop GPU, 800×800 render.',
    stack: 'C++20, CUDA, PyTorch',
    figure: 'tiles',
    caption: 'The screen is cut into 16×16-pixel tiles. Each shaded tile keeps a list of the splats that touch it.',
    link: 'https://github.com/PundarikakshNTripathi/VoltaSplat',
    featured: true,
  },
  {
    id: 'nanodist',
    title: 'nanoDist',
    summary: 'A distributed training engine written in NumPy, from autograd upward.',
    body: 'No PyTorch and no MPI. I derived the backward passes by hand, simulated ring all-reduce between workers, then added mixed precision, ZeRO Stage 2 optimizer sharding and activation checkpointing to see how much memory I could win back. It ships as a Docker image with CI and a FastAPI endpoint for inference.',
    results: [['Memory per worker', '106.0 → 33.8 MB (−68%)']],
    stack: 'NumPy, Docker, FastAPI',
    link: 'https://github.com/PundarikakshNTripathi/nanoDist',
  },
  {
    id: 'causal-dml',
    title: 'Causal-DML',
    summary: 'A causal inference engine that estimates what a retention offer would actually do for each user.',
    body: "A churn model can tell you a user is 90% likely to leave. It can't tell you whether a discount would change that. Causal-DML answers the second question on KKBox streaming logs with double machine learning in EconML and DoWhy, served through FastAPI with a Streamlit dashboard for simulating the counterfactual.",
    results: [['Average treatment effect on churn, 100,000 users', '−1.74 × 10⁻³']],
    stack: 'EconML, DoWhy, DuckDB, FastAPI',
    link: 'https://github.com/PundarikakshNTripathi/Causal-DML',
  },
  {
    id: 'hivetorch',
    title: 'HiveTorch',
    summary: 'Federated learning with PyTorch microservices on Kubernetes.',
    body: 'A FedAvg server and its clients talk over gRPC, each in its own pod. To make it hard on purpose, I sharded the data with a Dirichlet distribution so every client sees a skewed, non-IID slice. Runs are tracked in Weights & Biases, telemetry goes to Prometheus, and Optuna runs the sweeps.',
    results: [['Test accuracy, 5 clients after 10 rounds', '87.0%']],
    stack: 'PyTorch, Kubernetes, gRPC',
    link: 'https://github.com/PundarikakshNTripathi/HiveTorch',
  },
  {
    id: 'lumasort-engine',
    title: 'LumaSort-Engine',
    summary: 'Real-time pixel sorting by luminance, in C++20 and OpenGL compute shaders.',
    body: "This came out of two things I like, computer vision and fluid motion. Up to 640,000 particles rearrange themselves by brightness while you feed in a webcam or a drawing and tweak the parameters live in a Dear ImGui panel. It's the thing I've built that I most enjoy just playing with.",
    results: [['Particles sorted live at 60+ FPS', '640K']],
    stack: 'C++20, OpenGL 3.3, OpenCV',
    link: 'https://github.com/PundarikakshNTripathi/LumaSort-Engine',
  },

];

// Reverse-chronological. `when` is shown as written.
export const timeline = [
  {
    when: 'Jul 2026',
    title: 'Started at FlyRank AI',
    text: 'Machine learning engineering internship, remote.',
  },
  {
    when: '2026',
    title: 'Leaderboard rank 3, Amazon ML Challenge 2026',
    text: 'Business entity resolution, on both the public and private leaderboards. Provisional; official results are pending.',
  },
  {
    when: '2026',
    title: 'Founded Quiet Intelligence',
    text: 'An independent research lab for ML systems, model research and interpretability. I lead its research.',
  },
  {
    when: '2025',
    title: 'Second place, HackArena 2025',
    text: 'Masai × NoBroker. I built the backend for CivicAgent, a civic complaint tracker with deterministic SLA timers, a public dashboard and scheduled escalations.',
  },
  {
    when: 'Aug 2025',
    title: 'Perplexity AI Campus Partner',
    text: 'Fall 2025 cohort, through January 2026.',
  },
  {
    when: 'Aug 2025',
    title: 'Joined GDG Lucknow',
    text: 'Google Developer Groups. Still a member.',
  },
  {
    when: '2023',
    title: 'Started a B.Tech in CSE (AI)',
    text: 'Babu Banarasi Das University, Lucknow. Expected to finish in August 2027.',
  },
];

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
];
