export type EventType =
  | "conference"
  | "summit"
  | "webinar"
  | "meetup"
  | "workshop"
  | "chalk_talk"
  | "builder_session"
  | "code_talk";

export interface Talk {
  id: string;
  title: string;
  event: string;
  eventType: EventType;
  date: string;
  location?: string;
  description: string;
  tags: string[];
  slidesUrl?: string;
  videoUrl?: string;
  blogUrl?: string;
  pageUrl?: string;
  featured?: boolean;
  sessionId?: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  external: boolean;
  externalUrl?: string;
}

export interface Project {
  name: string;
  title: string;
  description: string;
  url: string;
  language: string;
  kind: "aws-sample" | "personal";
  topics: string[];
}

export const SITE = {
  name: "Shayon Sanyal",
  shortName: "Shayon",
  role: "Principal Solutions Architect",
  org: "Amazon Web Services",
  titleLine: "Databases & Agentic AI",
  tagline:
    "Helping organizations put databases at the center of agentic systems — Aurora PostgreSQL, pgvector, Bedrock, and MCP.",
  lede: "Speaker, author, and open source advocate. Bridging OLTP and retrieval so production databases become memory, tools, and ground truth for agents.",
  location: "New York",
  emailLabel: "Looking for a speaker?",
  photo: "/shayons.jpg",
  stats: [
    { value: "15", label: "Essays" },
    { value: "19", label: "Sessions" },
    { value: "7×", label: "re:Invent" },
  ],
  expertise: [
    "Amazon Aurora",
    "PostgreSQL",
    "Agentic AI",
    "pgvector",
    "Amazon Bedrock",
    "MCP",
  ],
  socials: [
    {
      name: "GitHub",
      href: "https://github.com/shayons",
      description: "Open source and workshop code",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/shayonsanyal/",
      description: "Professional updates",
    },
    {
      name: "X",
      href: "https://x.com/shayon23",
      description: "Notes on databases and AI",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/results?search_query=shayon+sanyal",
      description: "Conference talks",
    },
  ],
} as const;

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  conference: "Conference",
  summit: "Summit",
  webinar: "Webinar",
  meetup: "Meetup",
  workshop: "Workshop",
  chalk_talk: "Chalk talk",
  builder_session: "Builder session",
  code_talk: "Code talk",
};

export const SESSION_FORMATS: EventType[] = [
  "workshop",
  "chalk_talk",
  "builder_session",
  "code_talk",
];

export function isSessionFormat(type: EventType) {
  return SESSION_FORMATS.includes(type);
}

