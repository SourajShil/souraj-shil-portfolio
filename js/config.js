/**
 * =========================================================================
 * PERSONAL PORTFOLIO CONFIGURATION - SOURAJ SHIL
 * =========================================================================
 * Tailored specifically for Souraj Shil's Data Engineering Portfolio.
 */

window.PORTFOLIO_CONFIG = {
  // -----------------------------------------------------------------------
  // 1. PERSONAL INFORMATION
  // -----------------------------------------------------------------------
  personal: {
    name: "Souraj Shil",
    greeting: "Hi, I'm",
    title: "Data Engineer",
    typewriterRoles: [
      "Data Engineer",
      "I build data pipelines & cloud systems.",
      "PySpark & Big Data Specialist",
      "Cloud Data Warehouse Builder",
      "Airflow & dbt Orchestrator"
    ],
    status: {
      available: true,
      text: "Open to Data Engineering job roles"
    },
    location: "Belonia, South Tripura, India",
    email: "sourajshil@gmail.com",
    emailServiceKey: "44995f8d-573a-4e7b-90a8-9d85639b177d",
    resumeUrl: "Souraj_Shil_Resume_Latest.pdf",
    about: {
      paragraphs: [
        "I am a Computer Applications undergraduate specialized in Data Engineering, passionate about architecting scalable, resilient end-to-end ETL/ELT pipelines and modern cloud data warehouses.",
        "My hands-on expertise spans designing production-grade data pipelines using Python, SQL, PySpark, Apache Airflow, dbt, PostgreSQL, Docker, and AWS (S3, Glue, Lambda, Redshift). I build systems with a focus on data quality gating, incremental processing, star-schema modeling, and idempotent writes.",
        "From ingesting unstructured and transactional data to building dimensional data marts and real-time BI dashboards with QuickSight, Power BI, and Metabase, I ensure data is clean, reliable, and analytics-ready."
      ],
      highlights: [
        { label: "Data Pipelines Built", value: "5+" },
        { label: "Cloud Services (AWS & Fabric)", value: "10+" },
        { label: "Certifications Earned", value: "6" },
        { label: "Pipeline Reliability", value: "99.9%" }
      ]
    },
    avatarUrl: "souraj.jpg"
  },

  // -----------------------------------------------------------------------
  // 2. SOCIAL LINKS & CONTACT
  // -----------------------------------------------------------------------
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/SourajShil",
      icon: "github",
      handle: "SourajShil"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/souraj-shil-82692b2b7?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      icon: "linkedin",
      handle: "souraj-shil-82692b2b7"
    },
    {
      name: "Email",
      url: "mailto:sourajshil@gmail.com",
      icon: "mail",
      handle: "sourajshil@gmail.com"
    }
  ],

  // -----------------------------------------------------------------------
  // 3. WORK EXPERIENCE (Empty for undergraduate student profile)
  // -----------------------------------------------------------------------
  experience: [],

  // -----------------------------------------------------------------------
  // 4. EDUCATION
  // -----------------------------------------------------------------------
  education: [
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Assam Down Town University",
      location: "Assam, India",
      period: "2024 — 2027 (Pursuing)",
      highlights: "Core focus on Data Engineering, Database Systems, Data Structures & Algorithms, and Cloud Computing."
    },
    {
      degree: "Senior Secondary (12th CBSE)",
      institution: "CBSE Board",
      location: "Tripura, India",
      period: "2024",
      highlights: "Scored 67% with focus on Computer Science and Mathematics."
    },
    {
      degree: "Secondary School Examination (10th CBSE)",
      institution: "CBSE Board",
      location: "Tripura, India",
      period: "2022",
      highlights: "Scored 55.6% foundational academics."
    }
  ],

  // -----------------------------------------------------------------------
  // 5. FEATURED DATA ENGINEERING PROJECTS
  // -----------------------------------------------------------------------
  projects: [
    {
      id: "proj-stock",
      title: "Stock Data Pipeline",
      subtitle: "Modular Market-Data Ingestion, PostgreSQL Loading & Streamlit Dashboard",
      category: "ETL & Analytics",
      featured: true,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      description: "A modular, automated market-data engineering pipeline that extracts live and historical stock data with yfinance, cleans and structures with Pandas, loads into PostgreSQL, and surfaces interactive visual analytics on Streamlit with APScheduler automation.",
      bullets: [
        "Built a modular stock-data pipeline using Python, Pandas, and yfinance for market-data ingestion.",
        "Structured fetch, transform, PostgreSQL load, Streamlit dashboard, and APScheduler components.",
        "Prepared the pipeline for automated execution and interactive stock-data visualization."
      ],
      tags: ["Python", "Pandas", "yfinance", "PostgreSQL", "Streamlit", "APScheduler", "ETL"],
      demoUrl: "https://github.com/SourajShil",
      githubUrl: "https://github.com/SourajShil"
    },
    {
      id: "proj-2",
      title: "End-to-End E-Commerce Data Pipeline",
      subtitle: "Airflow Orchestration, dbt Data Modeling & Dockerized Metabase",
      category: "ETL & dbt",
      featured: true,
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
      description: "A production-style daily ETL/ELT pipeline simulating synthetic customer transactions with Python Faker, ingested into PostgreSQL, structured with dbt multi-layer data models, and served on Metabase dashboards.",
      bullets: [
        "Built automated daily workflow: Python (Faker synthetic stream) → PostgreSQL → dbt (staging / intermediate / marts) → Metabase.",
        "Implemented incremental dbt models, idempotent writes, watermarking, and automated dbt test assertions.",
        "Designed analytics marts for daily-sales velocity, product-performance KPIs, and customer-RFM clusters.",
        "Configured robust task retry policies, failure alerting, and audit logging patterns in Apache Airflow."
      ],
      tags: ["Apache Airflow", "dbt", "PostgreSQL", "Docker", "Metabase", "Python", "Data Modeling"],
      demoUrl: "https://github.com/SourajShil",
      githubUrl: "https://github.com/SourajShil"
    },
    {
      id: "proj-3",
      title: "Books Data Pipeline",
      subtitle: "Hourly Web Scraping, PySpark Deduplication & Terraform IaC",
      category: "Big Data & Spark",
      featured: true,
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
      description: "An hourly automated data extraction and transformation pipeline that scrapes book catalog data, stores raw JSON in S3, deduplicates and cleans with PySpark, partitions into Parquet, and upserts into Amazon Redshift.",
      bullets: [
        "Hourly scraping pipeline: Web Scraping → Raw JSON in S3 → PySpark cleaning & deduplication → Partitioned Parquet → Redshift Upsert.",
        "Provisioned and managed full AWS infrastructure as code using Terraform.",
        "Integrated Airflow DAGs for hourly batch scheduling, schema drift checks, and operational monitoring."
      ],
      tags: ["Apache Airflow", "PySpark", "Amazon S3", "Amazon Redshift", "Terraform", "Web Scraping", "AWS"],
      demoUrl: "https://github.com/SourajShil",
      githubUrl: "https://github.com/SourajShil"
    },
    {
      id: "proj-4",
      title: "Superstore Sales Data Engineering & BI Dashboard",
      subtitle: "Microsoft Fabric Lakehouse, Notebooks & Power BI",
      category: "Lakehouse & BI",
      featured: true,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "A comprehensive Lakehouse data engineering project on Microsoft Fabric ingesting retail sales data, cleaning via PySpark/Python and SQL Notebooks, and surfacing insights through an interactive Power BI dashboard.",
      bullets: [
        "Ingested and structured Superstore sales data inside Microsoft Fabric Lakehouse.",
        "Authored PySpark, Python, and SQL data extraction, cleansing, and curation pipelines in Fabric Notebooks.",
        "Created an analytics-ready cleaned_superstore_sales gold layer dataset.",
        "Built dynamic Power BI dashboard highlighting KPIs for total sales, regional performance, product categories, and temporal growth trends."
      ],
      tags: ["Microsoft Fabric", "Lakehouse", "PySpark", "Python", "SQL", "Power BI", "Data Analytics"],
      demoUrl: "https://github.com/SourajShil",
      githubUrl: "https://github.com/SourajShil"
    },
    {
      id: "proj-5",
      title: "E-Commerce Product Recommendation System",
      subtitle: "Hybrid Collaborative & Content-Based Filtering with Streamlit",
      category: "ML & Analytics",
      featured: false,
      image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80",
      description: "A machine learning recommendation engine combining Matrix Factorization (SVD) collaborative filtering and TF-IDF cosine similarity content-based filtering, exposed through a responsive Streamlit web application.",
      bullets: [
        "Engineered hybrid recommendation model combining SVD matrix factorization and TF-IDF text embeddings.",
        "Evaluated recommendation ranking performance rigorously using Precision@5, Recall@5, and NDCG@5 metrics.",
        "Deployed interactive user interface on Streamlit for real-time personalized product discovery."
      ],
      tags: ["Python", "Pandas", "Scikit-Surprise", "Streamlit", "TF-IDF", "Machine Learning"],
      demoUrl: "https://github.com/SourajShil",
      githubUrl: "https://github.com/SourajShil"
    }
  ],

  // -----------------------------------------------------------------------
  // 6. TECHNICAL SKILLS MATRIX (Grouped from CV)
  // -----------------------------------------------------------------------
  skillCategories: [
    {
      name: "Core Languages",
      skills: [
        { name: "Python", level: "Intermediate", icon: "terminal" },
        { name: "SQL", level: "Intermediate", icon: "database" },
        { name: "C", level: "Beginner", icon: "code" }
      ]
    },
    {
      name: "Data Engineering & Warehousing",
      skills: [
        { name: "ETL / ELT Pipelines", level: "Intermediate", icon: "activity" },
        { name: "Data Quality & Gating", level: "Intermediate", icon: "check-circle" },
        { name: "Incremental Loads", level: "Intermediate", icon: "git-commit" },
        { name: "Data Warehousing", level: "Intermediate", icon: "database" },
        { name: "Star Schema Modeling", level: "Intermediate", icon: "layers" },
        { name: "Idempotent Writes & Watermarking", level: "Intermediate", icon: "zap" }
      ]
    },
    {
      name: "Big Data & Processing",
      skills: [
        { name: "Apache Spark", level: "Intermediate", icon: "cpu" },
        { name: "PySpark", level: "Intermediate", icon: "sparkles" },
        { name: "Parquet Optimization", level: "Intermediate", icon: "box" },
        { name: "Microsoft Fabric Lakehouse", level: "Beginner", icon: "server" }
      ]
    },
    {
      name: "AWS Cloud Data Stack",
      skills: [
        { name: "Amazon S3", level: "Intermediate", icon: "cloud" },
        { name: "AWS Glue", level: "Intermediate", icon: "cpu" },
        { name: "AWS Lambda", level: "Intermediate", icon: "zap" },
        { name: "Amazon Redshift", level: "Intermediate", icon: "database" },
        { name: "Amazon EventBridge", level: "Intermediate", icon: "activity" },
        { name: "IAM & Secrets Manager", level: "Intermediate", icon: "shield" },
        { name: "AWS CloudWatch", level: "Beginner", icon: "eye" }
      ]
    },
    {
      name: "Orchestration & Transformation",
      skills: [
        { name: "Apache Airflow", level: "Intermediate", icon: "git-branch" },
        { name: "dbt (data build tool)", level: "Intermediate", icon: "layers" },
        { name: "Docker", level: "Beginner", icon: "box" },
        { name: "Terraform (IaC)", level: "Beginner", icon: "compass" }
      ]
    },
    {
      name: "Databases, BI & Analytics",
      skills: [
        { name: "PostgreSQL", level: "Intermediate", icon: "database" },
        { name: "Power BI", level: "Intermediate", icon: "layout" },
        { name: "Metabase", level: "Intermediate", icon: "palette" },
        { name: "Amazon QuickSight", level: "Beginner", icon: "eye" },
        { name: "Pandas & Data Wrangling", level: "Intermediate", icon: "table" },
        { name: "Streamlit", level: "Beginner", icon: "zap" }
      ]
    }
  ],

  // -----------------------------------------------------------------------
  // 7. CERTIFICATIONS (From CV)
  // -----------------------------------------------------------------------
  certifications: [
    {
      title: "Introduction to Data Engineering",
      issuer: "IBM",
      badge: "IBM Certified",
      icon: "database"
    },
    {
      title: "Introduction to Data Science",
      issuer: "IBM",
      badge: "IBM Certified",
      icon: "sparkles"
    },
    {
      title: "Introduction to Artificial Intelligence (AI)",
      issuer: "IBM / Coursera",
      badge: "AI Specialization",
      icon: "cpu"
    },
    {
      title: "C for Everyone: Programming Fundamentals",
      issuer: "Coursera",
      badge: "Programming Fundamentals",
      icon: "code"
    },
    {
      title: "Introduction to Git & GitHub",
      issuer: "Industry Standard",
      badge: "Version Control",
      icon: "git-pull-request"
    },
    {
      title: "Introduction to Contemporary Operating Systems",
      issuer: "Academic",
      badge: "Systems & Architecture",
      icon: "server"
    }
  ],

  // -----------------------------------------------------------------------
  // 8. VISUALIZER & CANVAS SETTINGS
  // -----------------------------------------------------------------------
  visualizer: {
    defaultMode: "ascii", // "ascii" or "fractal"
    asciiChars: "@%#*+=-:. ",
    particlesDensity: 6,
    repelRadius: 80,
    springStrength: 0.08,
    damping: 0.85,
    defaultTheme: "dark"
  }
};
