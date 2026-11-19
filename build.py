"""Builds the website into the dist/ folder.

Run locally:   pip install -r requirements.txt && python build.py
On GitHub this runs automatically on every push (see .github/workflows/deploy.yml).
"""
import datetime as dt
import html
import re
import shutil
from pathlib import Path

import markdown
import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = Path(__file__).parent
CONTENT = ROOT / "content"
OUT = ROOT / "dist"


def load_yaml(path):
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    return data or []


def slugify(text):
    text = text.lower()
    for a, b in {"ı": "i", "ğ": "g", "ü": "u", "ş": "s", "ö": "o", "ç": "c"}.items():
        text = text.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def load_posts():
    posts = []
    md = markdown.Markdown(extensions=["fenced_code", "tables", "toc", "codehilite", "attr_list"],
                           extension_configs={"codehilite": {"guess_lang": False, "css_class": "code"}})
    for path in sorted((CONTENT / "posts").glob("*.md")):
        if path.name.startswith("_"):
            continue
        raw = path.read_text(encoding="utf-8")
        match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", raw, re.S)
        if not match:
            raise SystemExit(f"{path.name}: the post must start with a --- block (see _TEMPLATE.md)")
        meta = yaml.safe_load(match.group(1)) or {}
        if meta.get("draft"):
            continue
        for key in ("title", "date"):
            if key not in meta:
                raise SystemExit(f"{path.name}: '{key}' is missing at the top of the post")
        date = meta["date"]
        if isinstance(date, str):
            date = dt.date.fromisoformat(date)
        md.reset()
        body = md.convert(match.group(2))
        words = len(re.sub(r"<[^>]+>", " ", body).split())
        name = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", path.stem)
        posts.append({
            "title": meta["title"],
            "date": date,
            "summary": meta.get("summary", ""),
            "tags": meta.get("tags", []),
            "slug": meta.get("slug") or slugify(name),
            "body": body,
            "minutes": max(1, round(words / 220)),
            "year": date.year,
        })
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts


def bold_me(authors, me="E. Isaoglu"):
    safe = html.escape(authors)
    return safe.replace(me, f"<strong>{me}</strong>")


def main():
    site = load_yaml(ROOT / "site.yml")
    site["year"] = dt.date.today().year
    site["built"] = dt.date.today().isoformat()
    data = {
        "skills": load_yaml(CONTENT / "skills.yml"),
        "experience": load_yaml(CONTENT / "experience.yml"),
        "projects": load_yaml(CONTENT / "projects.yml"),
        "papers": load_yaml(CONTENT / "papers.yml"),
        "posts": load_posts(),
    }
    for paper in data["papers"]:
        paper["authors_html"] = bold_me(paper.get("authors", ""))

    env = Environment(loader=FileSystemLoader(ROOT / "templates"),
                      autoescape=select_autoescape(["html", "xml"]))
    env.filters["nice_date"] = lambda d: d.strftime("%-d %B %Y")
    env.filters["iso"] = lambda d: d.isoformat()

    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(ROOT / "static", OUT)

    def render(template, dest, **ctx):
        path = OUT / dest
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(env.get_template(template).render(site=site, **data, **ctx), encoding="utf-8")

    render("index.html", "index.html", page="home")
    render("experience.html", "experience/index.html", page="experience")
    render("projects.html", "projects/index.html", page="projects")
    render("research.html", "research/index.html", page="research")
    render("blog_index.html", "blog/index.html", page="blog")
    for post in data["posts"]:
        render("post.html", f"blog/{post['slug']}/index.html", page="post", post=post)
    render("404.html", "404.html", page="404")
    render("sitemap.xml", "sitemap.xml")
    render("feed.xml", "blog/feed.xml")
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {site['url']}/sitemap.xml\n")
    (OUT / ".nojekyll").write_text("")
    print(f"Built {len(data['posts'])} post(s), {len(data['projects'])} project(s), "
          f"{len(data['papers'])} paper(s) into {OUT.name}/")


if __name__ == "__main__":
    main()
