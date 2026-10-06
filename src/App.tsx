import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import "./App.css";

const NAV = ["experience", "projects", "pipeline", "skills", "contact"];
const LABELS: Record<string, string> = { projects: "Projets", pipeline: "Du code à la prod", experience: "Expérience", skills: "Compétences", contact: "Contact" };

const STAGES = [
  { name: "Code", tools: ["Java", "Spring Boot", "Go", "React", "TypeScript"], text: "APIs REST, microservices et interfaces web : ADP Board (Go, React, PostgreSQL) et une plateforme de gestion de projets (Spring Boot, Angular)." },
  { name: "Build", tools: ["Docker", "Docker Compose", "Nexus", "Harbor"], text: "Conteneurisation des applications et gestion des artefacts et des images dans Nexus et Harbor." },
  { name: "Test & Sécurité", tools: ["SonarQube", "Trivy", "Gitleaks", "OWASP Dependency-Check"], text: "Module Security d'ADP : il centralise les résultats de quatre outils pour suivre la qualité et la sécurité applicative." },
  { name: "Livraison", tools: ["GitLab", "Jenkins", "Shared Libraries", "GitFlow"], text: "Pipelines CI/CD sur GitLab et Jenkins, avec Shared Libraries pour factoriser les étapes." },
  { name: "Déploiement", tools: ["Kubernetes", "Helm", "Rancher"], text: "Déploiement en production de Board et Security, ainsi que de Jenkins et GitLab, via des charts Helm, suivis depuis Rancher." },
];

const INTERNSHIPS = [
  { org: "S2M · PFE · Févr. – Août 2026", title: "ADP – Module Board", context: "ADP est la plateforme DevOps qui centralise et trace le cycle de livraison logicielle. Board en est le module de pilotage.", points: ["Conception et développement du module : backlogs, sprints, work items et workflows de développement", "Suivi de l'avancement et des indicateurs de performance", "Mise en production sur Kubernetes avec Helm, images gérées dans Harbor, déploiements suivis depuis Rancher"], stack: ["Go", "React", "TypeScript", "PostgreSQL", "Helm", "Kubernetes", "Harbor"] },
  { org: "S2M · PFE · Févr. – Août 2026", title: "ADP – Module Security", context: "Un point d'entrée unique pour suivre la qualité et la sécurité applicative des projets livrés par ADP.", points: ["Conception et développement du module", "Centralisation des résultats de SonarQube, Trivy, Gitleaks et OWASP Dependency-Check", "Mise en production sur Kubernetes avec Helm, comme Board"], stack: ["SonarQube", "Trivy", "Gitleaks", "OWASP Dependency-Check", "Kubernetes", "Helm"] },
  { org: "S2M · PFE · Févr. – Août 2026", title: "Jenkins et GitLab sur Kubernetes", context: "Les outils de la chaîne CI/CD d'ADP tournent eux-mêmes sur Kubernetes.", points: ["Déploiement des instances Jenkins et GitLab via des charts Helm", "Administration et supervision des instances", "Diagnostic des workloads depuis Rancher"], stack: ["Jenkins", "GitLab", "Helm", "Kubernetes", "Rancher"] },
  { org: "Groupe OCP · Juill. – Sept. 2025", title: "Assistant documentaire multilingue", context: "Assistant qui répond aux questions à partir de documents, dans plusieurs langues.", points: ["Architecture RAG avec recherche sémantique et indexation vectorielle FAISS", "API REST sécurisée : authentification JWT, gestion des rôles et contrôle d'accès", "Intégration à une application React Native"], stack: ["Python", "RAG", "FAISS", "REST API", "JWT", "React Native"] },
  { org: "Phosphate Valley Technology · Juill. – Août 2024", title: "Chaîne IoT de supervision de capteurs", context: "Collecte et supervision de données de capteurs en temps réel.", points: ["Mise en place de la chaîne de collecte, de transmission et de supervision", "Capteurs en LoRaWAN, transport via MQTT, visualisation dans ThingsBoard"], stack: ["LoRaWAN", "MQTT", "ThingsBoard"] },
];

