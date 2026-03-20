import spacy
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import sent_tokenize
from typing import Dict
import logging
import re

logger = logging.getLogger(__name__)

# Ensure NLTK data is downloaded
try:
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('averaged_perceptron_tagger', quiet=True)
    nltk.download('averaged_perceptron_tagger_eng', quiet=True)
except Exception as e:
    logger.warning(f"Error downloading NLTK data: {e}")

class NLPService:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            logger.warning("spacy en_core_web_sm model not found. Attempting to download now or use fallback.")
            self.nlp = None
            
        # Comprehensive Skill dictionaries for classification with variations
        self.skill_categories = {
            "Programming": [
                "python", "java", "c++", "c", "c#", "javascript", "typescript", "ruby", "go", "rust", 
                "php", "swift", "kotlin", "html", "css", "sql", "bash", "shell", "dart", "scala",
                "perl", "r", "matlab", "groovy", "haskell", "elixir", "clojure", "assembly",
                "vb.net", "objective-c", "lua", "julia"
            ],
            "Machine Learning": [
                "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "xgboost", "pandas", "numpy", 
                "matplotlib", "seaborn", "nlp", "computer vision", "opencv", "scipy", "llm", "genai", 
                "transformers", "huggingface", "spacy", "gensim", "nltk", "jax", "mxnet", "theano",
                "lightgbm", "catboost", "onnx", "mlflow", "wandb", "ray", "dask", "polars",
                "arrow", "faiss", "qdrant", "weaviate", "pinecone", "langchain", "llamaindex"
            ],
            "Data Analysis": [
                "sql", "excel", "tableau", "powerbi", "power bi", "looker", "data visualization", 
                "statistics", "a/b testing", "data mining", "hadoop", "spark", "kafka", "flink",
                "prestodb", "cassandra", "elasticsearch", "splunk", "datadog", "pandas", "polars",
                "duckdb", "snowflake", "bigquery", "redshift", "teradata", "informatica"
            ],
            "Cloud": [
                "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "terraform", 
                "serverless", "ec2", "s3", "lambda", "ecs", "eks", "aks", "cloud run",
                "cloudformation", "sam", "arm", "pulumi", "cdk", "helm", "istio", "linkerd",
                "openshift", "rancher", "nomad", "mesos", "cf", "heroku", "digitalocean"
            ],
            "DevOps": [
                "jenkins", "github actions", "gitlab ci", "ci/cd", "ansible", "puppet", "chef", 
                "linux", "bash", "git", "prometheus", "grafana", "elk", "elk stack",
                "newrelic", "datadog", "splunk", "terraform", "ansible", "saltstack", "argocd",
                "spinnaker", "hashicorp", "vault", "consul", "packer", "vagrant", "circleci",
                "travis", "codecov", "sonarqube", "artifactory", "nexus", "docker registry"
            ],
            "Frontend": [
                "react", "vue", "angular", "svelte", "nextjs", "next.js", "nuxtjs", "nuxt.js",
                "gatsby", "remix", "astro", "solid", "preact", "qwik", "lit", "web components",
                "tailwindcss", "bootstrap", "material", "chakra", "ant design", "semantic ui",
                "storybook", "webpack", "vite", "parcel", "esbuild", "rollup", "turbopack",
                "typescript", "javascript", "babel", "eslint", "prettier", "jest", "vitest",
                "cypress", "playwright", "puppeteer", "selenium", "webdriver", "graphql"
            ],
            "Backend": [
                "fastapi", "django", "flask", "tornado", "pyramid", "aiohttp", "fastapi",
                "nodejs", "express", "nestjs", "hapi", "koa", "restify", "loopback",
                "java", "spring", "spring boot", "quarkus", "micronaut", "play", "akka",
                "go", "gin", "echo", "fiber", "beego", "gorilla", "chi", "http.go",
                "ruby", "rails", "sinatra", "hanami", "sequel", "activerecord",
                "php", "laravel", "symfony", "yii", "cakephp", "zend", "doctrine",
                ".net", "asp.net", "entity framework", "dapper", "servicestack"
            ],
            "Soft Skills": [
                "leadership", "communication", "teamwork", "problem solving", "time management", 
                "agile", "scrum", "kanban", "project management", "critical thinking", 
                "collaboration", "adaptability", "mentoring", "coaching", "negotiation",
                "public speaking", "presentation", "stakeholder management", "conflict resolution"
            ]
        }
        
    def extract_skills(self, text: str) -> list[str]:
        if not text:
            return []
            
        skills = set()
        text_lower = text.lower()
        
        # 1. Match known skills with word boundaries
        for category, category_skills in self.skill_categories.items():
            for skill in category_skills:
                # Special handling for .net, .js, etc.
                if skill in ["c++", "c#", "vb.net", "asp.net", ".net"]:
                    pattern = r'\b' + re.escape(skill) + r'\b|\b' + skill.replace('.', r'\.') + r'\b'
                elif '.' in skill:
                    pattern = skill.replace('.', r'\.')
                else:
                    pattern = r'\b' + re.escape(skill) + r'\b'
                
                if re.search(pattern, text_lower):
                    # Format nicely
                    if skill.lower() in ["aws", "gcp"]:
                        formatted = skill.upper()
                    elif skill.lower() in ["html", "css", "sql", "c++", "c#"]:
                        formatted = skill.upper() if len(skill) <= 3 else skill.title()
                    else:
                        formatted = skill.title()
                    skills.add(formatted)
                    
        # 2. Extract Entities using spaCy NER
        if self.nlp:
            doc = self.nlp(text)
            for ent in doc.ents:
                if ent.label_ in ["PRODUCT", "ORG", "GPE"]:
                    val = ent.text.strip()
                    if 2 < len(val) < 30 and "\n" not in val and not val.isdigit():
                        # Filter out common non-skill entities
                        if not any(exclude in val.lower() for exclude in ["the", "inc", "ltd", "corp", "company"]):
                            skills.add(val)
        
        # 3. Pattern-based detection for version numbers and frameworks
        version_pattern = r'(\w+)\s*(?:\(v?\d+\.?\d*\)|[\d\.]+)'
        for match in re.finditer(version_pattern, text):
            skill_name = match.group(1).strip()
            if len(skill_name) > 2 and not skill_name.isdigit():
                skills.add(skill_name.title())
                        
        return sorted(list(skills))

    def extract_keywords_tfidf(self, text: str, top_n: int = 15) -> list[str]:
        if not text or len(text.strip()) == 0:
            return []
            
        try:
            # Use more aggressive stopword filtering for technical resumes
            vectorizer = TfidfVectorizer(
                stop_words='english', 
                max_features=150,
                min_df=1,
                max_df=0.95,
                ngram_range=(1, 2)  # Include bigrams for better phrase matching
            )
            X = vectorizer.fit_transform([text])
            feature_names = vectorizer.get_feature_names_out()
            scores = X.toarray().flatten()
            
            keyword_scores = list(zip(feature_names, scores))
            keyword_scores.sort(key=lambda x: x[1], reverse=True)
            
            # Filter and return top keywords
            keywords = []
            for kw, score in keyword_scores[:top_n]:
                # Skip numeric and very short terms
                if not kw.isdigit() and len(kw) > 2:
                    keywords.append(kw)
            return keywords
        except Exception as e:
            logger.error(f"TF-IDF extraction failed: {e}")
            return []

    def extract_technical_skills(self, text: str) -> Dict[str, list]:
        """Extract technical skills with pattern matching for versions and variants."""
        technical_patterns = {
            "languages": r'\b(python|java|javascript|typescript|kotlin|go|rust|ruby|php|swift|c\+\+|c#|vb\.net)\b',
            "frameworks": r'\b(fastapi|django|flask|spring|nest\.?js|react|vue|angular|express|laravel|symfony)\b',
            "databases": r'\b(postgresql|mysql|mongodb|cassandra|redis|elasticsearch|dynamodb|bigquery|snowflake)\b',
            "cloud": r'\b(aws|azure|gcp|heroku|digitalocean|linode|vultr)\b',
            "tools": r'\b(git|docker|kubernetes|jenkins|terraform|ansible|jira|slack)\b'
        }
        
        result = {}
        text_lower = text.lower()
        
        for category, pattern in technical_patterns.items():
            matches = set()
            for match in re.finditer(pattern, text_lower):
                matches.add(match.group(1).title())
            result[category] = sorted(list(matches))
            
        return result

    def extract_all(self, text: str):
        """Extracts skills, keywords, and classifies them into domains."""
        skills = self.extract_skills(text)
        keywords = self.extract_keywords_tfidf(text)
        
        # Combine them and normalize
        combined_raw = list(set([s.lower() for s in skills] + [k.lower() for k in keywords]))
        
        categorized = self.classify_skills(combined_raw)
        
        return {
            "skills": skills,
            "keywords": keywords,
            "categorized_skills": categorized,
            "flat_skills": combined_raw
        }

    def classify_skills(self, skills_list: list) -> dict:
        classified = {cat: [] for cat in self.skill_categories.keys()}
        classified["Other"] = []
        
        # Flatten dictionary for quick matching
        flat_map = {}
        for cat, items in self.skill_categories.items():
            for item in items:
                flat_map[item] = cat
                
        for skill in skills_list:
            skill_lower = skill.strip().lower()
            if not skill_lower:
                continue
                
            found = False
            for known_skill, category in flat_map.items():
                if known_skill == skill_lower:
                    classified[category].append(skill_lower)
                    found = True
                    break
                    
            if not found:
                if len(skill_lower) > 3:  # avoid noise
                    classified["Other"].append(skill_lower)
                    
        # Capitalize and deduplicate
        formatted_classified = {}
        for cat, items in classified.items():
            unique_items = sorted(list(set(items)))
            formatted_classified[cat] = [s.capitalize() if len(s)>3 else s.upper() for s in unique_items]
            
        return {k: v for k, v in formatted_classified.items() if v}

    def compare_skills(self, resume_skills: list, jd_skills: list) -> list:
        """Compares resume skills vs Job Description skills with smart matching."""
        resume_lower = [s.lower() for s in resume_skills]
        
        comparison = []
        for jd_sk in jd_skills:
            status = "Missing"
            jd_sk_low = jd_sk.lower()
            
            # Exact match
            if jd_sk_low in resume_lower:
                status = "Match"
            else:
                # Fuzzy matching for variations
                for r_sk in resume_lower:
                    # Partial match (handles "python" vs "python 3.10")
                    if len(jd_sk_low) > 3 and jd_sk_low in r_sk:
                        status = "Partial Match"
                        break
                    elif len(r_sk) > 3 and r_sk in jd_sk_low:
                        status = "Partial Match"
                        break
                    # Levenshtein-style approach for similar skills
                    elif self._skills_similar(r_sk, jd_sk_low):
                        status = "Partial Match"
                        break
            
            comparison.append({
                "skill": jd_sk,
                "status": status
            })
            
        return comparison
    
    def _skills_similar(self, skill1: str, skill2: str, threshold: float = 0.8) -> bool:
        """Check if two skills are similar using edit distance."""
        if len(skill1) < 3 or len(skill2) < 3:
            return False
        
        # Simple similarity check using common substrings
        s1_set = set(skill1.split())
        s2_set = set(skill2.split())
        
        if not s1_set or not s2_set:
            return False
        
        intersection = len(s1_set & s2_set)
        union = len(s1_set | s2_set)
        
        return (intersection / union) >= threshold if union > 0 else False
    
    def get_skill_gaps(self, resume_skills: list, jd_skills: list) -> Dict:
        """Analyze skill gaps between resume and job description."""
        resume_lower = [s.lower() for s in resume_skills]
        jd_lower = [s.lower() for s in jd_skills]
        
        matched_skills = []
        missing_skills = []
        partial_skills = []
        
        for jd_skill in jd_lower:
            if jd_skill in resume_lower:
                matched_skills.append(jd_skill)
            else:
                # Check for partial matches
                is_partial = False
                for resume_skill in resume_lower:
                    if self._skills_similar(resume_skill, jd_skill):
                        partial_skills.append(jd_skill)
                        is_partial = True
                        break
                
                if not is_partial:
                    missing_skills.append(jd_skill)
        
        # Remove duplicates and sort
        matched_skills = sorted(list(set(matched_skills)))
        partial_skills = sorted(list(set(partial_skills)))
        missing_skills = sorted(list(set(missing_skills)))
        
        return {
            "matched": matched_skills,
            "partial": partial_skills,
            "missing": missing_skills,
            "match_percentage": round((len(matched_skills) / len(jd_lower) * 100), 2) if jd_lower else 0,
            "total_jd_skills": len(jd_lower),
            "matched_count": len(matched_skills),
            "missing_count": len(missing_skills)
        }
            
        return comparison