export function youtubeId(url?: string): string | undefined {
  if (!url) return;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([A-Za-z0-9_-]{11})/,
  );
  return match?.[1];
}

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export const talks: Talk[] = [
  {
    id: "pgsummit-us-2026-hybrid-search",
    title:
      "Hybrid Search in PostgreSQL: Combining Vector and Full-Text for Real-World Applications",
    event: "Postgres Summit US 2026",
    eventType: "summit",
    date: "2026-09-30",
    location: "New York, NY",
    description:
      "A practitioner's session on combining pgvector and full-text search in PostgreSQL with Reciprocal Rank Fusion — schema design, SQL patterns, query plans, and the tradeoffs of each arm. No proprietary tools.",
    tags: [
      "PostgreSQL",
      "Hybrid Search",
      "pgvector",
      "Full-Text Search",
      "RRF",
    ],
    pageUrl:
      "https://postgresql.us/events/postgressummitus2026/sessions/session/2349-hybrid-search-in-postgresql-combining-vector-and-full-text-for-real-world-applications/",
    featured: true,
  },
  {
    id: "pgconf-2026-agentic-backbone",
    title: "Building Agentic AI Applications with PostgreSQL as the Backbone",
    event: "Postgres Conference 2026",
    eventType: "conference",
    date: "2026-04-21",
    location: "San Jose, CA",
    description:
      "Architectural patterns for production-grade AI agents with PostgreSQL at the core: episodic, semantic, and procedural memory, tool registries, MCP, and why Postgres beats purpose-built vector databases for agent workloads.",
    tags: [
      "PostgreSQL",
      "Agentic AI",
      "pgvector",
      "MCP",
      "Memory",
    ],
    pageUrl:
      "https://postgresconf.org/conferences/postgresconf_2026/program/proposals/building-agentic-ai-applications-with-postgresql-as-the-backbone",
    featured: true,
  },
  {
    id: "reinvent-2025-chatbots",
    title:
      "Build serverless chatbots using Amazon ElastiCache & Aurora PostgreSQL",
    event: "AWS re:Invent 2025",
    eventType: "conference",
    date: "2025-12-07",
    location: "Las Vegas, NV",
    description:
      "Learn how to build scalable, serverless chatbot applications using Amazon ElastiCache for caching and Amazon Aurora PostgreSQL with pgvector for semantic search and AI capabilities.",
    tags: [
      "AWS re:Invent",
      "Amazon Aurora",
      "ElastiCache",
      "Chatbots",
      "Serverless",
      "GenAI",
    ],
    videoUrl: "https://www.youtube.com/watch?v=eCiR1mDe5Rw",
    featured: true,
    sessionId: "DAT314",
  },
  {
    id: "reinvent-2025-chalk-talk-dat428",
    title: "Build a cost-effective RAG-based gen AI application with Amazon Aurora",
    event: "AWS re:Invent 2025",
    eventType: "chalk_talk",
    date: "2025-12-05",
    location: "Las Vegas, NV",
    description:
      "Interactive chalk talk on building cost-effective RAG-based generative AI applications using Amazon Aurora PostgreSQL.",
    tags: [
      "AWS re:Invent",
      "Amazon Aurora",
      "RAG",
      "GenAI",
      "Cost Optimization",
    ],
    sessionId: "DAT428",
  },
  {
    id: "reinvent-2025-chalk-talk-dat309",
    title: "Build Agentic workflows with Aurora and MCP",
    event: "AWS re:Invent 2025",
    eventType: "chalk_talk",
    date: "2025-12-05",
    location: "Las Vegas, NV",
    description:
      "Interactive chalk talk exploring how to build agentic AI workflows using Amazon Aurora PostgreSQL and the Model Context Protocol (MCP).",
    tags: ["AWS re:Invent", "Amazon Aurora", "Agentic AI", "MCP", "GenAI"],
    sessionId: "DAT309",
    blogUrl:
      "https://github.com/aws-samples/sample-dat309-agentic-workflows-aurora-mcp",
  },
  {
    id: "reinvent-2025-builder-dat409",
    title: "Implement hybrid search with Aurora PostgreSQL for MCP retrieval",
    event: "AWS re:Invent 2025",
    eventType: "builder_session",
    date: "2025-12-04",
    location: "Las Vegas, NV",
    description:
      "Hands-on builder session implementing hybrid search capabilities with Amazon Aurora PostgreSQL for Model Context Protocol (MCP) retrieval patterns.",
    tags: ["AWS re:Invent", "Amazon Aurora", "Hybrid Search", "MCP", "pgvector"],
    sessionId: "DAT409",
    blogUrl:
      "https://github.com/aws-samples/sample-dat409-hybrid-search-aurora-mcp",
  },
  {
    id: "reinvent-2025-workshop-dat406",
    title: "Build agentic AI-powered search with Amazon Aurora and Amazon RDS",
    event: "AWS re:Invent 2025",
    eventType: "workshop",
    date: "2025-12-03",
    location: "Las Vegas, NV",
    description:
      "Hands-on workshop building agentic AI-powered search applications using Amazon Aurora and Amazon RDS.",
    tags: [
      "AWS re:Invent",
      "Amazon Aurora",
      "Amazon RDS",
      "Agentic AI",
      "Search",
    ],
    sessionId: "DAT406",
    blogUrl:
      "https://github.com/aws-samples/sample-dat406-build-agentic-ai-powered-search-apg",
  },
  {
    id: "aurora-decade-2025",
    title: "A decade of innovation with Amazon Aurora",
    event: "AWS Live Stream 2025",
    eventType: "webinar",
    date: "2025-08-21",
    location: "Virtual",
    description:
      "Celebrating 10 years of Amazon Aurora with a retrospective on key innovations, architectural decisions, and the future roadmap for AWS's cloud-native relational database.",
    tags: ["Amazon Aurora", "AWS", "Database Innovation", "Cloud Native"],
    videoUrl: "https://www.youtube.com/live/IMAp3XRtR30",
    featured: true,
  },
  {
    id: "pgconf-2025-oracle-postgresql",
    title: "Replacing Oracle Features in PostgreSQL: HA, Functions & Extensibility",
    event: "Postgres Conference 2025",
    eventType: "conference",
    date: "2025-03-19",
    location: "Orlando, FL",
    description:
      "A comprehensive guide to replacing Oracle database features when migrating to PostgreSQL, covering high availability patterns, stored procedures, and extensibility options.",
    tags: [
      "PostgreSQL",
      "Oracle Migration",
      "High Availability",
      "Database Migration",
    ],
    videoUrl: "https://www.youtube.com/watch?v=SkXiijAyrHg",
    featured: true,
  },
  {
    id: "reinvent-2024-chatbots",
    title:
      "Build serverless chatbots using Amazon ElastiCache & Aurora PostgreSQL",
    event: "AWS re:Invent 2024",
    eventType: "conference",
    date: "2024-12-03",
    location: "Las Vegas, NV",
    description:
      "Discover how to architect serverless chatbot solutions leveraging Amazon ElastiCache for high-performance caching and Amazon Aurora PostgreSQL for persistent storage and vector search.",
    tags: [
      "AWS re:Invent",
      "Amazon Aurora",
      "ElastiCache",
      "Chatbots",
      "Serverless",
      "GenAI",
    ],
    videoUrl: "https://www.youtube.com/watch?v=g5-hcwwuzn0",
    featured: true,
    sessionId: "DAT326",
  },
  {
    id: "baffle-2024-vectordb-security",
    title:
      "Vector Databases and Securing Sensitive Data (Data Encryption for Gen AI Apps)",
    event: "Baffle Webinar",
    eventType: "webinar",
    date: "2024-12-01",
    location: "Virtual",
    description:
      "Exploring security challenges in GenAI applications using vector databases, and how to protect sensitive data through encryption of embeddings and associated data chunks.",
    tags: ["Vector Databases", "GenAI", "Data Security", "Encryption", "LLM"],
    videoUrl: "https://info.baffle.io/webinar/2024/12/vectordb-datasecurity",
  },
  {
    id: "aurora-bedrock-rag",
    title:
      "How to use Aurora as a Knowledge Base for Amazon Bedrock for RAG | The Data Dive on AWS OnAir S01",
    event: "The Data Dive on AWS OnAir",
    eventType: "webinar",
    date: "2024-08-10",
    location: "Virtual",
    description:
      "Learn how to integrate Amazon Aurora PostgreSQL as a knowledge base for Amazon Bedrock to build powerful Retrieval Augmented Generation (RAG) applications.",
    tags: ["Amazon Aurora", "Amazon Bedrock", "RAG", "GenAI", "pgvector"],
    videoUrl: "https://www.youtube.com/watch?v=MpmV-MehtWs",
    featured: true,
  },
  {
    id: "pgconf-2024-pgvector-oltp",
    title: "Enhancing OLTP Systems with pgvector: Best Practices in Database Design",
    event: "Postgres Conference 2024",
    eventType: "conference",
    date: "2024-04-18",
    location: "San Jose, CA",
    description:
      "Learn best practices for integrating pgvector into OLTP systems, including database design patterns, indexing strategies, and performance optimization techniques for GenAI workloads.",
    tags: ["PostgreSQL", "pgvector", "OLTP", "GenAI", "Database Design"],
  },
  {
    id: "pgvector-ai-apps",
    title: "What's next in pgvector: Building AI-enabled apps with PostgreSQL",
    event: "AWS Databases in 15",
    eventType: "webinar",
    date: "2024-03-20",
    location: "Virtual",
    description:
      "Explore the latest features in pgvector and learn how to build AI-enabled applications using PostgreSQL's vector search capabilities.",
    tags: ["pgvector", "PostgreSQL", "GenAI", "Vector Search", "AI Applications"],
    videoUrl: "https://www.youtube.com/watch?v=CzeTgNoHXN0",
  },
  {
    id: "json-postgresql-2023",
    title: "JSON in PostgreSQL - Learning with a case study",
    event: "Community Talk",
    eventType: "meetup",
    date: "2023-06-15",
    location: "Virtual",
    description:
      "A hands-on exploration of JSON capabilities in PostgreSQL through a practical case study, covering JSON/JSONB data types, operators, and performance optimization.",
    tags: ["PostgreSQL", "JSON", "JSONB", "Data Modeling"],
    videoUrl: "https://www.youtube.com/watch?v=oEy1a0qDaKk",
  },
  {
    id: "pgconf-nyc-2022-finserv",
    title: "Why PostgreSQL is becoming the standard in Financial Services",
    event: "PGConf NYC 2022",
    eventType: "conference",
    date: "2022-09-22",
    location: "New York, NY",
    description:
      "Explore why financial services organizations are increasingly adopting PostgreSQL for mission-critical workloads, covering compliance, performance, and ecosystem considerations.",
    tags: ["PostgreSQL", "Financial Services", "Enterprise", "Compliance"],
    videoUrl: "https://www.youtube.com/watch?v=TsY7E-LJIRk",
  },
  {
    id: "pgconf-sv-2022-aurora-ha-dr",
    title: "Amazon Aurora Global Database Design Patterns for HA and DR",
    event: "Postgres Conference Silicon Valley 2022",
    eventType: "conference",
    date: "2022-04-08",
    location: "San Jose, CA",
    description:
      "Design patterns and best practices for implementing high availability and disaster recovery solutions using Amazon Aurora Global Database.",
    tags: [
      "Amazon Aurora",
      "PostgreSQL",
      "High Availability",
      "Disaster Recovery",
      "AWS",
    ],
  },
  {
    id: "pgconf-sv-2022-global-database",
    title: "Using Global Database in Amazon Aurora PostgreSQL",
    event: "Postgres Conference Silicon Valley 2022",
    eventType: "conference",
    date: "2022-04-08",
    location: "San Jose, CA",
    description:
      "Deep dive into Amazon Aurora PostgreSQL Global Database, covering architecture, configuration, and use cases for cross-region deployments.",
    tags: ["Amazon Aurora", "PostgreSQL", "Global Database", "AWS"],
  },
  {
    id: "aurora-deep-dive-2021",
    title: "Amazon Aurora PostgreSQL Deep Dive",
    event: "Data.SQL.Saturday.LA 2021",
    eventType: "conference",
    date: "2021-04-10",
    location: "Los Angeles, CA (Virtual)",
    description:
      "A comprehensive deep dive into Amazon Aurora PostgreSQL architecture, features, and best practices for building high-performance applications.",
    tags: ["Amazon Aurora", "PostgreSQL", "AWS", "Database Architecture"],
    videoUrl: "https://www.youtube.com/watch?v=iUaSd-hDdaM",
  },
];