const ACADEMIC = [
  { year: "2025", title: "Gestion de projets et de tâches", text: "Application full-stack avec gestion des projets, tâches et utilisateurs, authentifiée par JWT. Frontend, backend et PostgreSQL conteneurisés avec Docker et orchestrés avec Docker Compose.", stack: ["Java", "Spring Boot", "Angular", "PostgreSQL", "JWT", "Docker Compose"] },
  { year: "2025", title: "Meal Customizer — Restaurant Ordering Platform", text: "Application web de commande permettant aux clients de personnaliser leur repas en sélectionnant leurs ingrédients, avec calcul dynamique des valeurs nutritionnelles et du prix selon la composition choisie.", stack: ["PHP", "Laravel", "Bootstrap"] },
  { year: "2025", title: "Plateforme collaborative avec assistant intelligent", text: "Plateforme permettant de collaborer, partager et rechercher des ressources par thématique, avec un assistant basé sur la recherche sémantique pour guider les utilisateurs et leur proposer du contenu pertinent au sein de la plateforme.", stack: ["Angular", "Django REST", "PostgreSQL", "RAG", "FAISS", "JWT", "Docker"] },
];

const JOBS = [
  { date: "Févr. – Août 2026", org: "S2M, Casablanca", role: "Stagiaire Ingénieure DevOps & DevSecOps (PFE)", points: ["Développement des modules Board (Go, React/TypeScript, PostgreSQL) et Security", "Déploiement de Board, Security, Jenkins et GitLab sur Kubernetes avec Helm", "Supervision et diagnostic des workloads depuis Rancher"] },
  { date: "Juill. – Sept. 2025", org: "Groupe OCP, Ben Guerir", role: "Stagiaire Ingénieure IA & Full-Stack", points: ["Assistant RAG multilingue avec FAISS", "API REST sécurisée : JWT, rôles et contrôle d'accès"] },
  { date: "Juill. – Août 2024", org: "Phosphate Valley Technology", role: "Stagiaire IoT", points: ["Chaîne LoRaWAN, MQTT et ThingsBoard pour la supervision de capteurs en temps réel"] },
];

const SKILLS: Record<string, string[]> = {
  "CI/CD & DevOps": ["Git", "GitLab", "Jenkins", "Docker", "Docker Compose"],
  "Kubernetes": ["Kubernetes", "Helm", "Rancher", "Harbor", "Nexus"],
  "DevSecOps": ["SonarQube", "Trivy", "Gitleaks", "OWASP Dependency-Check"],
  "Développement": ["Go", "Java", "Python", "Bash", "SQL", "React", "TypeScript", "Angular"],
  "Backend & données": ["API REST", "Microservices", "Spring Boot", "Django REST", "JWT", "PostgreSQL", "MySQL"],
};

const HEADLINE = ["Ingénieure", "d'État", "en", "Génie", "Informatique"];
const d = (i: number): CSSProperties => ({ "--i": i } as CSSProperties);

