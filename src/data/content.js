// All site copy lives here. Components only decide how it looks.

export const person = {
  name: 'Pundarikaksh Narayan Tripathi',
  firstName: 'Pundarikaksh',
  lastName: 'Narayan Tripathi',
  email: 'pundarikaksh.dev@gmail.com',
  resume: '/resume/Pundarikaksh_NT_Resume.pdf',
  location: 'Lucknow, India',
  updated: 'September 2026',
};

export const socialLinks = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/PundarikakshNTripathi' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/pundarikakshnarayantripathi' },
  { id: 'x', label: 'X', url: 'https://x.com/PundarikakshNT' },
  { id: 'huggingface', label: 'Hugging Face', url: 'https://huggingface.co/Pundarikaksh' },
  { id: 'kaggle', label: 'Kaggle', url: 'https://kaggle.com/kzeckt' },
];

export const hero = {
  lead:
    "I'm a final-year computer science student and an independent researcher. I work on the layer of machine learning that most people never have to look at: the kernels, the memory traffic, and the systems that decide whether a model is fast enough to be useful.",
  now: [
    { label: 'Working', text: 'ML engineering intern at FlyRank, on search ranking.' },
    { label: 'Building', text: 'TernixEngine, a CPU inference engine for ternary LLMs.' },
    { label: 'Studying', text: 'B.Tech CSE (AI) at BBDU, Lucknow. Graduating in 2027.' },
  ],
};

// Paragraphs may contain {note:id} markers; the matching sidenote renders in the margin.
export const story = {
  paragraphs: [
    "I learn things by building a smaller version of them. When I wanted to understand how distributed training moves data between machines, I wrote nanoDist in plain NumPy, derived every backward pass by hand, and simulated the all-reduce one step at a time. When the 1.58-bit papers came out{note:ternary}, I wanted to know how fast a ternary model could actually run on an ordinary CPU, so I wrote the kernels myself in C++ and AVX2.",
    "Somewhere along the way I realised that most of what pulled me into AI wasn't in the model definitions. It was underneath them. Where does the memory go? Why is this kernel slow? What is the GPU actually waiting on? My coursework mostly stops at calling the library, and I kept wanting to know what the library was doing.",
    "Being independent means I don't have a lab or an advisor handing me problems. I pick questions I can't stop thinking about, build until I can measure something, and write down what I find. Lately that's efficient inference, small and state-space models, and mechanistic interpretability, which is the other half of the same curiosity: how a trained network works on the inside.",
    "I graduate in 2027. After that I'd like to be somewhere the systems people and the modelling people sit in the same room{note:room}, because the most interesting problems I've found live between them.",
  ],
  notes: {
    ternary:
      '1.58 is log₂3. Every weight is −1, 0 or +1, so a matrix multiply becomes additions, subtractions and skips.',
    room: 'Figuratively. I would also take a shared Slack channel.',
  },
};

export const interests = [
  'Inference optimisation and low-bit quantisation',
  'Small language models and state-space models',
  'Vision-language and audio models',
  'World models',
  'Mechanistic interpretability',
  'GPU architecture and kernel design',
];

export const toolbox = [
  { group: 'Languages', items: 'C, C++17/20, CUDA C++, Triton, Python, Go, SQL' },
  { group: 'ML', items: 'PyTorch, JAX, ONNX, scikit-learn, XGBoost, LightGBM, Hugging Face, OpenCV' },
  { group: 'Systems', items: 'SIMD and AVX2 intrinsics, GPU programming, memory management, CMake, Linux' },
  { group: 'Infrastructure', items: 'Docker, Kubernetes, gRPC, Kafka, Spark, Redis, PostgreSQL, Elasticsearch' },
  { group: 'Experiments', items: 'Weights & Biases, MLflow, Optuna, Prometheus, AWS SageMaker, PyTorch DDP' },
];

export const work = [
  {
    id: 'flyrank',
    role: 'Machine Learning Engineering Intern',
    org: 'FlyRank',
    url: 'https://flyrank.com',
    where: 'Remote',
    period: 'July 2026 – present',
    body: [
      "I'm building a ranking pipeline over multi-gigabyte enterprise search datasets with DuckDB and scikit-learn. The aim is to predict which content people will actually find, and then help them find more of it.",
      "Much of the work is evaluation. Getting train and test splits that don't leak took longer than the models did, and it's the part I'm proudest of. It ends in a reproducible recommendation system that anyone can run.",
    ],
  },
];

export const research = {
  intro:
    "I haven't published anything yet. These are the questions I'm working on right now. Notes and papers will show up here as they're ready.",
  questions: [
    {
      q: 'How far can low-bit inference go on hardware people already own?',
      a: 'Ternary weights remove the multiply. TernixEngine is my test bed for how much of that saving survives contact with a real CPU: memory bandwidth, register pressure and unpacking cost.',
      project: 'ternix-engine',
    },
    {
      q: 'What does memory-saving parallelism cost at small scale?',
      a: 'ZeRO-style sharding and activation checkpointing are usually discussed at the scale of thousands of GPUs. nanoDist let me measure the trade between memory and communication on a handful of workers, where every byte is visible.',
      project: 'nanodist',
    },
  ],
};