export const posts: Post[] = [
  {
    id: "s3-vectors-aurora-sql",
    title:
      "Query billion-scale vectors with SQL: Integrating Amazon S3 Vectors and Aurora PostgreSQL",
    description:
      "Query Amazon S3 Vectors from Aurora PostgreSQL with standard SQL, joining billion-scale similarity search with relational filters in a single statement.",
    pubDate: "2026-05-08",
    tags: [
      "Amazon Aurora",
      "Amazon S3 Vectors",
      "pgvector",
      "Vector Search",
      "SQL",
    ],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/query-billion-scale-vectors-with-sql-integrating-amazon-s3-vectors-and-aurora-postgresql/",
  },
  {
    id: "ring-billion-scale-pgvector",
    title:
      "Ring’s Billion-Scale Semantic Video Search with Amazon RDS for PostgreSQL and pgvector",
    description:
      "How Ring built billion-scale semantic video search on Amazon RDS for PostgreSQL and pgvector — architecture, cost, and lessons at 100–200 billion embeddings.",
    pubDate: "2026-04-21",
    tags: [
      "Amazon RDS",
      "PostgreSQL",
      "pgvector",
      "Vector Search",
      "Case Study",
    ],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/rings-billion-scale-semantic-video-search-with-amazon-rds-for-postgresql-and-pgvector/",
  },
  {
    id: "netflix-aurora-consolidation",
    title:
      "Netflix consolidates relational database infrastructure on Amazon Aurora, achieving up to 75% improved performance",
    description:
      "Learn how Netflix consolidated their relational database infrastructure on Amazon Aurora, resulting in significant performance improvements and operational efficiency.",
    pubDate: "2025-11-26",
    tags: ["Amazon Aurora", "PostgreSQL", "Case Study", "Performance"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/netflix-consolidates-relational-database-infrastructure-on-amazon-aurora-achieving-up-to-75-improved-performance/",
  },
  {
    id: "pgvector-080-aurora",
    title:
      "Supercharging vector search performance and relevance with pgvector 0.8.0 on Amazon Aurora PostgreSQL",
    description:
      "Explore the latest pgvector 0.8.0 features and learn how to supercharge vector search performance and relevance on Amazon Aurora PostgreSQL.",
    pubDate: "2025-05-28",
    tags: ["pgvector", "Amazon Aurora", "PostgreSQL", "Vector Search", "GenAI"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/supercharging-vector-search-performance-and-relevance-with-pgvector-0-8-0-on-amazon-aurora-postgresql/",
  },
  {
    id: "fundapps-babelfish-migration",
    title:
      "FundApps's journey from SQL Server to Amazon Aurora Serverless v2 with Babelfish",
    description:
      "Discover how FundApps successfully migrated from SQL Server to Amazon Aurora Serverless v2 using Babelfish for Aurora PostgreSQL.",
    pubDate: "2024-12-16",
    tags: ["Amazon Aurora", "Babelfish", "Migration", "SQL Server", "Case Study"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/fundappss-journey-from-sql-server-to-amazon-aurora-serverless-v2-with-babelfish/",
  },
  {
    id: "bedrock-knowledge-bases-aurora",
    title:
      "Accelerate your generative AI application development with Amazon Bedrock Knowledge Bases Quick Create and Amazon Aurora Serverless",
    description:
      "Learn how to rapidly build generative AI applications using Amazon Bedrock Knowledge Bases Quick Create integrated with Amazon Aurora Serverless.",
    pubDate: "2024-12-06",
    tags: ["Amazon Bedrock", "Amazon Aurora", "GenAI", "RAG", "Knowledge Bases"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/accelerate-your-generative-ai-application-development-with-amazon-bedrock-knowledge-bases-quick-create-and-amazon-aurora-serverless/",
  },
  {
    id: "database-for-genai",
    title:
      "Key considerations when choosing a database for your generative AI applications",
    description:
      "A comprehensive guide to selecting the right database for your generative AI applications, covering vector capabilities, scalability, and performance considerations.",
    pubDate: "2024-07-15",
    tags: ["GenAI", "Database Selection", "Vector Search", "Architecture"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/key-considerations-when-choosing-a-database-for-your-generative-ai-applications/",
  },
  {
    id: "open-raven-io-optimized",
    title:
      "Unlocking cost-optimization: Open Raven's journey with Amazon Aurora I/O-Optimized leads to 60% savings",
    description:
      "See how Open Raven achieved 60% cost savings by migrating to Amazon Aurora I/O-Optimized for their data security platform.",
    pubDate: "2023-10-10",
    tags: ["Amazon Aurora", "Cost Optimization", "I/O-Optimized", "Case Study"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/unlocking-cost-optimization-open-ravens-journey-with-amazon-aurora-i-o-optimized-leads-to-60-savings/",
  },
  {
    id: "rds-logical-replication-analytics",
    title:
      "Data consolidation for analytical applications using logical replication for Amazon RDS Multi-AZ clusters",
    description:
      "Learn how to consolidate data for analytical workloads using logical replication capabilities in Amazon RDS Multi-AZ database clusters.",
    pubDate: "2023-08-14",
    tags: ["Amazon RDS", "Logical Replication", "Analytics", "Multi-AZ"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/data-consolidation-for-analytical-applications-using-logical-replication-for-amazon-rds-multi-az-clusters/",
  },
  {
    id: "pgvector-nlp-chatbots",
    title:
      "Leverage pgvector and Amazon Aurora PostgreSQL for Natural Language Processing, Chatbots and Sentiment Analysis",
    description:
      "Build NLP applications, chatbots, and sentiment analysis solutions using pgvector and Amazon Aurora PostgreSQL for vector similarity search.",
    pubDate: "2023-07-13",
    tags: ["pgvector", "Amazon Aurora", "PostgreSQL", "NLP", "Chatbots", "GenAI"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/leverage-pgvector-and-amazon-aurora-postgresql-for-natural-language-processing-chatbots-and-sentiment-analysis/",
  },
  {
    id: "snowflake-s3-glue",
    title:
      "Ingest data from Snowflake to Amazon S3 using AWS Glue Marketplace Connectors",
    description:
      "Learn how to efficiently ingest data from Snowflake to Amazon S3 using AWS Glue Marketplace Connectors for seamless data integration.",
    pubDate: "2022-03-16",
    tags: ["AWS Glue", "Snowflake", "Amazon S3", "Data Integration"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/big-data/ingest-data-from-snowflake-to-amazon-s3-using-aws-glue-marketplace-connectors/",
  },
  {
    id: "aurora-postgresql-replication",
    title: "Understand replication capabilities in Amazon Aurora PostgreSQL",
    description:
      "A deep dive into the replication capabilities available in Amazon Aurora PostgreSQL, including physical and logical replication options.",
    pubDate: "2021-10-04",
    tags: ["Amazon Aurora", "PostgreSQL", "Replication", "High Availability"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/understand-replication-capabilities-in-amazon-aurora-postgresql/",
  },
  {
    id: "aurora-goldengate-active-active",
    title:
      "Implement active/active replication between Amazon Aurora clusters using Oracle GoldenGate",
    description:
      "Set up active/active replication between Amazon Aurora clusters using Oracle GoldenGate for high availability and disaster recovery scenarios.",
    pubDate: "2021-09-27",
    tags: ["Amazon Aurora", "Oracle GoldenGate", "Replication", "Disaster Recovery"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/database/implement-active-active-replication-between-amazon-aurora-clusters-using-oracle-goldengate/",
  },
  {
    id: "lawn-monitor-ml-iot",
    title:
      "Building a lawn monitor and weed detection solution with AWS machine learning and IoT services",
    description:
      "Build an intelligent lawn monitoring system with weed detection using AWS machine learning and IoT services for smart agriculture applications.",
    pubDate: "2020-05-08",
    tags: ["Machine Learning", "IoT", "AWS", "Computer Vision"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/machine-learning/building-a-lawn-monitor-and-weed-detection-solution-with-aws-machine-learning-and-iot-services/",
  },
  {
    id: "s3-spend-glue-redshift",
    title: "Analyze your Amazon S3 spend using AWS Glue and Amazon Redshift",
    description:
      "Learn how to analyze and optimize your Amazon S3 storage costs using AWS Glue for ETL and Amazon Redshift for analytics.",
    pubDate: "2020-01-24",
    tags: ["Amazon S3", "AWS Glue", "Amazon Redshift", "Cost Optimization"],
    external: true,
    externalUrl:
      "https://aws.amazon.com/blogs/big-data/analyze-your-amazon-s3-spend-using-aws-glue-and-amazon-redshift/",
  },
];

export const projects: Project[] = [
  {
    name: "sample-pellier-agentic-search-apg",
    title: "Pellier · Agentic search",
    description:
      "Artisan-retail concierge on Aurora PostgreSQL: pgvector, hybrid retrieval, Strands specialists, and Bedrock AgentCore — the Builders' Session reference.",
    url: "https://github.com/aws-samples/sample-pellier-agentic-search-apg",
    language: "Python",
    kind: "aws-sample",
    topics: ["agentic-ai", "pgvector", "agentcore", "aurora"],
  },
  {
    name: "sample-agentic-hybrid-retrieval-aurora-postgresql",
    title: "Mosaic · Hybrid retrieval",
    description:
      "Production-shaped hybrid search on Aurora: FTS, pg_trgm, pgvector HNSW, RRF, and rerank over a 500k-product catalog.",
    url: "https://github.com/aws-samples/sample-agentic-hybrid-retrieval-aurora-postgresql",
    language: "Python",
    kind: "aws-sample",
    topics: ["hybrid-search", "pgvector", "aurora", "rrf"],
  },
  {
    name: "sample-stateful-agentic-ai-workflows-aurora-mcp-agentcore",
    title: "Meridian · Stateful workflows",
    description:
      "Travel concierge with durable agent state: Aurora checkpoints, MCP, AgentCore, LangGraph, and a live recovery path.",
    url: "https://github.com/aws-samples/sample-stateful-agentic-ai-workflows-aurora-mcp-agentcore",
    language: "Python",
    kind: "aws-sample",
    topics: ["agentic-ai", "mcp", "agentcore", "aurora"],
  },
  {
    name: "aurora-postgresql-pgvector",
    title: "Aurora PostgreSQL + pgvector",
    description:
      "Enterprise-ready generative AI use cases powered by pgvector, Amazon Aurora PostgreSQL, Amazon Bedrock, and AWS MCP servers.",
    url: "https://github.com/aws-samples/aurora-postgresql-pgvector",
    language: "Python",
    kind: "aws-sample",
    topics: ["pgvector", "aurora", "bedrock", "genai"],
  },
  {
    name: "sample-dat309-agentic-workflows-aurora-mcp",
    title: "DAT309 · Agentic workflows",
    description:
      "ClickShop: agentic architecture from a single agent to multi-agent systems with Aurora PostgreSQL and MCP.",
    url: "https://github.com/aws-samples/sample-dat309-agentic-workflows-aurora-mcp",
    language: "Python",
    kind: "aws-sample",
    topics: ["agentic-ai", "mcp", "aurora", "strands"],
  },
  {
    name: "sample-dat406-build-agentic-ai-powered-search-apg",
    title: "DAT406 · Agentic search",
    description:
      "re:Invent 2025 workshop: agentic AI-powered search with Aurora PostgreSQL, pgvector, and multi-agent orchestration.",
    url: "https://github.com/aws-samples/sample-dat406-build-agentic-ai-powered-search-apg",
    language: "Python",
    kind: "aws-sample",
    topics: ["agentic-ai", "pgvector", "semantic-search", "reinvent"],
  },
  {
    name: "sample-dat409-hybrid-search-aurora-mcp",
    title: "DAT409 · Hybrid search",
    description:
      "re:Invent 2025 builder: hybrid search on Aurora PostgreSQL combining fuzzy matching, semantic search, and MCP.",
    url: "https://github.com/aws-samples/sample-dat409-hybrid-search-aurora-mcp",
    language: "Python",
    kind: "aws-sample",
    topics: ["hybrid-search", "mcp", "aurora", "reinvent"],
  },
  {
    name: "DAT301-reinvent-2024",
    title: "DAT301 · GenAI search",
    description:
      "re:Invent 2024 workshop: generative AI-powered search with Aurora PostgreSQL, Bedrock, and Blaize Bazaar.",
    url: "https://github.com/aws-samples/DAT301-reinvent-2024",
    language: "Python",
    kind: "aws-sample",
    topics: ["genai", "aurora", "bedrock", "reinvent"],
  },
  {
    name: "talks",
    title: "Talks & workshop materials",
    description: "Slide decks, labs, and supporting material from conference sessions.",
    url: "https://github.com/shayons/talks",
    language: "Python",
    kind: "personal",
    topics: ["talks", "workshops"],
  },
];

export function isUpcoming(iso: string) {
  return iso >= new Date().toISOString().slice(0, 10);
}

export function featuredTalks(limit = 3): Talk[] {
  const upcoming = talks
    .filter((t) => isUpcoming(t.date))
    .sort((a, b) => a.date.localeCompare(b.date));
  const featured = talks
    .filter((t) => t.featured && !isUpcoming(t.date))
    .sort((a, b) => b.date.localeCompare(a.date));
  return [...upcoming, ...featured].slice(0, limit);
}

export function recentPosts(limit = 3): Post[] {
  return [...posts]
    .sort((a, b) => b.pubDate.localeCompare(a.pubDate))
    .slice(0, limit);
}

export function sortedTalks(): Talk[] {
  return [...talks].sort((a, b) => b.date.localeCompare(a.date));
}

export function sortedPosts(): Post[] {
  return [...posts].sort((a, b) => b.pubDate.localeCompare(a.pubDate));
}

export function yearOf(iso: string) {
  return Number(iso.slice(0, 4));
}

export function formatDate(iso: string, style: "short" | "long" = "short") {
  const date = new Date(`${iso}T00:00:00`);
  if (style === "long") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
