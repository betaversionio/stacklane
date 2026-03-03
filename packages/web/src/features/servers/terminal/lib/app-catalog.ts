import type { InstallableApp, AppCategory } from "./app-catalog.types";

const icon = (name: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;

const shIcon = (name: string) =>
  `https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/${name}.svg`;

export const appCatalog: InstallableApp[] = [
  // ── Web Server ──
  {
    id: "nginx",
    name: "Nginx",
    description: "High-performance HTTP server and reverse proxy",
    iconUrl: icon("nginx"),
    category: "Web Server",
    fields: [],
    dependencies: [],
    check: "command -v nginx",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y nginx && sudo systemctl enable nginx && sudo systemctl start nginx",
      dnf: "sudo dnf install -y nginx && sudo systemctl enable nginx && sudo systemctl start nginx",
    },
  },
  {
    id: "apache",
    name: "Apache",
    description: "The Apache HTTP Server",
    iconUrl: icon("apache"),
    category: "Web Server",
    fields: [],
    dependencies: [],
    check: "command -v apache2 || command -v httpd",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y apache2 && sudo systemctl enable apache2 && sudo systemctl start apache2",
      dnf: "sudo dnf install -y httpd && sudo systemctl enable httpd && sudo systemctl start httpd",
    },
  },
  {
    id: "caddy",
    name: "Caddy",
    description: "Fast, multi-platform web server with automatic HTTPS",
    iconUrl: icon("caddy"),
    category: "Web Server",
    fields: [],
    dependencies: [],
    check: "command -v caddy",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list && sudo apt-get update && sudo apt-get install -y caddy",
      dnf: "sudo dnf install -y 'dnf-command(copr)' && sudo dnf copr enable @caddy/caddy -y && sudo dnf install -y caddy",
      yum: "sudo yum install -y yum-plugin-copr && sudo yum copr enable @caddy/caddy -y && sudo yum install -y caddy",
    },
  },

  // ── Database ──
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Powerful open-source relational database",
    iconUrl: icon("postgresql"),
    category: "Database",
    fields: [
      {
        id: "password",
        type: "password",
        label: "Superuser Password",
        description: "Password for the postgres superuser",
        required: true,
        placeholder: "Enter a secure password",
      },
    ],
    dependencies: [],
    check: "command -v psql",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib && sudo systemctl enable postgresql && sudo systemctl start postgresql && sudo -u postgres psql -c \"ALTER USER postgres PASSWORD '{{password}}';\"",
      dnf: "sudo dnf install -y postgresql-server postgresql-contrib && sudo postgresql-setup --initdb && sudo systemctl enable postgresql && sudo systemctl start postgresql && sudo -u postgres psql -c \"ALTER USER postgres PASSWORD '{{password}}';\"",
    },
  },
  {
    id: "mysql",
    name: "MySQL / MariaDB",
    description: "Popular open-source relational database",
    iconUrl: icon("mysql"),
    category: "Database",
    fields: [
      {
        id: "password",
        type: "password",
        label: "Root Password",
        description: "Password for the root user",
        required: true,
        placeholder: "Enter a secure password",
      },
    ],
    dependencies: [],
    check: "command -v mysql",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo debconf-set-selections <<< \"mariadb-server mariadb-server/root_password password {{password}}\" && sudo debconf-set-selections <<< \"mariadb-server mariadb-server/root_password_again password {{password}}\" && sudo apt-get install -y mariadb-server && sudo systemctl enable mariadb && sudo systemctl start mariadb",
      dnf: "sudo dnf install -y mariadb-server && sudo systemctl enable mariadb && sudo systemctl start mariadb && sudo mysqladmin -u root password '{{password}}' 2>/dev/null",
    },
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "Document-oriented NoSQL database",
    iconUrl: icon("mongodb"),
    category: "Database",
    fields: [],
    dependencies: [],
    check: "command -v mongod",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y gnupg curl && curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg && echo 'deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list && sudo apt-get update && sudo apt-get install -y mongodb-org && sudo systemctl enable mongod && sudo systemctl start mongod",
      dnf: "printf '[mongodb-org-7.0]\\nname=MongoDB Repository\\nbaseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/\\ngpgcheck=1\\nenabled=1\\ngpgkey=https://pgp.mongodb.com/server-7.0.asc\\n' | sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo && sudo dnf install -y mongodb-org && sudo systemctl enable mongod && sudo systemctl start mongod",
    },
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory data store used as database, cache, and broker",
    iconUrl: icon("redis"),
    category: "Database",
    fields: [],
    dependencies: [],
    check: "command -v redis-server || command -v redis-cli",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y redis-server && sudo systemctl enable redis-server && sudo systemctl start redis-server",
      dnf: "sudo dnf install -y redis && sudo systemctl enable redis && sudo systemctl start redis",
    },
  },
  {
    id: "sqlite",
    name: "SQLite",
    description: "Self-contained, serverless SQL database engine",
    iconUrl: icon("sqlite"),
    category: "Database",
    fields: [],
    dependencies: [],
    check: "command -v sqlite3",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y sqlite3 libsqlite3-dev && sqlite3 --version",
      dnf: "sudo dnf install -y sqlite sqlite-devel && sqlite3 --version",
    },
  },

  // ── Runtime ──
  {
    id: "nodejs",
    name: "Node.js (nvm)",
    description: "JavaScript runtime built on V8, installed via nvm",
    iconUrl: icon("nodejs"),
    category: "Runtime",
    fields: [
      {
        id: "version",
        type: "select",
        label: "Node.js Version",
        description: "Select the Node.js version to install",
        required: true,
        defaultValue: "22",
        options: [
          { label: "v24 (Latest)", value: "24" },
          { label: "v22 (LTS)", value: "22" },
          { label: "v20 (LTS)", value: "20" },
          { label: "v18 (Maintenance)", value: "18" },
        ],
      },
    ],
    dependencies: [],
    check: "command -v node",
    script:
      'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm install {{version}} && nvm use {{version}} && node --version',
  },
  {
    id: "python",
    name: "Python",
    description: "Versatile programming language with pip package manager",
    iconUrl: icon("python"),
    category: "Runtime",
    fields: [],
    dependencies: [],
    check: "command -v python3",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y python3 python3-pip python3-venv && python3 --version",
      dnf: "sudo dnf install -y python3 python3-pip && python3 --version",
    },
  },
  {
    id: "go",
    name: "Go",
    description: "Statically typed, compiled language by Google",
    iconUrl: icon("go"),
    category: "Runtime",
    fields: [
      {
        id: "version",
        type: "text",
        label: "Go Version",
        description: "e.g. 1.22.0",
        required: true,
        defaultValue: "1.22.0",
        placeholder: "1.22.0",
      },
    ],
    dependencies: [],
    check: "command -v go",
    script:
      "curl -fsSL \"https://go.dev/dl/go{{version}}.linux-amd64.tar.gz\" -o /tmp/go.tar.gz && sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf /tmp/go.tar.gz && rm /tmp/go.tar.gz && echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc && export PATH=$PATH:/usr/local/go/bin && go version",
  },
  {
    id: "ruby",
    name: "Ruby",
    description: "Dynamic language optimized for programmer happiness",
    iconUrl: icon("ruby"),
    category: "Runtime",
    fields: [],
    dependencies: [],
    check: "command -v ruby",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y ruby-full && ruby --version",
      dnf: "sudo dnf install -y ruby ruby-devel && ruby --version",
    },
  },
  {
    id: "php",
    name: "PHP",
    description: "Popular server-side scripting language",
    iconUrl: icon("php"),
    category: "Runtime",
    fields: [],
    dependencies: [],
    check: "command -v php",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y php php-cli php-common php-mbstring php-xml php-curl && php --version",
      dnf: "sudo dnf install -y php php-cli php-common php-mbstring php-xml && php --version",
    },
  },
  {
    id: "java",
    name: "Java (OpenJDK)",
    description: "OpenJDK Java runtime and development kit",
    iconUrl: icon("java"),
    category: "Runtime",
    fields: [],
    dependencies: [],
    check: "command -v java",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y default-jdk && java --version",
      dnf: "sudo dnf install -y java-17-openjdk-devel && java --version",
    },
  },
  {
    id: "bun",
    name: "Bun",
    description: "All-in-one JavaScript runtime & toolkit",
    iconUrl: icon("bun"),
    category: "Runtime",
    fields: [],
    dependencies: [],
    check: "command -v bun",
    script:
      "curl -fsSL https://bun.sh/install | bash && source ~/.bashrc && bun --version",
  },
  {
    id: "deno",
    name: "Deno",
    description: "Secure runtime for JavaScript and TypeScript",
    iconUrl: icon("denojs"),
    category: "Runtime",
    fields: [],
    dependencies: [],
    check: "command -v deno",
    script:
      'curl -fsSL https://deno.land/install.sh | sh && export DENO_INSTALL="$HOME/.deno" && export PATH="$DENO_INSTALL/bin:$PATH" && deno --version',
  },

  // ── DevTools ──
  {
    id: "git",
    name: "Git",
    description: "Distributed version control system",
    iconUrl: icon("git"),
    category: "DevTools",
    fields: [],
    dependencies: [],
    check: "command -v git",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y git && git --version",
      dnf: "sudo dnf install -y git && git --version",
    },
  },
  {
    id: "pm2",
    name: "PM2",
    description: "Production process manager for Node.js applications",
    iconUrl: icon("nodejs"),
    category: "DevTools",
    fields: [],
    dependencies: ["nodejs"],
    check: "command -v pm2",
    script: "npm install -g pm2 && pm2 --version",
  },
  {
    id: "gh-runner",
    name: "GitHub Actions Runner",
    description: "Self-hosted runner for GitHub Actions workflows",
    iconUrl: icon("github"),
    category: "DevTools",
    fields: [
      {
        id: "url",
        type: "text",
        label: "Repository URL",
        description: "GitHub repository URL (e.g. https://github.com/org/repo)",
        required: true,
        placeholder: "https://github.com/org/repo",
      },
      {
        id: "token",
        type: "password",
        label: "Runner Token",
        description:
          "Registration token from GitHub Settings > Actions > Runners",
        required: true,
        placeholder: "Paste runner token",
      },
    ],
    dependencies: [],
    script:
      "mkdir -p ~/actions-runner && cd ~/actions-runner && curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64-2.321.0.tar.gz && tar xzf ./actions-runner-linux-x64.tar.gz && ./config.sh --url {{url}} --token {{token}} --unattended && sudo ./svc.sh install && sudo ./svc.sh start",
  },
  {
    id: "vim",
    name: "Vim",
    description: "Highly configurable text editor",
    iconUrl: icon("vim"),
    category: "DevTools",
    fields: [],
    dependencies: [],
    check: "command -v vim",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y vim && vim --version | head -1",
      dnf: "sudo dnf install -y vim-enhanced && vim --version | head -1",
    },
  },
  {
    id: "nano",
    name: "Nano",
    description: "Simple, modeless terminal text editor",
    iconUrl: icon("linux"),
    category: "DevTools",
    fields: [],
    dependencies: [],
    check: "command -v nano",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y nano && nano --version | head -1",
      dnf: "sudo dnf install -y nano && nano --version | head -1",
    },
  },

  // ── Security ──
  {
    id: "certbot",
    name: "Certbot",
    description: "Free SSL/TLS certificates from Let's Encrypt",
    iconUrl: icon("letsencrypt"),
    category: "Security",
    fields: [
      {
        id: "domain",
        type: "text",
        label: "Domain",
        description: "Domain name to issue a certificate for",
        required: true,
        placeholder: "example.com",
      },
      {
        id: "email",
        type: "text",
        label: "Email",
        description: "Email for renewal notifications",
        required: true,
        placeholder: "admin@example.com",
      },
    ],
    dependencies: [],
    // No check — always run (installs if missing, then issues cert)
    script:
      "sudo certbot certonly --standalone -d {{domain}} --non-interactive --agree-tos -m {{email}}",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y certbot && sudo certbot certonly --standalone -d {{domain}} --non-interactive --agree-tos -m {{email}}",
      dnf: "sudo dnf install -y epel-release && sudo dnf install -y certbot && sudo certbot certonly --standalone -d {{domain}} --non-interactive --agree-tos -m {{email}}",
    },
  },
  {
    id: "ufw",
    name: "UFW",
    description: "Uncomplicated Firewall for managing iptables",
    iconUrl: icon("linux"),
    category: "Security",
    fields: [],
    dependencies: [],
    // No check — always run (installs if missing, then enables)
    script: "sudo ufw allow OpenSSH && sudo ufw --force enable && sudo ufw status",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y ufw && sudo ufw allow OpenSSH && sudo ufw --force enable && sudo ufw status",
      dnf: "sudo dnf install -y epel-release && sudo dnf install -y ufw && sudo ufw allow OpenSSH && sudo ufw --force enable && sudo ufw status",
    },
  },
  {
    id: "fail2ban",
    name: "Fail2Ban",
    description: "Intrusion prevention framework that bans abusive IPs",
    iconUrl: icon("linux"),
    category: "Security",
    fields: [],
    dependencies: [],
    check: "command -v fail2ban-client",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y fail2ban && sudo systemctl enable fail2ban && sudo systemctl start fail2ban && sudo fail2ban-client status",
      dnf: "sudo dnf install -y epel-release && sudo dnf install -y fail2ban && sudo systemctl enable fail2ban && sudo systemctl start fail2ban && sudo fail2ban-client status",
    },
  },

  // ── Container ──
  {
    id: "docker",
    name: "Docker",
    description: "Platform for building and running containerized applications",
    iconUrl: icon("docker"),
    category: "Container",
    fields: [],
    dependencies: [],
    check: "command -v docker",
    script:
      "curl -fsSL https://get.docker.com | sh && sudo systemctl enable docker && sudo systemctl start docker && sudo usermod -aG docker $USER && docker --version",
  },
  {
    id: "docker-compose",
    name: "Docker Compose",
    description: "Define and run multi-container Docker applications",
    iconUrl: icon("docker"),
    category: "Container",
    fields: [],
    dependencies: ["docker"],
    check: "docker compose version",
    script: "",
    scripts: {
      apt: "sudo apt-get update && sudo apt-get install -y docker-compose-plugin && docker compose version",
      dnf: "sudo dnf install -y docker-compose-plugin && docker compose version",
    },
  },
  {
    id: "kubectl",
    name: "kubectl",
    description: "CLI for controlling Kubernetes clusters",
    iconUrl: icon("kubernetes"),
    category: "Container",
    fields: [],
    dependencies: [],
    check: "command -v kubectl",
    script:
      'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && rm kubectl && kubectl version --client',
  },

  // ── Self-Hosted Apps ──
  {
    id: "supabase",
    name: "Supabase",
    description:
      "Open-source Firebase alternative with Postgres, Auth, Storage, and Realtime",
    iconUrl: shIcon("supabase"),
    category: "Self-Hosted Apps",
    fields: [
      {
        id: "postgres_password",
        type: "password",
        label: "Database Password",
        description: "Password for the Supabase Postgres database",
        required: true,
        placeholder: "Enter a secure password",
      },
    ],
    dependencies: ["docker", "docker-compose"],
    script:
      'git clone --depth 1 https://github.com/supabase/supabase.git ~/supabase && cd ~/supabase/docker && cp .env.example .env && sed -i "s|POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD={{postgres_password}}|" .env && sudo docker compose pull && sudo docker compose up -d',
  },
  {
    id: "appwrite",
    name: "Appwrite",
    description:
      "Secure backend platform for web, mobile, and Flutter developers",
    iconUrl: shIcon("appwrite"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script:
      'mkdir -p ~/appwrite && sudo docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock --volume ~/appwrite:/usr/src/code/appwrite:rw --entrypoint="install" appwrite/appwrite:latest',
  },
  {
    id: "pocketbase",
    name: "PocketBase",
    description:
      "Open-source backend with realtime database, auth, and file storage",
    iconUrl: shIcon("pocketbase"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name pocketbase --restart unless-stopped -p 8090:8090 -v pocketbase_data:/pb/pb_data ghcr.io/muchobien/pocketbase:latest",
  },
  {
    id: "metabase",
    name: "Metabase",
    description: "Business intelligence and analytics dashboards anyone can use",
    iconUrl: shIcon("metabase"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name metabase --restart unless-stopped -p 3000:3000 -v metabase_data:/metabase-data -e MB_DB_FILE=/metabase-data/metabase.db metabase/metabase:latest",
  },
  {
    id: "ghost",
    name: "Ghost",
    description: "Professional publishing platform for blogs and newsletters",
    iconUrl: shIcon("ghost"),
    category: "Self-Hosted Apps",
    fields: [
      {
        id: "url",
        type: "text",
        label: "Site URL",
        description: "Public URL of your Ghost site",
        required: true,
        defaultValue: "http://localhost:2368",
        placeholder: "https://blog.example.com",
      },
    ],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name ghost --restart unless-stopped -p 2368:2368 -v ghost_data:/var/lib/ghost/content -e NODE_ENV=production -e url='{{url}}' ghost:latest",
  },
  {
    id: "wordpress",
    name: "WordPress",
    description: "World's most popular CMS with MariaDB backend",
    iconUrl: icon("wordpress"),
    category: "Self-Hosted Apps",
    fields: [
      {
        id: "db_password",
        type: "password",
        label: "Database Password",
        description: "Password for the WordPress database",
        required: true,
        placeholder: "Enter a secure password",
      },
    ],
    dependencies: ["docker"],
    script:
      "sudo docker network create wp-net 2>/dev/null; sudo docker run -d --name wordpress-db --restart unless-stopped --network wp-net -v wordpress_db_data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD='{{db_password}}' -e MYSQL_DATABASE=wordpress mariadb:latest && sudo docker run -d --name wordpress --restart unless-stopped --network wp-net -p 8080:80 -v wordpress_data:/var/www/html -e WORDPRESS_DB_HOST=wordpress-db -e WORDPRESS_DB_PASSWORD='{{db_password}}' wordpress:latest",
  },
  {
    id: "gitea",
    name: "Gitea",
    description: "Lightweight self-hosted Git service",
    iconUrl: shIcon("gitea"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name gitea --restart unless-stopped -p 3100:3000 -p 2222:22 -v gitea_data:/data gitea/gitea:latest",
  },
  {
    id: "nextcloud",
    name: "Nextcloud",
    description: "Self-hosted file sync, share, and collaboration platform",
    iconUrl: shIcon("nextcloud"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name nextcloud --restart unless-stopped -p 8180:80 -v nextcloud_data:/var/www/html nextcloud:latest",
  },
  {
    id: "minio",
    name: "MinIO",
    description: "High-performance S3-compatible object storage",
    iconUrl: shIcon("minio"),
    category: "Self-Hosted Apps",
    fields: [
      {
        id: "access_key",
        type: "text",
        label: "Root User",
        description: "MinIO root access key (min 3 characters)",
        required: true,
        defaultValue: "minioadmin",
        placeholder: "minioadmin",
      },
      {
        id: "secret_key",
        type: "password",
        label: "Root Password",
        description: "MinIO root secret key (min 8 characters)",
        required: true,
        placeholder: "Enter a secure password",
      },
    ],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name minio --restart unless-stopped -p 9000:9000 -p 9001:9001 -v minio_data:/data -e MINIO_ROOT_USER='{{access_key}}' -e MINIO_ROOT_PASSWORD='{{secret_key}}' minio/minio:latest server /data --console-address \":9001\"",
  },
  {
    id: "vaultwarden",
    name: "Vaultwarden",
    description: "Lightweight Bitwarden-compatible password manager",
    iconUrl: shIcon("vaultwarden"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name vaultwarden --restart unless-stopped -p 8280:80 -v vaultwarden_data:/data vaultwarden/server:latest",
  },
  {
    id: "plausible",
    name: "Plausible Analytics",
    description: "Privacy-friendly alternative to Google Analytics",
    iconUrl: shIcon("plausible"),
    category: "Self-Hosted Apps",
    fields: [
      {
        id: "base_url",
        type: "text",
        label: "Base URL",
        description: "Public URL where Plausible will be accessible",
        required: true,
        defaultValue: "http://localhost:8000",
        placeholder: "https://analytics.example.com",
      },
    ],
    dependencies: ["docker", "docker-compose"],
    script:
      'git clone --depth 1 https://github.com/plausible/community-edition.git ~/plausible && cd ~/plausible && echo "BASE_URL={{base_url}}" > plausible-conf.env && echo "SECRET_KEY_BASE=$(openssl rand -base64 48)" >> plausible-conf.env && sudo docker compose up -d',
  },
  {
    id: "nocodb",
    name: "NocoDB",
    description: "Open-source Airtable alternative and smart spreadsheet",
    iconUrl: shIcon("nocodb"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name nocodb --restart unless-stopped -p 8380:8080 -v nocodb_data:/usr/app/data/ nocodb/nocodb:latest",
  },
  {
    id: "directus",
    name: "Directus",
    description: "Open-source headless CMS and data platform",
    iconUrl: shIcon("directus"),
    category: "Self-Hosted Apps",
    fields: [
      {
        id: "admin_email",
        type: "text",
        label: "Admin Email",
        description: "Email for the initial admin account",
        required: true,
        placeholder: "admin@example.com",
      },
      {
        id: "admin_password",
        type: "password",
        label: "Admin Password",
        description: "Password for the initial admin account",
        required: true,
        placeholder: "Enter a secure password",
      },
    ],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name directus --restart unless-stopped -p 8055:8055 -v directus_data:/directus/database -v directus_uploads:/directus/uploads -e SECRET=$(openssl rand -hex 32) -e ADMIN_EMAIL='{{admin_email}}' -e ADMIN_PASSWORD='{{admin_password}}' -e DB_CLIENT=sqlite3 -e DB_FILENAME=/directus/database/data.db directus/directus:latest",
  },
  {
    id: "umami",
    name: "Umami",
    description: "Simple, fast, privacy-focused website analytics",
    iconUrl: shIcon("umami"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker", "docker-compose"],
    script:
      "git clone --depth 1 https://github.com/umami-software/umami.git ~/umami && cd ~/umami && sudo docker compose up -d",
  },
  {
    id: "listmonk",
    name: "Listmonk",
    description:
      "High-performance self-hosted newsletter and mailing list manager",
    iconUrl: shIcon("listmonk"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker", "docker-compose"],
    script:
      "mkdir -p ~/listmonk && cd ~/listmonk && curl -fsSL https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml -o docker-compose.yml && sudo docker compose up -d db && sleep 5 && sudo docker compose run --rm app ./listmonk --install --yes && sudo docker compose up -d",
  },
  {
    id: "coolify",
    name: "Coolify",
    description:
      "Open-source self-hostable Heroku / Netlify / Vercel alternative",
    iconUrl: shIcon("coolify"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script: "curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash",
  },
  {
    id: "portainer",
    name: "Portainer",
    description: "Web-based Docker and Kubernetes management UI",
    iconUrl: shIcon("portainer"),
    category: "Self-Hosted Apps",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker volume create portainer_data && sudo docker run -d --name portainer --restart unless-stopped -p 9443:9443 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest",
  },
  {
    id: "meilisearch",
    name: "Meilisearch",
    description: "Lightning-fast open-source search engine",
    iconUrl: shIcon("meilisearch"),
    category: "Self-Hosted Apps",
    fields: [
      {
        id: "master_key",
        type: "password",
        label: "Master Key",
        description: "API master key for securing your Meilisearch instance",
        required: true,
        placeholder: "Enter a secure master key",
      },
    ],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name meilisearch --restart unless-stopped -p 7700:7700 -v meilisearch_data:/meili_data -e MEILI_MASTER_KEY='{{master_key}}' getmeili/meilisearch:latest",
  },

  // ── Monitoring ──
  {
    id: "grafana",
    name: "Grafana",
    description: "Open-source observability and data visualization platform",
    iconUrl: icon("grafana"),
    category: "Monitoring",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name grafana --restart unless-stopped -p 3200:3000 -v grafana_data:/var/lib/grafana grafana/grafana-oss:latest",
  },
  {
    id: "prometheus",
    name: "Prometheus",
    description: "Open-source systems monitoring and alerting toolkit",
    iconUrl: icon("prometheus"),
    category: "Monitoring",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name prometheus --restart unless-stopped -p 9090:9090 -v prometheus_data:/prometheus prom/prometheus:latest",
  },
  {
    id: "uptime-kuma",
    name: "Uptime Kuma",
    description: "Fancy self-hosted uptime monitoring tool",
    iconUrl: shIcon("uptime-kuma"),
    category: "Monitoring",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name uptime-kuma --restart unless-stopped -p 3001:3001 -v uptime-kuma_data:/app/data louislam/uptime-kuma:latest",
  },

  // ── Automation ──
  {
    id: "n8n",
    name: "n8n",
    description: "Extendable workflow automation tool with 400+ integrations",
    iconUrl: shIcon("n8n"),
    category: "Automation",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name n8n --restart unless-stopped -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n:latest",
  },

  // ── AI / ML ──
  {
    id: "ollama",
    name: "Ollama",
    description: "Run large language models locally on your server",
    iconUrl: shIcon("ollama"),
    category: "AI / ML",
    fields: [],
    dependencies: [],
    script: "curl -fsSL https://ollama.com/install.sh | sh",
  },
  {
    id: "open-webui",
    name: "Open WebUI",
    description:
      "ChatGPT-style web interface for Ollama and other LLM backends",
    iconUrl: shIcon("open-webui"),
    category: "AI / ML",
    fields: [],
    dependencies: ["docker"],
    script:
      "sudo docker run -d --name open-webui --restart unless-stopped -p 3300:8080 --add-host=host.docker.internal:host-gateway -v open-webui_data:/app/backend/data ghcr.io/open-webui/open-webui:main",
  },
];

export const appCatalogMap = new Map(appCatalog.map((a) => [a.id, a]));

export const appCategories: AppCategory[] = [
  "Self-Hosted Apps",
  "Monitoring",
  "Automation",
  "AI / ML",
  "Web Server",
  "Database",
  "Runtime",
  "DevTools",
  "Security",
  "Container",
];