// `figure` picks the schematic drawn next to each project (see ProjectFigure.jsx).
export const projects = [
  {
    id: 'voltasplat',
    title: 'VoltaSplat',
    summary: 'A differentiable 3D Gaussian Splatting rasterizer in CUDA, plugged into PyTorch through ATen.',
    body: 'I wanted to see the whole path from a million Gaussians to pixels and back to gradients, so I wrote both passes myself. The screen is cut into 16×16 tiles, splats are depth-sorted with 64-bit keys using NVIDIA CUB, and each thread block stages its splats in shared memory. Gradients accumulate with atomics.',
    results: [
      ['476+', 'FPS rendering 1M Gaussians'],
      ['<17 ms', 'forward pass'],
      ['<951 MB', 'peak VRAM while training'],
    ],
    stack: 'C++20, CUDA, PyTorch',
    figure: 'tiles',
    link: 'https://github.com/PundarikakshNTripathi/VoltaSplat',
    featured: true,
  },
  {
    id: 'ternix-engine',
    title: 'TernixEngine',
    status: 'Active research',
    summary: 'A dependency-free C++20 inference engine for 1.58-bit ternary LLMs on ordinary CPUs.',
    body: "With ternary weights you never need to multiply. TernixEngine unpacks the weights inside registers and turns matrix products into branchless AVX2 integer adds and subtracts. A 32-byte-aligned allocator keeps every load aligned, and PyBind11 exposes the engine to Python so it's easy to test against reference models.",
    results: [['8.2×', 'faster than the scalar baseline']],
    stack: 'C++20, AVX2, PyBind11, CMake',
    figure: 'ternary',
    link: 'https://github.com/PundarikakshNTripathi/TernixEngine',
    featured: true,
  },
  {
    id: 'nanodist',
    title: 'nanoDist',
    summary: 'A distributed training engine written in NumPy, from autograd upward.',
    body: 'No PyTorch and no MPI. I derived the backward passes by hand, simulated ring all-reduce between workers, then added ZeRO Stage 2 optimizer sharding and activation checkpointing to see how much memory I could win back. It ships as a Docker image with CI and a FastAPI endpoint for inference.',
    results: [['106 → 34 MB', 'peak training memory per node (−68%)']],
    stack: 'NumPy, Docker, FastAPI',
    figure: 'ring',
    link: 'https://github.com/PundarikakshNTripathi/nanoDist',
  },
  {
    id: 'hivetorch',
    title: 'HiveTorch',
    summary: 'Federated learning with PyTorch microservices on Kubernetes.',
    body: 'A FedAvg server and its clients talk over gRPC, each in its own pod. To make it hard on purpose, I sharded the data with a Dirichlet distribution so every client sees a skewed, non-IID slice. Runs are tracked in Weights & Biases, telemetry goes to Prometheus, and Optuna runs the sweeps.',
    results: [['87.0%', 'peak global accuracy on non-IID shards']],
    stack: 'PyTorch, Kubernetes, gRPC',
    figure: 'federated',
    link: 'https://github.com/PundarikakshNTripathi/HiveTorch',
  },
  {
    id: 'lumasort-engine',
    title: 'LumaSort-Engine',
    summary: 'Real-time pixel sorting by luminance, in C++20 and OpenGL compute shaders.',
    body: "This came out of two things I like, computer vision and fluid motion. Up to 640,000 particles rearrange themselves by brightness while you feed in a webcam or a drawing and tweak the parameters live in a Dear ImGui panel. It's the thing I've built that I most enjoy just playing with.",
    results: [['640K', 'particles at 60+ FPS']],
    stack: 'C++20, OpenGL 3.3, OpenCV',
    figure: 'luma',
    link: 'https://github.com/PundarikakshNTripathi/LumaSort-Engine',
  },
  {
    id: 'cognova',
    title: 'Cognova',
    summary: "Multimodal price prediction for the Amazon ML Challenge '25.",
    body: 'Product text goes through Sentence-BERT, images through ResNet-50, and a LightGBM and XGBoost ensemble sits on top. Most of the real work was unglamorous: fixing a log-scale mismatch between training and scoring, and letting Optuna do the tuning I would otherwise have done badly by hand.',
    results: [],
    stack: 'LightGBM, XGBoost, ResNet-50, Optuna, MLflow',
    figure: 'fusion',
    link: 'https://github.com/PundarikakshNTripathi/Cognova-Amazon-ML-Challenge-2025',
  },
];

// Reverse-chronological. `when` is shown as written.
export const timeline = [
  {
    when: 'Jul 2026',
    title: 'Started at FlyRank',
    text: 'Machine learning engineering internship, remote.',
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
