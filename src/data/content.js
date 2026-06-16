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
    id: 'ternix-engine',
    title: 'TernixEngine',
    category: 'Hardware-Optimized Inference',
    description:
      'A dependency-free C++20 backend optimized for 1.58-bit ternary Vision-Language Models, utilizing AVX2 SIMD-accelerated integer additions to replace standard FP16 matrix multiplications.',
    tags: ['C++20', 'AVX2 SIMD', 'Ternary Models', 'VLM'],
    Icon: Cpu,
    accentColor: 'lavender',
    link: 'https://github.com/PundarikakshNTripathi',
  },
  {
    id: 'nanodist',
    title: 'nanoDist',
    category: 'Distributed Systems & Lower-Level AI',
    description:
      'A memory-constrained distributed training engine built in pure NumPy to scale foundational model training across nodes without external frameworks.',
    tags: ['NumPy', 'Distributed ML', 'ZeRO', 'Training'],
    Icon: Network,
    accentColor: 'pink',
    link: 'https://github.com/PundarikakshNTripathi',
  },
  {
    id: 'voltasplat',
    title: 'VoltaSplat',
    category: 'Distributed Systems & Lower-Level AI',
    description:
      'A differentiable CUDA rasterization engine for 3D Gaussian Splatting, extending PyTorch via custom C++ bindings and utilizing NVIDIA CUB for tile-based radix sorting.',
    tags: ['CUDA C++', 'PyTorch', '3DGS', 'CUB'],
    Icon: Layers,
    accentColor: 'mauve',
    link: 'https://github.com/PundarikakshNTripathi',
  },
  {
    id: 'lumasort-engine',
    title: 'LumaSort-Engine',
    category: 'Agentic & Applied Workflows',
    description:
      'A real-time computer vision engine utilizing OpenGL Compute Shaders and 1D optimal transport to calculate deterministic pixel trajectories at 60+ FPS.',
    tags: ['OpenGL', 'Compute Shaders', 'CV', '60 FPS'],
    Icon: Eye,
    accentColor: 'peach',
    link: 'https://github.com/PundarikakshNTripathi',
  },
  {
    id: 'kubeinfer',
    title: 'KubeInfer',
    category: 'Hardware-Optimized Inference',
    description:
      'A highly available Kubernetes LLM serving infrastructure using vLLM and NVIDIA Triton, configured for pipeline and tensor parallelism across GPU clusters.',
    tags: ['Kubernetes', 'vLLM', 'Triton', 'LLM Serving'],
    Icon: Server,
    accentColor: 'lavender',
    link: 'https://github.com/PundarikakshNTripathi',
  },
  {
    id: 'ousia',
    title: 'Ousia',
    category: 'Agentic & Applied Workflows',
    description:
      'An Agentic MCP Server designed to provide hardware-level insights for coding agents, bridging the gap between AI assistants and low-level systems knowledge.',
    tags: ['MCP', 'Agentic AI', 'Systems', 'Go'],
    Icon: Bot,
    accentColor: 'pink',
    link: 'https://github.com/PundarikakshNTripathi',
  },
];

export const milestones = [
  {
    id: 'amazon-ml',
    title: 'Amazon ML Challenge \'25',
    description:
      'Architected a robust dual-pipeline LightGBM and XGBoost ensemble, achieving a 58.02 SMAPE score for multimodal price prediction.',
    metric: '58.02',
    metricLabel: 'SMAPE Score',
    Icon: Trophy,
    accentColor: 'peach',
  },
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
  { id: 'projects', label: 'Projects' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'contact', label: 'Contact' },
];