export default function App() {
  const [active, setActive] = useState("");
  const [stage, setStage] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  // Section active dans la navigation
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Apparition au scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Barre de progression + ombre de la navigation
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
        setScrolled(h.scrollTop > 12);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const s = STAGES[stage];

  return (
    <div className="app">
      <div className="progress" ref={bar} aria-hidden="true" />

      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#top" className="logo">Kaoutar Mouh</a>
        <nav aria-label="Navigation principale">
          {NAV.map((id) => (
            <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>{LABELS[id]}</a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="orb orb1" aria-hidden="true" />
          <div className="orb orb2" aria-hidden="true" />
          <div className="heroContent">
            <p className="status rise" style={d(0)}><i /> Disponible immédiatement</p>
            <p className="eyebrow rise" style={d(1)}>Diplômée de l'École Hassania des Travaux Publics — EHTP</p>

            <h1 aria-label={HEADLINE.join(" ")}>
              {HEADLINE.map((w, i) => (
                <span key={w + i} className="word" style={d(i + 2)} aria-hidden="true">{w}&nbsp;</span>
              ))}
            </h1>

            <p className="heroRole rise" style={d(7)}>Software Engineering · DevOps · DevSecOps</p>

            <p className="lead rise" style={d(8)}>
              Je conçois et développe des applications backend et frontend, puis je les conteneurise,
              les sécurise et les déploie sur des environnements Kubernetes. Mon parcours à l'EHTP m'a
              permis de développer une approche polyvalente allant du développement logiciel à
              l'industrialisation et à la sécurité des applications.
            </p>

            <div className="cta rise" style={d(9)}>
              <a className="btn primary" href="#experience">Découvrir mon parcours</a>
              <a className="btn" href={`${import.meta.env.BASE_URL}CV_KAOUTAR_MOUH.pdf`} download>Télécharger mon CV</a>
            </div>

            <ul className="heroTags rise" style={d(10)}>
              {["Java / Spring Boot", "Go", "React", "Docker", "Kubernetes", "CI/CD"].map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <a href="#experience" className="scrollHint" aria-label="Aller à la suite"><span /></a>
        </section>

        <section id="experience">
          <h2 className="reveal">Expérience</h2>
          <ol className="timeline reveal">
            {JOBS.map((j, i) => (
              <li key={j.org} className="reveal" style={d(i + 1)}>
                <p className="meta">{j.date}</p>
                <h3>{j.role}</h3>
                <p className="org">{j.org}</p>
                <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects">
          <h2 className="reveal">Projets</h2>
          <h3 className="sub reveal">Réalisés en stage</h3>
          <div className="stackList">
            {INTERNSHIPS.map((p, i) => (
              <article key={p.title} className="card detail reveal" style={d(i % 2)}>
                <p className="meta">{p.org}</p>
                <h3>{p.title}</h3>
                <p className="ctx">{p.context}</p>
                <ul className="points">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
                <ul className="tags">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
              </article>
            ))}
          </div>

          <h3 className="sub reveal">Projets personnels & académiques</h3>
          <div className="grid">
            {ACADEMIC.map((p, i) => (
              <article key={p.title} className="card reveal" style={d(i)}>
                <p className="meta">Projet académique · {p.year}</p>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <ul className="tags">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section id="pipeline">
          <h2 className="reveal">Du code à la production</h2>
          <div className="flow reveal">
            {STAGES.map((x, i) => (
              <button key={x.name} className={i === stage ? "on" : i < stage ? "done" : ""} onClick={() => setStage(i)} aria-pressed={i === stage}>
                <span>{i + 1}</span>{x.name}
              </button>
            ))}
          </div>
          <div className="meter reveal" aria-hidden="true"><b style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} /></div>
            <div className="panel reveal">
              <p>{s.text}</p>

              <ul className="tags">
                {s.tools.map((t, i) => (
                  <li key={t} style={d(i)}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
        </section>

        <section id="skills">
          <h2 className="reveal">Compétences</h2>
          <dl className="skills">
            {Object.entries(SKILLS).map(([k, v], i) => (
              <div key={k} className="reveal" style={d(i)}>
                <dt>{k}</dt>
                <dd><ul className="tags">{v.map((t) => <li key={t}>{t}</li>)}</ul></dd>
              </div>
            ))}
          </dl>
          <p className="meta reveal">Certification : Scrum Foundation Professional Certificate (2024) · Langues : arabe, français, anglais (B2)</p>
        </section>

        <section id="contact" className="contact">
          <div className="contactCard reveal">
            <div className="contactContent">
              <p className="contactEyebrow">Disponible immédiatement</p>
              <h2>Travaillons ensemble.</h2>
              <p className="contactText">
                Je suis à la recherche d'une opportunité junior en <strong>Software Engineering, DevOps ou DevSecOps</strong>,
                où je pourrai contribuer, apprendre et évoluer aux côtés d'une équipe technique.
              </p>
              <div className="contactMeta">
                <span>📍 Casablanca / Rabat / Remote</span>
                <span>💼 CDI · Junior</span>
              </div>
            </div>

            <div className="contactActions">
              <a className="contactBtn contactBtnPrimary" href="mailto:kaoutarmouh7@gmail.com">
                <span className="contactIcon">✉</span>
                <span><small>Me contacter</small>kaoutarmouh7@gmail.com</span>
              </a>
              <a className="contactBtn" href="https://www.linkedin.com/in/kaoutar-mouh-8b7a98299/" target="_blank" rel="noreferrer">
                <span className="contactIcon">in</span>
                <span><small>Mon profil</small>LinkedIn</span>
              </a>
              <a className="contactBtn" href="https://github.com/MOUHKAOUTAR" target="_blank" rel="noreferrer">
                <span className="contactIcon">&lt;/&gt;</span>
                <span><small>Mes projets</small>GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>© 2026 Kaoutar Mouh</footer>
    </div>
  );
}