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
    id: 'cognova',
    title: "Cognova: Amazon ML Challenge '25 - Multimodal Price Prediction",
    category: 'Applied Machine Learning',
    description: 'Achieved a competitive 58.02 SMAPE score in multimodal price prediction by architecting a robust dual-pipeline LightGBM and XGBoost ensemble. Improved prediction stability across a 5-fold OOF generation by extracting text via Sentence-BERT and processing images via ResNet-50. Resolved OOF log-scale mismatches and automated hyperparameter tuning with Optuna, tracking artifacts via MLflow.',
    tags: ['LightGBM', 'XGBoost', 'Optuna', 'MLflow', 'ResNet-50'],
    Icon: Layers,
    accentColor: 'lavender',
    link: 'https://github.com/PundarikakshNTripathi/Cognova-Amazon-ML-Challenge-2025',
  },
  {
    id: 'nanodist',
    title: 'nanoDist: Distributed Engine',
    category: 'Distributed Systems & Lower-Level AI',
    description: "To truly understand distributed ML systems, I bypassed standard frameworks and built a custom execution stack entirely in NumPy. I engineered manual automatic differentiation and simulated peer-to-peer Ring All-Reduce primitives, successfully slashing peak training memory by 68.07% (down to 34MB/node) using ZeRO Stage 2 partitioning and Activation Checkpointing. Finally, I containerized the engine and exposed it via FastAPI, transforming a raw mathematical experiment into a production-ready system.",
    tags: ['NumPy', 'HPC', 'Distributed Systems'],
    Icon: Network,
    accentColor: 'mauve',
    link: 'https://github.com/PundarikakshNTripathi/nanoDist',
  },
  {
    id: 'hivetorch',
    title: 'HiveTorch: Federated Core',
    category: 'Distributed Systems & Lower-Level AI',
    description: "Driven by the challenge of privacy-preserving AI, I engineered a decentralized Federated Learning (FedAvg) engine deployed as decoupled PyTorch microservices on Kubernetes. By synthesizing extreme data heterogeneity with Dirichlet distribution sharding, I validated the system's algorithmic robustness, maintaining a peak global accuracy of 87.0%. The entire pipeline is fully automated and observable, featuring integrated MLOps tracking via Weights & Biases and real-time telemetry through Prometheus.",
    tags: ['PyTorch', 'Federated Learning', 'Statistics'],
    Icon: Server,
    accentColor: 'peach',
    link: 'https://github.com/PundarikakshNTripathi/HiveTorch',
  },
  {
    id: 'lumasort-engine',
    title: 'LumaSort-Engine',
    category: 'Graphics & Core Engine',
    description: "Combining computer vision with fluid dynamics, I developed a custom cross-platform C++20 engine to explore global luminance-based pixel sorting. Leveraging OpenGL 3.3 and GLSL shaders, the engine achieves a silky 60+ FPS while manipulating up to 640,000 concurrent particles. It can seamlessly morph live multimodal inputs—like webcam feeds or interactive drawings—into high-fidelity target shapes using OpenCV. A built-in Dear ImGui panel lets users tweak the GLM-based fluid dynamics in real-time, making it an interactive visual playground.",
    tags: ['C++20', 'OpenGL 3.3', 'OpenCV'],
    Icon: Eye,
    accentColor: 'lavender',
    link: 'https://github.com/PundarikakshNTripathi/LumaSort-Engine',
  },
  {
    id: 'voltasplat',
    title: 'VoltaSplat',
    category: 'Graphics & Hardware-Optimized Inference',
    description: "Fascinated by the performance demands of 3D Gaussian Splatting, I built a differentiable CUDA rasterization engine directly integrated into PyTorch. By architecting 16x16 tile-based kernels and leveraging NVIDIA CUB for ultra-fast 64-bit depth sorting, the engine achieves 476+ FPS rendering with sub-17ms forward passes for 1M points. Strict memory caching kept peak VRAM under 951MB, proving that high-fidelity volumetric rendering can be both blazingly fast and resource-efficient.",
    tags: ['C++20', 'CUDA C++', 'PyTorch', '3DGS'],
    Icon: Layers,
    accentColor: 'mauve',
    link: 'https://github.com/PundarikakshNTripathi/VoltaSplat',
  },
  {
    id: 'ternix-engine',
    title: 'TernixEngine',
    category: 'Hardware-Optimized Inference',
    description: "I set out to push the limits of edge inference for 1.58-bit ternary LLMs. By engineering a dependency-free C++20 backend from scratch, I eliminated floating-point bottlenecks, replacing standard FP16 math with AVX2 SIMD-accelerated integer additions. This hardware-native approach processed tensor transformations entirely within L0 registers, delivering a massive 8.2x speedup over scalar baselines while exposing a seamless Python API via PyBind11.",
    tags: ['C++20', 'AVX2 SIMD', 'HPC'],
    Icon: Cpu,
    accentColor: 'peach',
    link: 'https://github.com/PundarikakshNTripathi/TernixEngine',
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
