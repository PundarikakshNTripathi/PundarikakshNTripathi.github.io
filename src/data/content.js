import {
  Trophy,
  Award,
  Users,
  Cpu,
  Network,
  Bot,
  Eye,
  Server,
  Layers,
} from 'lucide-react';

export const socialLinks = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/pundarikakshnarayantripathi',
    Icon: null,
    customSvg: true,
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/PundarikakshNTripathi',
    Icon: null,
    customSvg: true,
  },
  {
    id: 'x-twitter',
    label: 'X',
    url: 'https://x.com/PundarikakshNT',
    Icon: null,
    customSvg: true,
  },
  {
    id: 'kaggle',
    label: 'Kaggle',
    url: 'https://kaggle.com/kzeckt',
    Icon: null,
    customSvg: true,
  },
  {
    id: 'huggingface',
    label: 'Hugging Face',
    url: 'https://huggingface.co/Pundarikaksh',
    Icon: null,
    customSvg: true,
  },
];

export const techStack = [
  'C',
  'C++ (C++17/20)',
  'CUDA C++',
  'Go',
  'Python',
];

export const projects = [
  {
    id: 'voltasplat',
    title: 'VoltaSplat',
    category: 'Graphics & Hardware-Optimized Inference',
    description: "I've been fascinated by 3D Gaussian Splatting, so I decided to build a differentiable CUDA rasterization engine from scratch and integrate it into PyTorch. It was a huge challenge, but by writing tile-based kernels and using NVIDIA CUB for fast depth sorting, I managed to hit 476+ FPS rendering for a million points. Keeping the VRAM footprint under a gigabyte taught me a lot about low-level memory management.",
    tags: ['C++20', 'CUDA C++', 'PyTorch', '3DGS'],
    Icon: Layers,
    accentColor: 'mauve',
    link: 'https://github.com/PundarikakshNTripathi/VoltaSplat',
  },
  {
    id: 'ternix-engine',
    title: 'TernixEngine',
    category: 'Hardware-Optimized Inference',
    description: "Curious about the new 1.58-bit ternary LLMs, I built a custom C++20 inference backend to see how fast I could make them run on the edge. I replaced standard floating-point math with AVX2 SIMD integer additions, which eliminated a ton of bottlenecks. It was incredibly satisfying to see an 8.2x speedup and successfully hook it up to Python using PyBind11.",
    tags: ['C++20', 'AVX2 SIMD', 'HPC'],
    Icon: Cpu,
    accentColor: 'peach',
    link: 'https://github.com/PundarikakshNTripathi/TernixEngine',
  },
  {
    id: 'nanodist',
    title: 'nanoDist: Distributed Engine',
    category: 'Distributed Systems & Lower-Level AI',
    description: "To really understand how distributed ML systems work, I built a minimal execution stack entirely in NumPy. Figuring out manual automatic differentiation and peer-to-peer ring all-reduce operations was tough, but it allowed me to slash peak training memory per node from 106MB to 34MB. I then containerized it and exposed it via FastAPI to see it run in a more production-like setup.",
    tags: ['NumPy', 'HPC', 'Distributed Systems'],
    Icon: Network,
    accentColor: 'mauve',
    link: 'https://github.com/PundarikakshNTripathi/nanoDist',
  },
  {
    id: 'lumasort-engine',
    title: 'LumaSort-Engine',
    category: 'Graphics & Core Engine',
    description: "Combining my interests in computer vision and fluid dynamics, I wrote a cross-platform C++20 engine that uses global luminance-based pixel sorting. Using OpenGL and compute shaders, it can smoothly manipulate up to 640,000 particles at 60+ FPS. It's really fun to play with—you can feed it webcam video or drawings, tweak parameters in a Dear ImGui panel, and watch it morph shapes in real-time.",
    tags: ['C++20', 'OpenGL 3.3', 'OpenCV'],
    Icon: Eye,
    accentColor: 'lavender',
    link: 'https://github.com/PundarikakshNTripathi/LumaSort-Engine',
  },
  {
    id: 'hivetorch',
    title: 'HiveTorch: Federated Core',
    category: 'Distributed Systems & Lower-Level AI',
    description: "Privacy-preserving AI is a huge growing field, so I put together a decentralized Federated Learning engine using PyTorch microservices on Kubernetes. I spent a lot of time simulating extremely messy, real-world data distributions (using Dirichlet sharding) to test its limits. It was a great way to learn about MLOps, as I wired up Weights & Biases and Prometheus to track everything.",
    tags: ['PyTorch', 'Federated Learning', 'Statistics'],
    Icon: Server,
    accentColor: 'peach',
    link: 'https://github.com/PundarikakshNTripathi/HiveTorch',
  },
  {
    id: 'cognova',
    title: "Cognova: Amazon ML Challenge '25 - Multimodal Price Prediction",
    category: 'Applied Machine Learning',
    description: "For the Amazon ML Challenge, I worked on a multimodal price prediction problem. I built a dual-pipeline ensemble using LightGBM and XGBoost, processing text with Sentence-BERT and images with ResNet-50. It was a great practical exercise in managing complex data pipelines, fixing log-scale mismatches, and automating hyperparameter tuning with Optuna.",
    tags: ['LightGBM', 'XGBoost', 'Optuna', 'MLflow', 'ResNet-50'],
    Icon: Layers,
    accentColor: 'lavender',
    link: 'https://github.com/PundarikakshNTripathi/Cognova-Amazon-ML-Challenge-2025',
  }
];

export const milestones = [
  {
    id: 'hackarena',
    title: 'HackArena 2025',
    description:
      'Engineered the core deterministic backend for CivicAgent to autonomously triage civic issues.',
    metric: '2nd',
    metricLabel: 'Place',
    Icon: Award,
    accentColor: 'lavender',
  },
  {
    id: 'leadership',
    title: 'Leadership & Community',
    description:
      'Perplexity AI Campus Partner (Fall \'25 Cohort) and Google Developer Groups (GDG) Lucknow Member.',
    metric: null,
    metricLabel: null,
    Icon: Users,
    accentColor: 'pink',
  },
];

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'research', label: 'Research & Publications' },
  { id: 'projects', label: 'Projects' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];
