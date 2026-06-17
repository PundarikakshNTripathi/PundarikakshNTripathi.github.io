import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';

const coreStack = [
  { category: 'Languages', items: 'C, C++ (C++17/20), CUDA C++, Python, Go, SQL' },
  { category: 'AI & Machine Learning', items: 'PyTorch, JAX, scikit-learn, XGBoost, LightGBM, Hugging Face, OpenCV, ONNX, Quantization (1.58-bit / GGUF)' },
  { category: 'Data, MLOps & Infrastructure', items: 'Kafka, Apache Spark, Airflow, Weights & Biases (wandb), MLFlow, Optuna, AWS SageMaker, Docker, Kubernetes (K8s), Git, Linux, CMake' },
  { category: 'Backend & Systems', items: 'gRPC, Redis, PostgreSQL, Node.js, Hardware Intrinsics (SIMD/AVX2), Microservices, Memory Management, Distributed Data Parallel' },
  { category: 'Concepts', items: 'Artificial Intelligence, High-Performance Computing (HPC), GPU Architecture, System Design, Data Engineering' }
];

const About = () => {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Philosophy"
          title="Decoding Intelligence"
          subtitle="Bridging foundational research with high-performance computing to push the limits of edge inference."
        />

        <div className="flex flex-col gap-8">
          {/* Top Row: Two Widgets */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left — About Me */}
            <ScrollReveal delay={0.1}>
              <div className="glass-card gradient-border p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-2 w-2 rounded-full bg-lavender" />
                  <span className="font-mono text-xs tracking-widest uppercase text-lavender/70">
                    About Me
                  </span>
                </div>
                <div className="space-y-4 text-base text-text-secondary leading-relaxed flex-1">
                  <p>
                    My core academic and professional pursuit is to advance Artificial Intelligence. However, I have come to realize that the future of AI is no longer bottlenecked solely by theoretical mathematics; it is bottlenecked by hardware and compute as well. Most university AI curricula stop at the API layer. My engineering focus is on the metal beneath it.
                  </p>
                  <p>
                    I am an AI and Systems Researcher dedicated to decoding and understanding the advancements in the AI architectures, their mathematical modelling, GPUs and AI Accelerators. I enjoy learning by stripping away abstractions.—whether that means engineering manual autograd graphs to internalize linear algebra bottlenecks, or writing AVX2 SIMD intrinsics from scratch to push edge inference constraints.
                  </p>
                  <p>
                    My objective is to bridge the gap between frontier algorithmic research and the high-performance distributed infrastructure required to scale it.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Right — Research Focus */}
            <ScrollReveal delay={0.2}>
              <div className="glass-card gradient-border p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-2 w-2 rounded-full bg-pink" />
                  <span className="font-mono text-xs tracking-widest uppercase text-pink/70">
                    Research Focus
                  </span>
                </div>
                <div className="space-y-4 text-base text-text-secondary leading-relaxed flex-1">
                  <p>
                    Currently, my research spans various frontiers of AI: LLMs, SLMs, VLMs, SSMs, World Models, Audio AI, Mechanistic Interpretability, Inference Optimizations, and much more.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bottom Row: Core Stack */}
          <ScrollReveal delay={0.3}>
            <div className="glass-card gradient-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-2 rounded-full bg-mauve" />
                <span className="font-mono text-xs tracking-widest uppercase text-mauve/70">
                  Core Stack
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {coreStack.map((stack, i) => (
                  <div key={i} className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-bg-primary/50 hover:border-lavender/50 transition-colors">
                    <span className="font-mono text-sm font-bold text-text-primary tracking-wider uppercase">
                      {stack.category}
                    </span>
                    <p className="text-base text-text-secondary leading-relaxed">
                      {stack.items}
                    </p>
                  </div>
                ))}
              </div>

              {/* Decorative element */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="font-mono text-xs text-text-muted">
                  <span className="text-lavender">import</span>{' '}
                  <span className="text-pink">torch</span>
                  {'; '}
                  <span className="text-text-primary">torch</span>
                  {'.'}
                  <span className="text-mauve">compile</span>
                  {'(model, '}
                  <span className="text-pink">mode</span>
                  {'='}
                  <span className="text-lavender">"reduce-overhead"</span>
                  {')'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
